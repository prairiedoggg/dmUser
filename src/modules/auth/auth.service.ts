import { Injectable, UnauthorizedException } from '@nestjs/common';
import { supabase } from '../../config/supabase.config';
import { AuthProvider, IAuthResponse, IUser, UserRole } from '../../interfaces/user.interface';
import { SocialProfileDto } from './dto/social-login.dto';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { getConfig } from '../../config/env.config';

@Injectable()
export class AuthService {
  private readonly config = getConfig();

  constructor(private readonly configService: ConfigService) {}

  /**
   * 소셜 로그인 처리 (Google, Kakao OAuth)
   */
  async socialLogin(
    provider: AuthProvider, 
    accessToken: string, 
    profile: SocialProfileDto
  ): Promise<IAuthResponse> {
    try {
      if (!profile.email) {
        throw new Error('이메일 정보는 필수입니다');
      }
      
      // 1. 이미 가입된 사용자인지 확인
      const { data: existingUser, error: searchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', profile.email)
        .single();

      if (searchError && searchError.code !== 'PGRST116') {
        throw new Error(`사용자 검색 오류: ${searchError.message}`);
      }

      // 2. 기존 사용자가 있으면 정보 업데이트, 없으면 신규 생성
      if (existingUser) {
        // 기존 사용자 정보 업데이트
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({
            last_login: new Date(),
            auth_provider: provider,
            updated_at: new Date(),
          })
          .eq('id', existingUser.id)
          .single();

        if (updateError) {
          throw new Error(`사용자 업데이트 오류: ${updateError.message}`);
        }

        return this.generateAuthResponse(updatedUser || existingUser);
      } else {
        // 신규 사용자 생성
        const newUser = {
          email: profile.email,
          name: profile.name || '사용자',
          avatar_url: profile.image,
          auth_provider: provider,
          role: UserRole.USER,
          created_at: new Date(),
          updated_at: new Date(),
          last_login: new Date(),
        };
        
        const { data: createdUser, error: insertError } = await supabase
          .from('users')
          .insert(newUser)
          .single();

        if (insertError) {
          throw new Error(`사용자 생성 오류: ${insertError.message}`);
        }

        return this.generateAuthResponse(createdUser);
      }
    } catch (error) {
      throw new UnauthorizedException(`소셜 로그인 실패: ${error.message}`);
    }
  }

  /**
   * 사용자 정보 및 토큰 반환
   */
  private generateAuthResponse(user: IUser): IAuthResponse {
    const token = this.generateToken(user);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url,
      role: user.role || UserRole.USER,
      accessToken: token,
    };
  }

  /**
   * JWT 토큰 생성
   */
  private generateToken(user: IUser): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, this.config.jwt.secret, {
      expiresIn: this.config.jwt.expiresIn,
    });
  }
} 