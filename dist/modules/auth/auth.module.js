"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
const supabase_constants_1 = require("../../constants/supabase.constants");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const jwt_strategy_1 = require("../../auth/jwt.strategy");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN', '3600s') },
                }),
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            jwt_strategy_1.JwtStrategy,
            {
                provide: supabase_constants_1.SUPABASE_CLIENT,
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const supabaseConfig = configService.get('supabase');
                    if (!supabaseConfig || !supabaseConfig.url || !supabaseConfig.key) {
                        throw new Error('Supabase URL and Key must be configured');
                    }
                    return (0, supabase_js_1.createClient)(supabaseConfig.url, supabaseConfig.key, {
                        auth: {
                            autoRefreshToken: true,
                            persistSession: true,
                        },
                    });
                },
            },
        ],
        exports: [auth_service_1.AuthService, jwt_1.JwtModule, passport_1.PassportModule, supabase_constants_1.SUPABASE_CLIENT],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map