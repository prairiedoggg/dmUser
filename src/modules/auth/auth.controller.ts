import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SocialLoginDto } from './dto/social-login.dto';
import { IAuthResponse } from '../../interfaces/user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 소셜 로그인 엔드포인트
   */
  @Post('social-login')
  async socialLogin(@Body() socialLoginDto: SocialLoginDto): Promise<IAuthResponse> {
    try {
      const { provider, accessToken, profile } = socialLoginDto;
      
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