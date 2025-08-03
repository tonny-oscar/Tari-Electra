import { db } from '@/lib/firebase';
import { collection, query, where, getCountFromServer } from 'firebase/firestore';

export async function getPendingSubmeterApplicationsCount(): Promise<number> {
  try {
    const applicationsCollection = collection(db, 'submeterApplications');
    const q = query(applicationsCollection, where('status', '==', 'pending'));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching pending submeter applications count:', error.message);
    } else {
      console.error('Unknown error occurred:', error);
    }
    return 0;
  }
}
