import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../constants/supabase.constants';
import { SupabaseConfig } from '../../config/env.config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../../auth/jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN', '3600s') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: SUPABASE_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const supabaseConfig = configService.get<SupabaseConfig>('supabase');
        if (!supabaseConfig || !supabaseConfig.url || !supabaseConfig.key) {
          throw new Error('Supabase URL and Key must be configured');
        }
        return createClient(supabaseConfig.url, supabaseConfig.key, {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
          },
        });
      },
    },
  ],
  exports: [AuthService, JwtModule, PassportModule, SUPABASE_CLIENT],
})
export class AuthModule {} 