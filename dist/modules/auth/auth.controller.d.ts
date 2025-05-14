import { AuthService } from './auth.service';
import { SocialLoginDto } from './dto/social-login.dto';
import { IAuthResponse } from '../../interfaces/user.interface';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    socialLogin(socialLoginDto: SocialLoginDto): Promise<IAuthResponse>;
}
