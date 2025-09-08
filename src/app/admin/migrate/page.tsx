'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Database, CheckCircle, AlertTriangle } from 'lucide-react';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function MigratePage() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const migrateSpecifications = async () => {
    setIsRunning(true);
    setResults([]);
    setError(null);

    try {
      const collections = ['products', 'customerProducts', 'homepageProducts'];
      let totalUpdated = 0;

      for (const collectionName of collections) {
        setResults(prev => [...prev, `Processing collection: ${collectionName}...`]);
        
        const snapshot = await getDocs(collection(db, collectionName));
        
        if (snapshot.empty) {
          setResults(prev => [...prev, `No documents found in ${collectionName}`]);
          continue;
        }

        const batch = writeBatch(db);
        let batchCount = 0;
        let collectionUpdated = 0;

        for (const docSnapshot of snapshot.docs) {
          const data = docSnapshot.data();
          let needsUpdate = false;
          let newSpecifications = {};

          if (data.specifications) {
            // Handle array specifications
            if (Array.isArray(data.specifications)) {
              data.specifications.forEach((spec: string, index: number) => {
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
            // Handle string specifications
            else if (typeof data.specifications === 'string') {
              data.specifications.split(',').forEach((spec: string, index: number) => {
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
          }

          if (needsUpdate) {
            batch.update(doc(db, collectionName, docSnapshot.id), { 
              specifications: newSpecifications 
            });
            batchCount++;
            collectionUpdated++;

            // Commit batch every 500 operations
            if (batchCount >= 500) {
              await batch.commit();
              setResults(prev => [...prev, `Committed batch of ${batchCount} updates`]);
              batchCount = 0;
            }
          }
        }

        // Commit remaining updates
        if (batchCount > 0) {
          await batch.commit();
          setResults(prev => [...prev, `Committed final batch of ${batchCount} updates`]);
        }

        setResults(prev => [...prev, `Updated ${collectionUpdated} documents in ${collectionName}`]);
        totalUpdated += collectionUpdated;
      }

      setResults(prev => [...prev, `Migration completed! Total documents updated: ${totalUpdated}`]);
      
    } catch (err) {
      console.error('Migration error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Specifications Migration Tool
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This tool converts product specifications from arrays/strings to objects. 
              Run this once to update existing products. Make sure to backup your data first.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="font-semibold">What this migration does:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Converts array specifications to key:value objects</li>
              <li>Converts string specifications to key:value objects</li>
              <li>Preserves existing object specifications</li>
              <li>Updates all product collections (products, customerProducts, homepageProducts)</li>
            </ul>
          </div>

          <Button 
            onClick={migrateSpecifications} 
            disabled={isRunning}
            className="w-full"
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Migration...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Start Migration
              </>
            )}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {results.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Migration Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm font-mono bg-muted p-4 rounded-lg max-h-64 overflow-y-auto">
                  {results.map((result, index) => (
                    <div key={index}>{result}</div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}