/**
 * Configuration Manager untuk Supabase Credentials
 * 
 * ISIKAN URL DAN ANON KEY SUPABASE ANDA DI SINI:
 */

const SUPABASE_URL = "https://ttdrrtfkhhqczgxusmli.supabase.co";
const SUPABASE_ANON_KEY = ""; // Salin Kunci "anon public" (berawalan eyJhbG...) dari Supabase Settings API

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
                if (parsed.url && parsed.anonKey && parsed.url.startsWith('https://')) {
                    return parsed;
                }
            }
        } catch (e) {
            // Ignore
        }

        return { url: '', anonKey: '' };
    },

    saveSupabaseCredentials(url, anonKey) {
        const creds = {
            url: url ? url.trim() : '',
            anonKey: anonKey ? anonKey.trim() : ''
        };
        localStorage.setItem('keuanganku_supabase_credentials_v1', JSON.stringify(creds));
        return creds;
    },

    clearSupabaseCredentials() {
        localStorage.removeItem('keuanganku_supabase_credentials_v1');
    },

    async fetchCloudCredentials() {
        return this.getSupabaseCredentials();
    },

    isConfigured() {
        const creds = this.getSupabaseCredentials();
        return Boolean(creds.url && creds.anonKey && creds.url.startsWith('https://'));
    }
};
