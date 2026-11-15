// Environment validation and configuration
import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),

  // Supabase
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(10),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(10),
  SUPABASE_JWT_SECRET: z.string().min(32),

  // App
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  NEXT_PUBLIC_APP_URL: z.string().url(),

  // Email (Brevo)
  BREVO_API_KEY: z.string().optional(),
  BREVO_FROM_EMAIL: z.string().email().optional(),
  BREVO_FROM_NAME: z.string().optional(),

  // Payments (Razorpay)
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),

  // AI
  OPENROUTER_API_KEY: z.string().optional(),
  OPENROUTER_MODEL: z.string().optional(),

  // Maps
  MAPS_API_KEY: z.string().optional(),

  // Redis
  REDIS_URL: z.string().url().optional(),
});

// Validate environment variables
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = _env.data;

// Type-safe environment access
export type Env = z.infer<typeof envSchema>;