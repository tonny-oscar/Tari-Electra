// // src/context/AuthContext.tsx
// 'use client';

// import type { User } from 'firebase/auth';
// import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
// import { createContext, useEffect, useState, type ReactNode } from 'react';
// import { auth } from '@/lib/firebase/client';
// import { useRouter } from 'next/navigation';

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   logOut: () => Promise<void>;
// }

// export const AuthContext = createContext<AuthContextType | undefined>(undefined); // ✅ Must be a value

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export function AuthProvider({ children }: AuthProviderProps) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   const logOut = async () => {
//     await firebaseSignOut(auth);
//     setUser(null);
//     router.push('/');
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, logOut }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }


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
import { auth, db } from '@/lib/firebase/client';
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

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@yourstore.com';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        if (currentUser.email === ADMIN_EMAIL) {
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
  }, [ADMIN_EMAIL]);

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
  const isAdmin = !!user && user.email === ADMIN_EMAIL;

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
