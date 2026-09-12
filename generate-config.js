/**
 * Script otomatis pembuat js/config.js saat Vercel Build (100% Gratis di Vercel Hobby)
 */

const fs = require('fs');

const url = process.env.SUPABASE_URL || '';
const anonKey = process.env.SUPABASE_ANON_KEY || '';

const content = `/**
 * Config file generated automatically by Vercel Build
 */

const SUPABASE_URL = "${url}";
const SUPABASE_ANON_KEY = "${anonKey}";

const ConfigManager = {
    getSupabaseCredentials() {
        if (SUPABASE_URL && SUPABASE_URL.startsWith('https://') && SUPABASE_ANON_KEY) {
            return {
                url: SUPABASE_URL.trim(),
                anonKey: SUPABASE_ANON_KEY.trim()
            };
        }

        try {
            const saved = localStorage.getItem('keuanganku_supabase_credentials_v1');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.url && parsed.anonKey) {
                    return parsed;
                }
            }
        } catch (e) {
            // Ignore
        }

        return { url: '', anonKey: '' };
    },

    async fetchCloudCredentials() {
        return this.getSupabaseCredentials();
    },

    isConfigured() {
        const creds = this.getSupabaseCredentials();
        return Boolean(creds.url && creds.anonKey && creds.url.startsWith('https://'));
    }
};
`;

fs.writeFileSync('./js/config.js', content);
console.log('✅ js/config.js berhasil dibuat otomatis oleh Vercel Build!');
