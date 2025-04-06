import { Injectable, UnauthorizedException } from '@nestjs/common';
import { supabase } from '../../config/supabase.config';

@Injectable()
export class AuthService {
  // 소셜 로그인 처리 (Google, Kakao OAuth)
  async socialLogin(provider: string, accessToken: string, profile: any) {
    try {
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
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({
            email: profile.email,
            name: profile.name || '사용자',
            avatar_url: profile.image,
            auth_provider: provider,
            created_at: new Date(),
            updated_at: new Date(),
            last_login: new Date(),
          })
          .single();

        if (insertError) {
          throw new Error(`사용자 생성 오류: ${insertError.message}`);
        }

        return this.generateAuthResponse(newUser);
      }
    } catch (error) {
      throw new UnauthorizedException(`소셜 로그인 실패: ${error.message}`);
    }
  }

  // 사용자 정보 및 토큰 반환
  private generateAuthResponse(user: any) {
    // Supabase에서 직접 JWT 토큰을 발급하거나, 별도 토큰 생성 로직 구현
    const token = this.generateToken(user);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url,
      role: user.role || 'user',
      accessToken: token,
    };
  }

  // 간단한 토큰 생성 (실제 구현시 JWT 라이브러리 사용 권장)
  private generateToken(user: any) {
    // 실제 구현에서는 jwt.sign() 등 사용
    return `token_${user.id}_${Date.now()}`;
  }
} 