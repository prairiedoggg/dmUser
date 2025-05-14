import { ConfigService, registerAs } from '@nestjs/config';

/**
 * 환경 설정
 */
export interface EnvironmentConfig {
  nodeEnv: string;
  port: number;
  supabase: {
    url: string;
    key: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  cors: {
    allowedOrigins: string[];
  };
}

/**
 * 개발 환경 설정
 */
export const developmentConfig: EnvironmentConfig = {
  nodeEnv: 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  supabase: {
    url: process.env.SUPABASE_URL || '',
    key: process.env.SUPABASE_KEY || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-jwt-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  cors: {
    allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
      .split(',')
      .map((origin) => origin.trim()),
  },
};

/**
 * 운영 환경 설정
 */
export const productionConfig: EnvironmentConfig = {
  nodeEnv: 'production',
  port: parseInt(process.env.PORT || '3001', 10),
  supabase: {
    url: process.env.SUPABASE_URL || '',
    key: process.env.SUPABASE_KEY || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET || '',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  cors: {
    allowedOrigins: (process.env.ALLOWED_ORIGINS || '')
      .split(',')
      .filter(Boolean)
      .map((origin) => origin.trim()),
  },
};

/**
 * 테스트 환경 설정
 */
export const testConfig: EnvironmentConfig = {
  nodeEnv: 'development',
  port: 3001,
  supabase: {
    url: 'https://qpiieojgaahoaqxxqngs.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwaWllb2pnYWFob2FxeHhxbmdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NDg4MjMsImV4cCI6MjA2MDEyNDgyM30.bqU9bktHTKTJ-6Yrr7hM-s0FCZ7NkoATYK6KJQ1tR14',
  },
  jwt: {
    secret: 'test-jwt-secret',
    expiresIn: '1h',
  },
  cors: {
    allowedOrigins: ['http://localhost:3000'],
  },
};

/**
 * 현재 환경에 맞는 설정 반환
 */
export const getConfig = (): EnvironmentConfig => {
  const nodeEnv = process.env.NODE_ENV || 'development';

  switch (nodeEnv) {
    case 'production':
      return productionConfig;
    case 'development':
      return developmentConfig;
    default:
      return developmentConfig;
  }
};

// Re-add and export the interfaces
export interface SupabaseConfig {
  url: string;
  key: string;
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
}

export interface CorsConfig {
  allowedOrigins: string[];
}

// Define configuration namespaces using registerAs
// This makes configuration type-safe and injectable

export const appConfig = registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
}));

export const supabaseConfiguration = registerAs('supabase', (): SupabaseConfig => ({
  url: process.env.SUPABASE_URL || '', // ConfigModule populates process.env before this factory runs
  key: process.env.SUPABASE_KEY || '',
}));

export const jwtConfiguration = registerAs('jwt', (): JwtConfig => ({
  secret: process.env.JWT_SECRET || 'default-jwt-secret', // Provide a default for safety
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
}));

export const corsConfiguration = registerAs('cors', (): CorsConfig => ({
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim()),
}));

// developmentConfig, productionConfig, testConfig, and getConfig are no longer needed
// ConfigModule handles loading based on env files, and registerAs provides typed access 