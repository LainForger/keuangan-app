/**
 * Service Pengelola Pengguna (User Session, Cloud Recovery & Unique Username Management)
 */

const ACTIVE_USER_KEY = 'keuanganku_active_user_v1';
const USERS_LIST_KEY = 'keuanganku_registered_users_v1';

const UserService = {
    /**
     * Mengambil nama pengguna yang sedang aktif (logged in)
     */
    getCurrentUser() {
        return localStorage.getItem(ACTIVE_USER_KEY) || null;
    },

    /**
     * Mengeset sesi pengguna aktif
     */
    setCurrentUser(username) {
        if (!username) return;
        const cleanName = username.trim();
        localStorage.setItem(ACTIVE_USER_KEY, cleanName);
        this.addLocalRegisteredUser(cleanName);
    },

    /**
     * Logout / Hapus sesi pengguna aktif dari browser
     */
    clearCurrentUser() {
        localStorage.removeItem(ACTIVE_USER_KEY);
    },

    /**
     * Memeriksa apakah sebuah username sudah pernah terdaftar (Supabase Cloud / LocalStorage)
     */
    async isUsernameTaken(username) {
        if (!username) return false;
        const cleanName = username.trim().toLowerCase();

        // 1. Cek di Supabase jika terhubung
        if (SupabaseService.isReady()) {
            const exists = await SupabaseService.checkUsernameExists(cleanName);
            if (exists) return true;
        }

        // 2. Cek di LocalStorage
        const localUsers = this.getLocalRegisteredUsers();
        return localUsers.some(u => u.toLowerCase() === cleanName);
    },

    /**
     * Mendaftarkan pengguna baru (wajib unik)
     */
    async registerNewUser(username) {
        const cleanName = username.trim();
        const taken = await this.isUsernameTaken(cleanName);

        if (taken) {
            throw new Error(`Nama pengguna "${cleanName}" sudah terdaftar. Jika ini milik Anda, gunakan tab "Masuk Pengguna Lama".`);
        }

        // Simpan ke Supabase jika aktif
        if (SupabaseService.isReady()) {
            await SupabaseService.registerUser(cleanName);
        }

        this.setCurrentUser(cleanName);
        return cleanName;
    },

    /**
     * Masuk (Login) pengguna lama yang pernah dibuat
     */
    async loginExistingUser(username) {
        if (!username) throw new Error('Harap masukkan nama pengguna.');
        const cleanName = username.trim();

        // Cek ketersediaan di Supabase jika terhubung
        if (SupabaseService.isReady()) {
            const exists = await SupabaseService.checkUsernameExists(cleanName);
            if (!exists) {
                // Cek juga di local data
                const localUsers = this.getLocalRegisteredUsers();
                const hasLocal = localUsers.some(u => u.toLowerCase() === cleanName.toLowerCase());
                if (!hasLocal) {
                    throw new Error(`Nama pengguna "${cleanName}" belum terdaftar. Silakan daftar di tab "Buat Nama Baru".`);
                }
            }
        }

        this.setCurrentUser(cleanName);
        return cleanName;
    },

    /**
     * Mengambil daftar seluruh pengguna terdaftar (Cloud + Local)
     */
    async getAllRegisteredUsers() {
        const set = new Set(this.getLocalRegisteredUsers());

        if (SupabaseService.isReady()) {
            try {
                const { data } = await supabaseInstance.from('users').select('username');
                if (data) {
                    data.forEach(u => set.add(u.username));
                }
            } catch (e) {
                // Ignore error
            }
        }

        return Array.from(set);
    },

    getLocalRegisteredUsers() {
        try {
            const saved = localStorage.getItem(USERS_LIST_KEY);
            return saved ? JSON.parse(saved) : ['Budi Pratama', 'Siti Rahma'];
        } catch (e) {
            return ['Budi Pratama'];
        }
    },

    addLocalRegisteredUser(username) {
        const users = this.getLocalRegisteredUsers();
        const exists = users.some(u => u.toLowerCase() === username.toLowerCase());
        if (!exists) {
            users.push(username);
            localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users));
        }
    }
};
