// src/hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext'; // ✅ Match your actual file path

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
