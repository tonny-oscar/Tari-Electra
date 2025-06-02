'use server';

import { db } from '@/lib/firebase/client'; // Ensure this points to client SDK
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { unstable_noStore as noStore } from 'next/cache';
import type { HomepageSettings } from '@/lib/types';

const SETTINGS_COLLECTION = 'settings';
const HOMEPAGE_DOC_ID = 'homepage';

const defaultSettings: HomepageSettings = {
  heroImageUrl: 'https://placehold.co/800x600.png',
  heroImageHint: 'modern building technology',
};

export async function getHomepageSettings(): Promise<HomepageSettings> {
  noStore(); // Disable caching
  console.log('[getHomepageSettings] Fetching homepage settings...');

  try {
    if (!db) {
      console.error('[getHomepageSettings] Firestore DB instance is missing.');
      return { ...defaultSettings };
    }

    const settingsRef = doc(db, SETTINGS_COLLECTION, HOMEPAGE_DOC_ID);
    const snapshot = await getDoc(settingsRef);

    if (snapshot.exists()) {
      const data = snapshot.data() as HomepageSettings;
      console.log('[getHomepageSettings] Retrieved data:', data);
      return { ...defaultSettings, ...data };
    } else {
      console.log('[getHomepageSettings] Document not found. Initializing with default.');
      await setDoc(settingsRef, defaultSettings);
      return { ...defaultSettings };
    }
  } catch (err) {
    console.error('[getHomepageSettings] Error:', err);
    return { ...defaultSettings };
  }
}

export async function updateHomepageSettings(
  updates: Partial<HomepageSettings>
): Promise<HomepageSettings | null> {
  console.log('[updateHomepageSettings] Updating homepage with:', updates);

  try {
    if (!db) {
      console.error('[updateHomepageSettings] Firestore DB instance is missing.');
      return null;
    }

    const settingsRef = doc(db, SETTINGS_COLLECTION, HOMEPAGE_DOC_ID);
    const current = await getHomepageSettings();

    const updatedSettings: HomepageSettings = {
      heroImageUrl:
        updates.heroImageUrl?.trim() === ''
          ? defaultSettings.heroImageUrl
          : updates.heroImageUrl ?? current.heroImageUrl,
      heroImageHint:
        updates.heroImageHint?.trim() === ''
          ? defaultSettings.heroImageHint
          : updates.heroImageHint ?? current.heroImageHint,
    };

    await setDoc(settingsRef, updatedSettings, { merge: true });

    const refreshed = await getDoc(settingsRef);
    if (refreshed.exists()) {
      console.log('[updateHomepageSettings] Update successful.');
      return refreshed.data() as HomepageSettings;
    }

    return null;
  } catch (err) {
    console.error('[updateHomepageSettings] Error:', err);
    return null;
  }
}
