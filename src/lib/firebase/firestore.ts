import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from './client';

export interface CustomerData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profile: {
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface SubmeterApplication {
  id?: string;
  propertyType: 'residential' | 'commercial';
  utilityServices: ('electricity' | 'water')[];
  applicationType: 'new' | 'existing';
  fullName: string;
  phoneNumber: string;
  idNumber: string;
  email: string;
  physicalLocation: string;
  areaTown: string;
  mainMeterAccountNumber: string;
  currentReading: number;
  suppliesOtherAreas: boolean;
  linkedMeterNumbers?: string;
  termsAccepted: boolean;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected';
  userId: string;
}

// Customer-related operations
export async function getCustomerData(userId: string): Promise<CustomerData | null> {
  try {
    const docRef = doc(db, 'customers', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as CustomerData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching customer data:', error);
    throw error;
  }
}

export async function updateCustomerProfile(userId: string, data: Partial<CustomerData>) {
  try {
    const docRef = doc(db, 'customers', userId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating customer profile:', error);
    throw error;
  }
}

// Submeter Application operations
export async function createSubmeterApplication(data: Omit<SubmeterApplication, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'submeterApplications'), {
      ...data,
      submissionDate: new Date().toISOString(),
      status: 'pending'
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating submeter application:', error);
    throw error;
  }
}

export async function getCustomerSubmeterApplications(userId: string): Promise<SubmeterApplication[]> {
  try {
    const q = query(
      collection(db, 'submeterApplications'),
      where('userId', '==', userId),
      orderBy('submissionDate', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SubmeterApplication[];
  } catch (error) {
    console.error('Error fetching submeter applications:', error);
    throw error;
  }
}

export async function getAllSubmeterApplications(): Promise<SubmeterApplication[]> {
  try {
    const q = query(
      collection(db, 'submeterApplications'),
      orderBy('submissionDate', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SubmeterApplication[];
  } catch (error) {
    console.error('Error fetching all submeter applications:', error);
    throw error;
  }
}

export async function updateSubmeterApplication(
  applicationId: string,
  data: Partial<SubmeterApplication>
) {
  try {
    const docRef = doc(db, 'submeterApplications', applicationId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating submeter application:', error);
    throw error;
  }
}
