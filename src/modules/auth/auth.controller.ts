import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

// 소셜 로그인 요청 DTO
class SocialLoginDto {
  provider: string; // 'google' 또는 'kakao'
  accessToken: string;
  profile: {
    id?: string;
    email?: string;
    name?: string;
    image?: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 소셜 로그인 엔드포인트
  @Post('social-login')
  async socialLogin(@Body() socialLoginDto: SocialLoginDto) {
    try {
      const { provider, accessToken, profile } = socialLoginDto;
      
      // 필수 정보 검증
      if (!provider || !profile || !profile.email) {
        throw new HttpException(
          '유효하지 않은 소셜 로그인 정보',
          HttpStatus.BAD_REQUEST,
        );
      }
      
      // 지원하는 공급자 확인
      if (provider !== 'google' && provider !== 'kakao') {
        throw new HttpException(
          '지원하지 않는 소셜 로그인 공급자',
          HttpStatus.BAD_REQUEST,
        );
      }
      
      // AuthService로 로그인 처리 위임
      return await this.authService.socialLogin(
        provider,
        accessToken,
        profile,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `소셜 로그인 처리 중 오류 발생: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 