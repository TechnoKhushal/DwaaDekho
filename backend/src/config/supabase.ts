// Supabase configuration for DwaaDekho backend
import { createClient } from '@supabase/supabase-js';
import { jwtVerify } from 'jose';

// Environment variables
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseJwtSecret = process.env.SUPABASE_JWT_SECRET!;

// Public client for frontend-like operations (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

// Admin client for server-side privileged operations (uses service role key)
// NEVER expose this to the frontend
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// JWT secret for token verification
export const jwtSecret = supabaseJwtSecret;

// Verify Supabase JWT
export async function verifySupabaseToken(token: string): Promise<any | null> {
  try {
    const secret = new TextEncoder().encode(jwtSecret);
    const { payload } = await jwtVerify(token, secret, {
      issuer: supabaseUrl,
      audience: 'authenticated',
    });
    return payload;
  } catch {
    return null;
  }
}

// Create signed URL for private storage access
export async function createSignedUrl(
  bucket: string,
  path: string,
  expiresIn: number = 900 // 15 minutes
): Promise<string | null> {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) return null;
  return data.signedUrl;
}

// Upload file to private bucket
export async function uploadFile(
  bucket: string,
  path: string,
  file: Buffer | File | Blob,
  contentType: string
): Promise<{ path: string | null; error: string | null }> {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, file, {
      contentType,
      upsert: false,
    });

  if (error) return { path: null, error: error.message };
  return { path: data.path, error: null };
}

// Delete file from private bucket
export async function deleteFile(bucket: string, path: string): Promise<boolean> {
  const { error } = await supabaseAdmin.storage.from(bucket).remove([path]);
  return !error;
}