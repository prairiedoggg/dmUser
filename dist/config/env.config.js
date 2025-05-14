"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsConfiguration = exports.jwtConfiguration = exports.supabaseConfiguration = exports.appConfig = exports.getConfig = exports.testConfig = exports.productionConfig = exports.developmentConfig = void 0;
const config_1 = require("@nestjs/config");
exports.developmentConfig = {
    nodeEnv: 'development',
    port: parseInt(process.env.PORT || '3001', 10),
    supabase: {
        url: process.env.SUPABASE_URL || '',
        key: process.env.SUPABASE_KEY || '',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'dev-jwt-secret',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    cors: {
        allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
            .split(',')
            .map((origin) => origin.trim()),
    },
};
exports.productionConfig = {
    nodeEnv: 'production',
    port: parseInt(process.env.PORT || '3001', 10),
    supabase: {
        url: process.env.SUPABASE_URL || '',
        key: process.env.SUPABASE_KEY || '',
    },
    jwt: {
        secret: process.env.JWT_SECRET || '',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    cors: {
        allowedOrigins: (process.env.ALLOWED_ORIGINS || '')
            .split(',')
            .filter(Boolean)
            .map((origin) => origin.trim()),
    },
};
exports.testConfig = {
    nodeEnv: 'development',
    port: 3001,
    supabase: {
        url: 'https://qpiieojgaahoaqxxqngs.supabase.co',
        key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwaWllb2pnYWFob2FxeHhxbmdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NDg4MjMsImV4cCI6MjA2MDEyNDgyM30.bqU9bktHTKTJ-6Yrr7hM-s0FCZ7NkoATYK6KJQ1tR14',
    },
    jwt: {
        secret: 'test-jwt-secret',
        expiresIn: '1h',
    },
    cors: {
        allowedOrigins: ['http://localhost:3000'],
    },
};
const getConfig = () => {
    const nodeEnv = process.env.NODE_ENV || 'development';
    switch (nodeEnv) {
        case 'production':
            return exports.productionConfig;
        case 'development':
            return exports.developmentConfig;
        default:
            return exports.developmentConfig;
    }
};
exports.getConfig = getConfig;
exports.appConfig = (0, config_1.registerAs)('app', () => ({
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3001', 10),
}));
exports.supabaseConfiguration = (0, config_1.registerAs)('supabase', () => ({
    url: process.env.SUPABASE_URL || '',
    key: process.env.SUPABASE_KEY || '',
}));
exports.jwtConfiguration = (0, config_1.registerAs)('jwt', () => ({
    secret: process.env.JWT_SECRET || 'default-jwt-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
}));
exports.corsConfiguration = (0, config_1.registerAs)('cors', () => ({
    allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
        .split(',')
        .map((origin) => origin.trim()),
}));
//# sourceMappingURL=env.config.js.map