import { IsEnum, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { AuthProvider } from '../../../interfaces/user.interface';
import { Type } from 'class-transformer';

/**
 * 소셜 로그인 프로필 DTO
 */
export class SocialProfileDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  provider?: AuthProvider;

  @IsOptional()
  @IsString()
  birth?: string;

  @IsOptional()
  @IsString()
  job?: string;
  
  
}

/**
 * 소셜 로그인 요청 DTO
 */
export class SocialLoginDto {
  @IsEnum(AuthProvider, { message: '지원하는 인증 제공자(google, kakao)를 입력해주세요' })
  provider: AuthProvider;

  @IsString()
  @IsNotEmpty({ message: '액세스 토큰은 필수입니다' })
  accessToken: string;

  @IsObject()
  @ValidateNested()
  @Type(() => SocialProfileDto)
  profile: SocialProfileDto;
} 