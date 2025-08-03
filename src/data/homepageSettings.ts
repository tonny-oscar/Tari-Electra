// homepageSettings.ts
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import type { HomepageSettings } from '@/lib/types';

const DEFAULT_SETTINGS: HomepageSettings = {
  heroTitle: 'Welcome to Tari Electra',
  heroSubtitle: 'Your trusted partner for electrical solutions',
  heroImageUrl: '',
  heroImageHint: 'electrical services hero image',
  aboutTitle: 'About Us',
  aboutContent: 'We are committed to providing reliable electrical services.',
  aboutImageUrl: '',
  servicesTitle: 'Our Services',
  servicesSubtitle: 'Discover our comprehensive range of electrical services',
  contactTitle: 'Contact Us',
  contactSubtitle: 'Get in touch with our expert team',
};

export async function getHomepageSettings(): Promise<HomepageSettings> {
  console.log('[getHomepageSettings] Fetching homepage settings...');
  
  try {
    const docRef = doc(db, 'settings', 'homepage');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as HomepageSettings;
      console.log('[getHomepageSettings] Settings retrieved successfully');
      return { ...DEFAULT_SETTINGS, ...data };
    } else {
      console.log('[getHomepageSettings] No settings found, initializing defaults');
      // Initialize with default settings
      await updateDoc(docRef, DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
  } catch (error) {
    console.error('[getHomepageSettings] Error:', error);
    return DEFAULT_SETTINGS;
  }
}

export async function updateHomepageSettings(settings: Partial<HomepageSettings>): Promise<HomepageSettings> {
  try {
    const docRef = doc(db, 'settings', 'homepage');
    const updatedData = {
      ...settings,
      updatedAt: new Date().toISOString(),
    };
    
    await updateDoc(docRef, updatedData);
    console.log('[updateHomepageSettings] Settings updated successfully');
    
    // Return the updated settings
    const updatedDoc = await getDoc(docRef);
    if (updatedDoc.exists()) {
      return { ...DEFAULT_SETTINGS, ...updatedDoc.data() } as HomepageSettings;
    }
    
    return { ...DEFAULT_SETTINGS, ...updatedData } as HomepageSettings;
  } catch (error) {
    console.error('[updateHomepageSettings] Error:', error);
    throw error;
  }
}

// Client-side version (if needed for SSR/CSR hybrid pages)
export async function getHomepageSettingsClient(): Promise<HomepageSettings> {
  try {
    const response = await fetch('/api/settings/homepage');
    if (!response.ok) {
      throw new Error('Failed to fetch settings');
    }
    const data = await response.json();
    return { ...DEFAULT_SETTINGS, ...data };
  } catch (error) {
    console.error('Error fetching homepage settings:', error);
    return DEFAULT_SETTINGS;
  }
}
