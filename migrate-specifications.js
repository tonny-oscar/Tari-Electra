/**
 * Migration script to convert specifications from arrays/strings to objects
 * Run this once to update existing products in Firestore
 * 
 * Usage: node migrate-specifications.js
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin (replace with your service account key)
const serviceAccount = {
  // Add your Firebase service account credentials here
  // For security, use environment variables in production
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // Add your project ID here
    projectId: 'your-project-id'
  });
}

const db = admin.firestore();

async function migrateSpecifications() {
  console.log('Starting specifications migration...');
  
  const collections = ['products', 'customerProducts', 'homepageProducts'];
  let totalUpdated = 0;
  
  for (const collectionName of collections) {
    console.log(`\nProcessing collection: ${collectionName}`);
    
    try {
      const snapshot = await db.collection(collectionName).get();
      
      if (snapshot.empty) {
        console.log(`No documents found in ${collectionName}`);
        continue;
      }
      
      const batch = db.batch();
      let batchCount = 0;
      let collectionUpdated = 0;
      
      for (const doc of snapshot.docs) {
        const data = doc.data();
        let needsUpdate = false;
        let newSpecifications = {};
        
        if (data.specifications) {
          // Handle array specifications
          if (Array.isArray(data.specifications)) {
            console.log(`Converting array specifications for ${doc.id}`);
            data.specifications.forEach((spec, index) => {
              if (typeof spec === 'string') {
                const colonIndex = spec.indexOf(':');
                if (colonIndex > 0) {
                  const key = spec.substring(0, colonIndex).trim();
                  const value = spec.substring(colonIndex + 1).trim();
                  newSpecifications[key] = value;
                } else {
                  newSpecifications[`Spec${index + 1}`] = spec.trim();
                }
              }
            });
            needsUpdate = true;
          }
          // Handle string specifications (comma-separated)
          else if (typeof data.specifications === 'string') {
            console.log(`Converting string specifications for ${doc.id}`);
            data.specifications.split(',').forEach((spec, index) => {
              const trimmed = spec.trim();
              if (trimmed) {
                const colonIndex = trimmed.indexOf(':');
                if (colonIndex > 0) {
                  const key = trimmed.substring(0, colonIndex).trim();
                  const value = trimmed.substring(colonIndex + 1).trim();
                  newSpecifications[key] = value;
                } else {
                  newSpecifications[`Spec${index + 1}`] = trimmed;
                }
              }
            });
            needsUpdate = true;
          }
          // Already an object, check if it needs cleaning
          else if (typeof data.specifications === 'object' && !Array.isArray(data.specifications)) {
            // Already in correct format, skip
            continue;
          }
        }
        
        if (needsUpdate) {
          batch.update(doc.ref, { specifications: newSpecifications });
          batchCount++;
          collectionUpdated++;
          
          // Commit batch every 500 operations (Firestore limit)
          if (batchCount >= 500) {
            await batch.commit();
            console.log(`Committed batch of ${batchCount} updates`);
            batchCount = 0;
          }
        }
      }
      
      // Commit remaining updates
      if (batchCount > 0) {
        await batch.commit();
        console.log(`Committed final batch of ${batchCount} updates`);
      }
      
      console.log(`Updated ${collectionUpdated} documents in ${collectionName}`);
      totalUpdated += collectionUpdated;
      
    } catch (error) {
      console.error(`Error processing ${collectionName}:`, error);
    }
  }
  
  console.log(`\nMigration completed! Total documents updated: ${totalUpdated}`);
}

// Run the migration
migrateSpecifications()
  .then(() => {
    console.log('Migration finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });