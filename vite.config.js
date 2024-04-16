import { defineConfig, loadEnv } from 'vite';

export default ({ mode }) => {
    const env = loadEnv(mode, process.cwd());

    return defineConfig({
    server: {
        port: 5173,
        proxy: {
            '^/(auth-anon|auth-user|auth-admin|auth-check|sso|dwr|logout|login|oauth2|arms-check|swagger-ui.html|swagger-ui|webjars|swagger-resources|v2)': {
                target: env.VITE_API_BASE_URL,
                changeOrigin: true
            }
        }
    }
    });
};