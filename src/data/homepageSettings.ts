
import fs from 'fs';
import path from 'path';
import type { HomepageSettings } from '@/lib/types';

const settingsDataPath = path.resolve(process.cwd(), 'src/data/homepageSettings.json');

const defaultSettings: HomepageSettings = {
  heroImageUrl: 'https://placehold.co/800x600.png',
  heroImageHint: 'modern building technology',
};

function readHomepageSettingsData(): HomepageSettings {
  console.log('[HomepageSettings] Attempting to read homepageSettings.json from:', settingsDataPath);
  try {
    if (fs.existsSync(settingsDataPath)) {
      const fileContent = fs.readFileSync(settingsDataPath, 'utf-8');
      if (fileContent.trim() === '' || fileContent.trim() === '{}') {
        console.log('[HomepageSettings] homepageSettings.json is empty or default. Initializing and returning default settings.');
        fs.writeFileSync(settingsDataPath, JSON.stringify(defaultSettings, null, 2), 'utf-8');
        return { ...defaultSettings };
      }
      const data = JSON.parse(fileContent);
      // Ensure data is an object and not an array or other type
      if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
        console.log('[HomepageSettings] Successfully parsed settings from JSON.');
        // Merge with defaults to ensure all expected fields are present
        return { ...defaultSettings, ...data };
      } else {
        console.warn('[HomepageSettings] homepageSettings.json does not contain a valid object. Initializing with default settings.');
        fs.writeFileSync(settingsDataPath, JSON.stringify(defaultSettings, null, 2), 'utf-8');
        return { ...defaultSettings };
      }
    }
    console.log('[HomepageSettings] homepageSettings.json does not exist. Creating and initializing with default settings.');
    fs.writeFileSync(settingsDataPath, JSON.stringify(defaultSettings, null, 2), 'utf-8');
    return { ...defaultSettings };
  } catch (error: any) {
    console.error('[HomepageSettings] Error reading or initializing homepageSettings.json:', error.message);
    try {
      fs.writeFileSync(settingsDataPath, JSON.stringify(defaultSettings, null, 2), 'utf-8');
      console.log('[HomepageSettings] Initialized homepageSettings.json with default data after read error.');
    } catch (writeError: any) {
      console.error('[HomepageSettings] Error writing default data to homepageSettings.json after read error:', writeError.message);
    }
    return { ...defaultSettings };
  }
}

function writeHomepageSettingsData(data: HomepageSettings): void {
  try {
    console.log('[HomepageSettings] Attempting to write settings to homepageSettings.json:', data);
    fs.writeFileSync(settingsDataPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log('[HomepageSettings] Successfully wrote to homepageSettings.json');
  } catch (error) {
    console.error('[HomepageSettings] Error writing to homepageSettings.json:', error);
  }
}

export function getHomepageSettings(): HomepageSettings {
  const settings = readHomepageSettingsData();
  return JSON.parse(JSON.stringify(settings)); // Return a deep copy
}

export function updateHomepageSettings(updatedSettingsData: Partial<HomepageSettings>): HomepageSettings {
  let settings = readHomepageSettingsData(); // Read current or default settings
  
  const newSettings: HomepageSettings = {
    ...settings, // Spread existing settings
    ...updatedSettingsData, // Override with new data
    heroImageUrl: updatedSettingsData.heroImageUrl || settings.heroImageUrl || defaultSettings.heroImageUrl,
    heroImageHint: updatedSettingsData.heroImageHint || settings.heroImageHint || defaultSettings.heroImageHint,
  };

  writeHomepageSettingsData(newSettings);
  console.log('[updateHomepageSettings - JSON] Settings updated and saved:', newSettings);
  return { ...newSettings };
}
