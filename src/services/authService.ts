
import { query } from '@/lib/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Profile } from '@/types/database';

const JWT_SECRET = process.env.VITE_JWT_SECRET || 'your-secret-key';

export interface AuthResponse {
  user: User;
  profile: Profile;
  token: string;
}

export const signUp = async (email: string, password: string, fullName?: string): Promise<AuthResponse> => {
  // Verificar si el usuario ya existe
  const existingUser = await query('SELECT * FROM users WHERE email = $1', [email]);
  if (existingUser.rows.length > 0) {
    throw new Error('El usuario ya existe');
  }

  // Hash de la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crear usuario
  const userResult = await query(
    'INSERT INTO users (id, email, password_hash, created_at, updated_at) VALUES (gen_random_uuid(), $1, $2, NOW(), NOW()) RETURNING *',
    [email, hashedPassword]
  );
  
  const user = userResult.rows[0];

  // Crear perfil
  const profileResult = await query(
    'INSERT INTO profiles (id, user_id, role, full_name, created_at, updated_at) VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW()) RETURNING *',
    [user.id, 'employee', fullName]
  );

  const profile = profileResult.rows[0];

  // Generar token JWT
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

  return { user, profile, token };
};

export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  // Buscar usuario por email
  const userResult = await query('SELECT * FROM users WHERE email = $1', [email]);
  if (userResult.rows.length === 0) {
    throw new Error('Credenciales inválidas');
  }

  const user = userResult.rows[0];

  // Verificar contraseña
  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    throw new Error('Credenciales inválidas');
  }

  // Obtener perfil
  const profileResult = await query('SELECT * FROM profiles WHERE user_id = $1', [user.id]);
  if (profileResult.rows.length === 0) {
    throw new Error('Perfil no encontrado');
  }

  const profile = profileResult.rows[0];

  // Generar token JWT
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

  return { user, profile, token };
};

export const verifyToken = async (token: string): Promise<{ user: User; profile: Profile }> => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    // Obtener usuario
    const userResult = await query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
    if (userResult.rows.length === 0) {
      throw new Error('Usuario no encontrado');
    }

    const user = userResult.rows[0];

    // Obtener perfil
    const profileResult = await query('SELECT * FROM profiles WHERE user_id = $1', [user.id]);
    if (profileResult.rows.length === 0) {
      throw new Error('Perfil no encontrado');
    }

    const profile = profileResult.rows[0];

    return { user, profile };
  } catch (error) {
    throw new Error('Token inválido');
  }
};
