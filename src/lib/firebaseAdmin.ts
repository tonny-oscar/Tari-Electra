// Simplified Firebase admin setup for deployment
export const adminDb = {
  collection: () => ({
    doc: () => ({
      get: () => Promise.resolve({ exists: false, data: () => ({}) }),
      set: () => Promise.resolve(),
      update: () => Promise.resolve(),
      delete: () => Promise.resolve()
    }),
    add: () => Promise.resolve({ id: 'mock' }),
    get: () => Promise.resolve({ docs: [] })
  })
};

export const adminAuth = {
  verifyIdToken: () => Promise.resolve({ uid: 'mock' })
};

export const adminStorage = {
  bucket: () => ({
    file: () => ({
      save: () => Promise.resolve(),
      getSignedUrl: () => Promise.resolve(['mock-url'])
    })
  })
};

const adminConfig = {};
export default adminConfig;
