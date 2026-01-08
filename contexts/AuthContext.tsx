// contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  type User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        // Refresh token on load
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firebaseUid: u.uid }),
          });
          const data = await res.json();
        if (data.success) {
            localStorage.setItem('token', data.token);
            // Cookie is now set by the server
          }
        } catch (e) {
          console.error("Failed to sync session", e);
        }
      } else {
        localStorage.removeItem('token');
        // Cookie is cleared by the server (on logout) or expires naturally
      }
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const setSession = (token: string) => {
    localStorage.setItem('token', token);
    // Cookie is set by the server
  };

  const login = async (email: string, password: string) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firebaseUid: user.uid }),
    });
    const data = await res.json();
    if (data.success) {
      setSession(data.token);
    } else {
      throw new Error(data.message);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, firebaseUid: user.uid }),
    });
    const data = await res.json();
    if (data.success) {
      setSession(data.token);
    } else {
      throw new Error(data.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('token');
    // Call logout API to clear cookie
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Failed to logout from server', e);
    }
  };

  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      
      // Try login first
      let res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firebaseUid: user.uid }),
      });
      
      let data = await res.json();

      // If user not found, register them
      if (!data.success && res.status === 404) {
        res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name: user.displayName || 'User', 
            email: user.email, 
            firebaseUid: user.uid 
          }),
        });
        data = await res.json();
      }

      if (data.success) {
        setSession(data.token);
      } else {
        console.error('Google Login/Register failed:', data);
        throw new Error(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error("Error in googleLogin:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within an AuthProvider');
  return ctx;
};
