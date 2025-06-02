
'use server';

import { db } from '@/lib/firebase/client';
import type { HomepageSettings } from '@/lib/types';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { unstable_noStore as noStore } from 'next/cache';

const SETTINGS_COLLECTION = 'settings';
const HOMEPAGE_DOC_ID = 'homepage'; // Fixed document ID for homepage settings

const defaultSettings: HomepageSettings = {
  heroImageUrl: 'https://placehold.co/800x600.png',
  heroImageHint: 'modern building technology',
};

export async function getHomepageSettings(): Promise<HomepageSettings> {
  noStore();
  console.log('[FirestoreHomepageSettings - getHomepageSettings] Attempting to fetch homepage settings.');
  try {
    if (!db) {
      console.error('[FirestoreHomepageSettings - getHomepageSettings] Firestore db instance is not available.');
      return { ...defaultSettings }; // Return default if DB fails
    }
    const settingsDocRef = doc(db, SETTINGS_COLLECTION, HOMEPAGE_DOC_ID);
    const docSnap = await getDoc(settingsDocRef);
    if (docSnap.exists()) {
      const settings = docSnap.data() as HomepageSettings;
      console.log('[FirestoreHomepageSettings - getHomepageSettings] Fetched settings:', settings);
      // Merge with defaults to ensure all expected fields are present, especially if new fields are added to defaultSettings later
      return { ...defaultSettings, ...settings };
    } else {
      console.log('[FirestoreHomepageSettings - getHomepageSettings] Homepage settings document does not exist. Creating and returning default settings.');
      // Attempt to create the document with defaults if it doesn't exist
      await setDoc(settingsDocRef, defaultSettings);
      return { ...defaultSettings };
    }
  } catch (error) {
    console.error('[FirestoreHomepageSettings - getHomepageSettings] Error fetching homepage settings:', error);
    return { ...defaultSettings }; // Return default on error
  }
}

export async function updateHomepageSettings(
  updatedSettingsData: Partial<HomepageSettings>
): Promise<HomepageSettings | null> {
  console.log('[FirestoreHomepageSettings - updateHomepageSettings] Attempting to update homepage settings with data:', updatedSettingsData);
  try {
    if (!db) {
      console.error('[FirestoreHomepageSettings - updateHomepageSettings] Firestore db instance is not available.');
      return null;
    }
    const settingsDocRef = doc(db, SETTINGS_COLLECTION, HOMEPAGE_DOC_ID);
    
    // Fetch current settings to merge correctly and handle empty string updates
    const currentSettings = await getHomepageSettings(); // This will return defaults if doc doesn't exist
    
    const newSettings: HomepageSettings = {
      heroImageUrl: updatedSettingsData.heroImageUrl === '' ? defaultSettings.heroImageUrl : (updatedSettingsData.heroImageUrl || currentSettings.heroImageUrl || defaultSettings.heroImageUrl),
      heroImageHint: updatedSettingsData.heroImageHint === '' ? defaultSettings.heroImageHint : (updatedSettingsData.heroImageHint || currentSettings.heroImageHint || defaultSettings.heroImageHint),
    };

    await setDoc(settingsDocRef, newSettings, { merge: true }); // Use merge: true to update or create
    console.log('[FirestoreHomepageSettings - updateHomepageSettings] Homepage settings updated successfully.');
    
    const updatedSnap = await getDoc(settingsDocRef);
    if (updatedSnap.exists()) {
      return updatedSnap.data() as HomepageSettings;
    }
    return null; // Should not happen if setDoc was successful
  } catch (error) {
    console.error('[FirestoreHomepageSettings - updateHomepageSettings] Error updating homepage settings:', error);
    return null;
  }
}
