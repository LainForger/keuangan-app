/**
 * Configuration Manager untuk Supabase Credentials (Aman & Bebas dari GitHub)
 */

let SUPABASE_URL = "https://ttdrrtfkhhqczgxusmli.supabase.co";
let SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0ZHJydGZraGhxY3pneHVzbWxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxODg1MzIsImV4cCI6MjEwNDc2NDUzMn0.Ho7RJY_ioyYzoVf_b3iCYD2AfQsBYjVTS8pmsTdgeic";

const ConfigManager = {
    /**
     * Mengambil kredensial secara otomatis (dari Vercel Environment Variables / File / LocalStorage)
     */
    async fetchCloudCredentials() {
        // 1. Coba ambil dari Vercel Serverless Endpoint (/api/config)
        try {
            const res = await fetch('/api/config');
            if (res.ok) {
                const data = await res.json();
                if (data.url && data.anonKey && data.url.startsWith('https://')) {
                    SUPABASE_URL = data.url.trim();
                    SUPABASE_ANON_KEY = data.anonKey.trim();
                    return { url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY };
                }
            }
        } catch (e) {
            // Serverless endpoint tidak aktif (misal dijalankan lokal tanpa vercel dev)
        }

        // 2. Coba ambil dari variabel lokal di file ini (jika diisi)
        if (SUPABASE_URL && SUPABASE_URL.startsWith('https://') && SUPABASE_ANON_KEY) {
            return { url: SUPABASE_URL.trim(), anonKey: SUPABASE_ANON_KEY.trim() };
        }

        // 3. Fallback dari LocalStorage (jika ada)
        try {
            const saved = localStorage.getItem('keuanganku_supabase_credentials_v1');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.url && parsed.anonKey) {
                    SUPABASE_URL = parsed.url;
                    SUPABASE_ANON_KEY = parsed.anonKey;
                    return parsed;
                }
            }
        } catch (e) {
            // Ignore
        }

        return { url: '', anonKey: '' };
    },

    getSupabaseCredentials() {
        return {
            url: SUPABASE_URL,
            anonKey: SUPABASE_ANON_KEY
        };
    },

    isConfigured() {
        return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.startsWith('https://'));
    }
};
