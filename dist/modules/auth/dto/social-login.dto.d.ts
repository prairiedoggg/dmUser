import { AuthProvider } from '../../../interfaces/user.interface';
export declare class SocialProfileDto {
    id?: string;
    email: string;
    name?: string;
    image?: string;
    provider?: AuthProvider;
    birth?: string;
    job?: string;
}
export declare class SocialLoginDto {
    provider: AuthProvider;
    accessToken: string;
    profile: SocialProfileDto;
}
