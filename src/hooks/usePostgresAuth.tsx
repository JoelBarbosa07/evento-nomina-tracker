
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { signIn, signUp, verifyToken } from '@/services/authService';
import { User, Profile } from '@/types/database';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const { user, profile } = await verifyToken(token);
        setUser(user);
        setProfile(profile);
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      const { user, profile, token } = await signIn(email, password);
      localStorage.setItem('auth_token', token);
      setUser(user);
      setProfile(profile);
    } catch (error) {
      throw error;
    }
  };

  const handleSignUp = async (email: string, password: string, fullName?: string) => {
    try {
      const { user, profile, token } = await signUp(email, password, fullName);
      localStorage.setItem('auth_token', token);
      setUser(user);
      setProfile(profile);
    } catch (error) {
      throw error;
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setProfile(null);
  };

  const value = {
    user,
    profile,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
