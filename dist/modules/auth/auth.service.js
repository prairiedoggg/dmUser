"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_interface_1 = require("../../interfaces/user.interface");
const config_1 = require("@nestjs/config");
const jwt = require("jsonwebtoken");
const supabase_js_1 = require("@supabase/supabase-js");
const supabase_constants_1 = require("../../constants/supabase.constants");
let AuthService = class AuthService {
    constructor(configService, supabase) {
        this.configService = configService;
        this.supabase = supabase;
    }
    async socialLogin(provider, accessToken, profile) {
        try {
            if (!profile.email) {
                throw new Error('이메일 정보는 필수입니다');
            }
            const { data: existingUser, error: searchError } = await this.supabase
                .from('users')
                .select('*')
                .eq('email', profile.email)
                .single();
            if (searchError && searchError.code !== 'PGRST116') {
                throw new Error(`사용자 검색 오류: ${searchError.message}`);
            }
            if (existingUser) {
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
            }
            else {
                const newUser = {
                    email: profile.email,
                    name: profile.name || '사용자',
                    auth_provider: provider,
                    role: user_interface_1.UserRole.USER,
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
                return this.generateAuthResponse(createdUser);
            }
        }
        catch (error) {
            throw new common_1.UnauthorizedException(`소셜 로그인 실패: ${error.message}`);
        }
    }
    generateAuthResponse(user) {
        const token = this.generateToken(user);
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role || user_interface_1.UserRole.USER,
            accessToken: token,
        };
    }
    generateToken(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const jwtConfig = this.configService.get('jwt');
        if (!jwtConfig || !jwtConfig.secret || !jwtConfig.expiresIn) {
            throw new Error('JWT configuration (secret, expiresIn) is not complete');
        }
        console.log(`--- JWT expiresIn value from ConfigService: ${jwtConfig.expiresIn} ---`);
        const secret = jwtConfig.secret;
        const expiresInString = jwtConfig.expiresIn;
        const options = { expiresIn: expiresInString };
        return jwt.sign(payload, secret, options);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(supabase_constants_1.SUPABASE_CLIENT)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        supabase_js_1.SupabaseClient])
], AuthService);
//# sourceMappingURL=auth.service.js.map