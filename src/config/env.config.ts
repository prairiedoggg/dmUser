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
  nodeEnv: 'test',
  port: 3002,
  supabase: {
    url: 'http://localhost:54321',
    key: 'test-supabase-key',
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
    case 'test':
      return testConfig;
    default:
      return developmentConfig;
  }
}; 