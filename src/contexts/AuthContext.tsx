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

  const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@yourstore.com')
    .split(',')
    .map(email => email.trim());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const userEmail = currentUser.email?.trim() || '';

        if (ADMIN_EMAILS.includes(userEmail)) {
          setCustomerData(null); // Admin has no customer data
        } else {
          try {
            const customerRef = doc(db, 'customers', currentUser.uid);
            const customerSnap = await getDoc(customerRef);
            setCustomerData(customerSnap.exists() ? (customerSnap.data() as CustomerData) : null);
          } catch {
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
    } catch {
      // Keep minimal error logging in production
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
