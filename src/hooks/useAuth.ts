'use client';

import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext'; // ✅ Ensure correct path to your context

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
