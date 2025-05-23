/**
 * 사용자 역할 타입
 */
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

/**
 * 소셜 인증 제공자 타입
 */
export enum AuthProvider {
  GOOGLE = 'google',
  TWITTER = 'twitter',
}

/**
 * 사용자 기본 정보 인터페이스
 */
export interface IUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  auth_provider: AuthProvider;
  created_at: Date;
  updated_at: Date;
  last_login: Date;
  birth: string;
  job: string;
}

/**
 * 인증 응답 인터페이스
 */
export interface IAuthResponse {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  accessToken: string;
} 