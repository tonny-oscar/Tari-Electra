const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  info: (message: string, ...args: any[]) => {
    if (isDev) console.log(`[INFO] ${message}`, ...args);
  },
  
  error: (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${message}`, ...args);
  },
  
  warn: (message: string, ...args: any[]) => {
    if (isDev) console.warn(`[WARN] ${message}`, ...args);
  },
  
  debug: (message: string, ...args: any[]) => {
    if (isDev) console.debug(`[DEBUG] ${message}`, ...args);
  },
};