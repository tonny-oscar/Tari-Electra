import { db } from '@/lib/firebase';
import { collection, query, where, getCountFromServer } from 'firebase/firestore';

export async function getPendingSubmeterApplicationsCount(): Promise<number> {
  try {
    if (!db) {
      return 0;
    }
    const applicationsCollection = collection(db, 'submeterApplications');
    const q = query(applicationsCollection, where('status', '==', 'pending'));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  } catch (error) {
    console.error('Error fetching pending submeter applications count:', error);
    return 0;
  }
}