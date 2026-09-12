/**
 * Modul Client Integrasi Supabase JS SDK (Pure Static Supported)
 */

let supabaseInstance = null;

const SupabaseService = {
    /**
     * Inisialisasi Supabase Client
     */
    init() {
        if (!ConfigManager.isConfigured()) {
            supabaseInstance = null;
            return false;
        }

        const { url, anonKey } = ConfigManager.getSupabaseCredentials();

        try {
            if (typeof supabase !== 'undefined' && supabase.createClient) {
                supabaseInstance = supabase.createClient(url, anonKey);
                return true;
            }
        } catch (e) {
            console.error('Gagal menginisialisasi Supabase Client:', e);
            supabaseInstance = null;
        }
        return false;
    },

    isReady() {
        if (!supabaseInstance) {
            this.init();
        }
        return Boolean(supabaseInstance);
    },

    /**
     * Memeriksa keberadaan username di tabel `users` Supabase
     */
    async checkUsernameExists(username) {
        if (!this.isReady()) return false;

        try {
            const { data, error } = await supabaseInstance
                .from('users')
                .select('username')
                .ilike('username', username)
                .limit(1);

            if (error) return false;
            return data && data.length > 0;
        } catch (e) {
            return false;
        }
    },

    /**
     * Mendaftarkan pengguna baru di Supabase
     */
    async registerUser(username) {
        if (!this.isReady()) return null;

        try {
            const { data, error } = await supabaseInstance
                .from('users')
                .insert([{ username }])
                .select();

            if (error) throw error;
            return data ? data[0] : null;
        } catch (e) {
            console.error('Gagal meregistrasi user ke Supabase:', e);
            throw e;
        }
    },

    /**
     * Mengambil daftar transaksi terikat dengan `username` tertentu
     */
    async getTransactions(username = null) {
        if (!this.isReady()) return null;
        const activeUser = username || UserService.getCurrentUser();
        if (!activeUser) return [];

        try {
            const { data, error } = await supabaseInstance
                .from('transactions')
                .select('*')
                .eq('username', activeUser)
                .order('date', { ascending: false });

            if (error) return null;
            return data || [];
        } catch (e) {
            console.error('Gagal terhubung ke Supabase:', e);
            return null;
        }
    },

    /**
     * Menambah transaksi baru dengan `username` terikat
     */
    async addTransaction(tx, username = null) {
        if (!this.isReady()) return null;
        const activeUser = username || UserService.getCurrentUser();
        if (!activeUser) throw new Error('User belum login');

        try {
            const { data, error } = await supabaseInstance
                .from('transactions')
                .insert([
                    {
                        id: tx.id,
                        username: activeUser,
                        title: tx.title,
                        amount: tx.amount,
                        type: tx.type,
                        category: tx.category,
                        date: tx.date,
                        note: tx.note || ''
                    }
                ])
                .select();

            if (error) throw error;
            return data ? data[0] : tx;
        } catch (e) {
            console.error('Gagal menyimpan transaksi ke Supabase:', e);
            throw e;
        }
    },

    /**
     * Memperbarui transaksi yang ada di Supabase
     */
    async updateTransaction(id, tx) {
        if (!this.isReady()) return null;

        try {
            const { data, error } = await supabaseInstance
                .from('transactions')
                .update({
                    title: tx.title,
                    amount: tx.amount,
                    type: tx.type,
                    category: tx.category,
                    date: tx.date,
                    note: tx.note || ''
                })
                .eq('id', id)
                .select();

            if (error) throw error;
            return data ? data[0] : tx;
        } catch (e) {
            console.error('Gagal update transaksi di Supabase:', e);
            throw e;
        }
    },

    /**
     * Menghapus transaksi dari Supabase
     */
    async deleteTransaction(id) {
        if (!this.isReady()) return false;

        try {
            const { error } = await supabaseInstance
                .from('transactions')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (e) {
            console.error('Gagal menghapus transaksi dari Supabase:', e);
            throw e;
        }
    },

    /**
     * Menguji koneksi dengan Supabase
     */
    async testConnection(url, anonKey) {
        try {
            if (typeof supabase === 'undefined') return false;
            const tempClient = supabase.createClient(url, anonKey);
            const { error } = await tempClient.from('transactions').select('id').limit(1);
            return !error;
        } catch (e) {
            return false;
        }
    }
};
