import { AuthProvider, IAuthResponse } from '../../interfaces/user.interface';
import { SocialProfileDto } from './dto/social-login.dto';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
export declare class AuthService {
    private readonly configService;
    private readonly supabase;
    constructor(configService: ConfigService, supabase: SupabaseClient);
    socialLogin(provider: AuthProvider, accessToken: string, profile: SocialProfileDto): Promise<IAuthResponse>;
    private generateAuthResponse;
    private generateToken;
}
