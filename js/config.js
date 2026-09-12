/**
 * Configuration Manager untuk Supabase Credentials
 * 
 * SILAKAN MASUKKAN SUPABASE_URL DAN SUPABASE_ANON_KEY ANDA DI BAWAH INI:
 */

const SUPABASE_URL = "https://ttdrrtfkhhqczgxusmli.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_PfxQBFSb_yNCRVAMLvxn3A_1o_vkRLf";

const ConfigManager = {
    /**
     * Mengambil kredensial Supabase dari variabel konstanta di atas atau LocalStorage
     */
    getSupabaseCredentials() {
        // 1. Utamakan konstanta yang ditulis di file ini jika sudah diisi
        if (SUPABASE_URL && SUPABASE_URL.startsWith('https://') && SUPABASE_ANON_KEY && SUPABASE_ANON_KEY.length > 20) {
            return {
                url: SUPABASE_URL.trim(),
                anonKey: SUPABASE_ANON_KEY.trim()
            };
        }

        // 2. Fallback ke LocalStorage (jika ada)
        try {
            const saved = localStorage.getItem('keuanganku_supabase_credentials_v1');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Gagal membaca kredensial Supabase:', e);
        }

        return {
            url: '',
            anonKey: ''
        };
    },

    /**
     * Memeriksa apakah kredensial valid
     */
    isConfigured() {
        const creds = this.getSupabaseCredentials();
        return Boolean(creds.url && creds.anonKey && creds.url.startsWith('https://'));
    }
};
