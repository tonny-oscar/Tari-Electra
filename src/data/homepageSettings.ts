// homepageSettings.ts
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { HomepageSettings } from '@/lib/types';

export async function getHomepageSettings(): Promise<HomepageSettings | null> {
  console.log('[getHomepageSettings] Fetching homepage settings...');
  
  try {
    // Match your existing Firestore rules structure
    const docRef = doc(db, 'homepageSettings', 'main');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as HomepageSettings;
      console.log('[getHomepageSettings] Settings retrieved successfully');
      return data;
    } else {
      console.log('[getHomepageSettings] No settings found, returning defaults');
      // Return default settings instead of null
      return {
        heroImageUrl: '',
        heroImageHint: '',
        // Add other default properties as needed
      };
    }
  } catch (error) {
    console.error('[getHomepageSettings] Error:', error);
    
    // Return default settings instead of throwing
    // This prevents the entire page from failing
    return {
      heroImageUrl: '',
      heroImageHint: '',
      // Add other default properties as needed
    };
  }
}

// Alternative: Client-side version
export async function getHomepageSettingsClient(): Promise<HomepageSettings | null> {
  try {
    const response = await fetch('/api/homepage-settings');
    if (!response.ok) {
      throw new Error('Failed to fetch settings');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching homepage settings:', error);
    return null;
  }
}
