export interface EnvironmentConfig {
    nodeEnv: string;
    port: number;
    supabase: {
        url: string;
        key: string;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    cors: {
        allowedOrigins: string[];
    };
}
export declare const developmentConfig: EnvironmentConfig;
export declare const productionConfig: EnvironmentConfig;
export declare const testConfig: EnvironmentConfig;
export declare const getConfig: () => EnvironmentConfig;
export interface SupabaseConfig {
    url: string;
    key: string;
}
export interface JwtConfig {
    secret: string;
    expiresIn: string;
}
export interface CorsConfig {
    allowedOrigins: string[];
}
export declare const appConfig: (() => {
    nodeEnv: string;
    port: number;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    nodeEnv: string;
    port: number;
}>;
export declare const supabaseConfiguration: (() => SupabaseConfig) & import("@nestjs/config").ConfigFactoryKeyHost<SupabaseConfig>;
export declare const jwtConfiguration: (() => JwtConfig) & import("@nestjs/config").ConfigFactoryKeyHost<JwtConfig>;
export declare const corsConfiguration: (() => CorsConfig) & import("@nestjs/config").ConfigFactoryKeyHost<CorsConfig>;
