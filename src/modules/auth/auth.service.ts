import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { AuthProvider, IAuthResponse, IUser, UserRole } from '../../interfaces/user.interface';
import { SocialProfileDto } from './dto/social-login.dto';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../constants/supabase.constants';
import { JwtConfig } from '../../config/env.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient
  ) {}

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
      const { data: existingUser, error: searchError } = await this.supabase
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
        const { data: updatedUser, error: updateError } = await this.supabase
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
          auth_provider: provider,
          role: UserRole.USER,
          created_at: new Date(),
          updated_at: new Date(),
          last_login: new Date(),
          birth: profile.birth && profile.birth.trim() !== '' ? profile.birth : null,
          job: profile.job && profile.job.trim() !== '' ? profile.job : null,
        };
        
        const { data: createdUser, error: insertError } = await this.supabase
          .from('users')
          .insert(newUser)
          .select()
          .single();

        console.log('--- User Insert Attempt ---');
        console.log('Insert Error:', insertError);
        console.log('Returned User Data:', createdUser);

        if (insertError) {
          throw new Error(`사용자 생성 오류: ${insertError.message}`);
        }

        if (!createdUser) {
          console.error('User inserted but select() returned null/undefined.');
          throw new Error('사용자 생성 후 데이터를 가져오지 못했습니다. 관리자에게 문의하세요.');
        }

        return this.generateAuthResponse(createdUser as IUser);
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
    const jwtConfig = this.configService.get<JwtConfig>('jwt');
    if (!jwtConfig || !jwtConfig.secret || !jwtConfig.expiresIn) {
      throw new Error('JWT configuration (secret, expiresIn) is not complete');
    }

    // DEBUG: Log the actual expiresIn value being used
    console.log(`--- JWT expiresIn value from ConfigService: ${jwtConfig.expiresIn} ---`);

    const secret: jwt.Secret = jwtConfig.secret;
    const expiresInString: string = jwtConfig.expiresIn; // Ensure it's a string

    // @ts-ignore - jsonwebtoken types expect number or StringValue, but string works
    const options: jwt.SignOptions = { expiresIn: expiresInString };
    return jwt.sign(payload, secret, options);
  }
}