'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
  profile: {
    phone: string;
    address: string;
    city: string;
    country: string;
  };
}

interface AuthContextType {
  user: User | null;
  customerData: CustomerData | null;
  loading: boolean;
  logout: () => Promise<void>;
  isCustomer: boolean;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@yourstore.com').split(',').map(email => email.trim());
  
  // Remove debug logs in production
  if (process.env.NODE_ENV === 'development') {
    console.log('Admin emails configured:', ADMIN_EMAILS);
    console.log('Current user email:', user?.email);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const userEmail = currentUser.email?.trim() || '';
        // Remove debug logs in production
        if (process.env.NODE_ENV === 'development') {
          console.log('Checking admin status for:', userEmail);
          console.log('Admin emails:', ADMIN_EMAILS);
          console.log('Is admin?', ADMIN_EMAILS.includes(userEmail));
        }
        
        if (ADMIN_EMAILS.includes(userEmail)) {
          setCustomerData(null); // Admin has no customer data
        } else {
          try {
            const customerRef = doc(db, 'customers', currentUser.uid);
            const customerSnap = await getDoc(customerRef);
            if (customerSnap.exists()) {
              setCustomerData(customerSnap.data() as CustomerData);
            } else {
              setCustomerData(null);
            }
          } catch (error) {
            console.error('Error fetching customer data:', error);
            setCustomerData(null);
          }
        }
      } else {
        setCustomerData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [ADMIN_EMAILS]);

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setCustomerData(null);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isCustomer = !!user && customerData?.role === 'customer';
  const isAdmin = !!user && ADMIN_EMAILS.includes(user.email?.trim() || '');

  return (
    <AuthContext.Provider
      value={{
        user,
        customerData,
        loading,
        logout,
        isCustomer,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
