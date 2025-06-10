
// Servicio de autenticación simplificado para frontend
import { User, Profile } from '@/types/database';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface AuthResponse {
  user: User;
  profile: Profile;
  token: string;
}

export const signUp = async (email: string, password: string, fullName?: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, fullName }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error en el registro');
  }

  return response.json();
};

export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Credenciales inválidas');
  }

  return response.json();
};

export const verifyToken = async (token: string): Promise<{ user: User; profile: Profile }> => {
  const response = await fetch(`${API_BASE_URL}/auth/verify`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Token inválido');
  }

  return response.json();
};
