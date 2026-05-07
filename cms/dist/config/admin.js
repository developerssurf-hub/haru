"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = ({ env }) => ({
    auth: {
        secret: env('ADMIN_JWT_SECRET', 'd0277977464654b03623d3878b40813f'),
    },
    apiToken: {
        salt: env('API_TOKEN_SALT', '8d14d2557454f0a04944b54e3d5500e5'),
    },
    transfer: {
        token: {
            salt: env('TRANSFER_TOKEN_SALT', 'f20c8d1797c72f12255776e07671752b'),
        },
    },
    secrets: {
        encryptionKey: env('ENCRYPTION_KEY', '75b5a9394627068a719c83664f3310b8'),
    },
    flags: {
        nps: env.bool('FLAG_NPS', true),
        promoteEE: env.bool('FLAG_PROMOTE_EE', true),
    },
});
exports.default = config;
