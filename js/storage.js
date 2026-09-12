/**
 * Modul Storage Unified (Supabase Database + LocalStorage Fallback - Per User Scoped)
 */

const STORAGE_KEYS = {
    TRANSACTIONS: 'keuanganku_transactions_v1',
    CATEGORIES: 'keuanganku_categories_v1',
    SETTINGS: 'keuanganku_settings_v1'
};

const StorageManager = {
    cachedTransactions: null,

    /**
     * Inisialisasi storage
     */
    async init() {
        const activeUser = UserService.getCurrentUser();
        if (!activeUser) return;

        if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
            localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
        }
        if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
            localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
        }

        // Coba hubungkan ke Supabase jika terkonfigurasi
        if (SupabaseService.isReady()) {
            const remoteData = await SupabaseService.getTransactions(activeUser);
            if (remoteData !== null) {
                this.cachedTransactions = remoteData;
                this.syncLocalForUser(activeUser, remoteData);
                return;
            }
        }

        // Fallback ke LocalStorage
        this.cachedTransactions = this.getLocalTransactionsForUser(activeUser);

        // Jika user baru belum punya transaksi di local, berikan data sampel awal
        if (this.cachedTransactions.length === 0) {
            const seeded = INITIAL_TRANSACTIONS.map((tx, idx) => ({
                ...tx,
                id: `tx-user-${Date.now()}-${idx}`,
                username: activeUser
            }));
            this.saveLocalTransactionsForUser(activeUser, seeded);
            this.cachedTransactions = seeded;
        }
    },

    /**
     * Mengambil transaksi milik user dari LocalStorage
     */
    getLocalTransactionsForUser(username) {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
            const all = data ? JSON.parse(data) : [];
            return all.filter(tx => !tx.username || tx.username === username);
        } catch (e) {
            return [];
        }
    },

    /**
     * Menyimpan transaksi milik user ke LocalStorage
     */
    saveLocalTransactionsForUser(username, userTransactions) {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
            let all = data ? JSON.parse(data) : [];
            all = all.filter(tx => tx.username && tx.username !== username);
            all = [...userTransactions, ...all];
            localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(all));
        } catch (e) {
            console.error('Error saving local transactions:', e);
        }
    },

    syncLocalForUser(username, remoteTransactions) {
        this.saveLocalTransactionsForUser(username, remoteTransactions);
    },

    /**
     * Ambil seluruh transaksi milik user aktif secara async
     */
    async getTransactions() {
        const activeUser = UserService.getCurrentUser();
        if (!activeUser) return [];

        if (SupabaseService.isReady()) {
            const remoteData = await SupabaseService.getTransactions(activeUser);
            if (remoteData !== null) {
                this.cachedTransactions = remoteData;
                this.syncLocalForUser(activeUser, remoteData);
                return remoteData;
            }
        }

        this.cachedTransactions = this.getLocalTransactionsForUser(activeUser);
        return this.cachedTransactions;
    },

    /**
     * Ambil transaksi terfilter milik user aktif
     */
    async getFilteredTransactions({ yearMonth = 'all', category = 'all', type = 'all', search = '' } = {}) {
        let list = await this.getTransactions();

        if (yearMonth !== 'all') {
            list = list.filter(tx => tx.date && tx.date.startsWith(yearMonth));
        }

        if (category !== 'all') {
            list = list.filter(tx => tx.category === category);
        }

        if (type !== 'all') {
            list = list.filter(tx => tx.type === type);
        }

        if (search.trim() !== '') {
            const query = search.toLowerCase().trim();
            list = list.filter(tx =>
                (tx.title && tx.title.toLowerCase().includes(query)) ||
                (tx.note && tx.note.toLowerCase().includes(query))
            );
        }

        return list.sort((a, b) => new Date(b.date) - new Date(a.date));
    },

    /**
     * Menambah transaksi baru untuk user aktif
     */
    async addTransaction(txData) {
        const activeUser = UserService.getCurrentUser();
        if (!activeUser) throw new Error('Pengguna belum login.');

        const newTx = {
            id: 'tx-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
            username: activeUser,
            title: txData.title.trim(),
            amount: parseFloat(txData.amount),
            type: txData.type,
            category: txData.category,
            date: txData.date,
            note: txData.note ? txData.note.trim() : ''
        };

        if (SupabaseService.isReady()) {
            try {
                await SupabaseService.addTransaction(newTx, activeUser);
            } catch (e) {
                console.warn('Gagal simpan ke Supabase, tetap menyimpan lokal:', e);
            }
        }

        const current = this.getLocalTransactionsForUser(activeUser);
        current.unshift(newTx);
        this.saveLocalTransactionsForUser(activeUser, current);
        this.cachedTransactions = current;
        return newTx;
    },

    /**
     * Memperbarui transaksi (Supabase & LocalStorage)
     */
    async updateTransaction(id, updatedData) {
        const activeUser = UserService.getCurrentUser();
        const updatedTx = {
            id,
            username: activeUser,
            title: updatedData.title.trim(),
            amount: parseFloat(updatedData.amount),
            type: updatedData.type,
            category: updatedData.category,
            date: updatedData.date,
            note: updatedData.note ? updatedData.note.trim() : ''
        };

        if (SupabaseService.isReady()) {
            try {
                await SupabaseService.updateTransaction(id, updatedTx);
            } catch (e) {
                console.warn('Gagal update di Supabase, menyimpan lokal:', e);
            }
        }

        let list = this.getLocalTransactionsForUser(activeUser);
        const idx = list.findIndex(t => t.id === id);
        if (idx !== -1) {
            list[idx] = updatedTx;
            this.saveLocalTransactionsForUser(activeUser, list);
            this.cachedTransactions = list;
        }
        return updatedTx;
    },

    /**
     * Menghapus transaksi (Supabase & LocalStorage)
     */
    async deleteTransaction(id) {
        const activeUser = UserService.getCurrentUser();
        if (SupabaseService.isReady()) {
            try {
                await SupabaseService.deleteTransaction(id);
            } catch (e) {
                console.warn('Gagal delete di Supabase, menghapus lokal:', e);
            }
        }

        let list = this.getLocalTransactionsForUser(activeUser);
        list = list.filter(t => t.id !== id);
        this.saveLocalTransactionsForUser(activeUser, list);
        this.cachedTransactions = list;
    },

    /**
     * Kategori & Ringkasan Statistics
     */
    getCategories() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
            return data ? JSON.parse(data) : INITIAL_CATEGORIES;
        } catch (e) {
            return INITIAL_CATEGORIES;
        }
    },

    getCategoryById(catId, type = null) {
        const categories = this.getCategories();
        const allCats = [...categories.pemasukan, ...categories.pengeluaran];
        return allCats.find(c => c.id === catId) || { name: catId, icon: 'tag', color: '#64748b' };
    },

    async getSummary(yearMonth = 'all') {
        const txList = await this.getFilteredTransactions({ yearMonth });

        let totalIncome = 0;
        let totalExpense = 0;

        txList.forEach(tx => {
            if (tx.type === 'pemasukan') {
                totalIncome += Number(tx.amount);
            } else if (tx.type === 'pengeluaran') {
                totalExpense += Number(tx.amount);
            }
        });

        const netBalance = totalIncome - totalExpense;
        const savingsRate = totalIncome > 0 ? Math.max(0, ((totalIncome - totalExpense) / totalIncome) * 100) : 0;

        return {
            totalIncome,
            totalExpense,
            netBalance,
            savingsRate: Math.round(savingsRate)
        };
    },

    async getMonthlyExpenseData() {
        const transactions = await this.getTransactions();
        const monthlyMap = {};

        transactions.forEach(tx => {
            if (!tx.date) return;
            const ym = tx.date.substring(0, 7);
            if (!monthlyMap[ym]) {
                monthlyMap[ym] = { income: 0, expense: 0 };
            }
            if (tx.type === 'pemasukan') {
                monthlyMap[ym].income += Number(tx.amount);
            } else if (tx.type === 'pengeluaran') {
                monthlyMap[ym].expense += Number(tx.amount);
            }
        });

        const sortedMonths = Object.keys(monthlyMap).sort();
        const labels = [];
        const expenses = [];
        const incomes = [];

        sortedMonths.forEach(ym => {
            const [year, month] = ym.split('-');
            const dateObj = new Date(parseInt(year), parseInt(month) - 1, 1);
            const monthName = dateObj.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
            labels.push(monthName);
            expenses.push(monthlyMap[ym].expense);
            incomes.push(monthlyMap[ym].income);
        });

        return { labels, expenses, incomes, rawMonths: sortedMonths };
    },

    async getCategoryExpenseBreakdown(yearMonth = 'all') {
        const txList = await this.getFilteredTransactions({ yearMonth, type: 'pengeluaran' });
        const catMap = {};

        txList.forEach(tx => {
            if (!catMap[tx.category]) {
                catMap[tx.category] = 0;
            }
            catMap[tx.category] += Number(tx.amount);
        });

        const labels = [];
        const amounts = [];
        const colors = [];

        Object.keys(catMap).forEach(catId => {
            const catObj = this.getCategoryById(catId, 'pengeluaran');
            labels.push(catObj.name);
            amounts.push(catMap[catId]);
            colors.push(catObj.color);
        });

        return { labels, amounts, colors };
    },

    async getAvailableMonths() {
        const transactions = await this.getTransactions();
        const set = new Set();
        transactions.forEach(tx => {
            if (tx.date) {
                set.add(tx.date.substring(0, 7));
            }
        });

        const sorted = Array.from(set).sort().reverse();
        return sorted.map(ym => {
            const [year, month] = ym.split('-');
            const dateObj = new Date(parseInt(year), parseInt(month) - 1, 1);
            const name = dateObj.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
            return { value: ym, label: name };
        });
    },

    resetToDefault() {
        const activeUser = UserService.getCurrentUser();
        if (!activeUser) return;
        const seeded = INITIAL_TRANSACTIONS.map((tx, idx) => ({
            ...tx,
            id: `tx-user-${Date.now()}-${idx}`,
            username: activeUser
        }));
        this.saveLocalTransactionsForUser(activeUser, seeded);
        this.cachedTransactions = seeded;
    }
};

function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(amount);
}

function formatDateIndo(dateStr) {
    if (!dateStr) return '-';
    const [year, month, day] = dateStr.split('-');
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return dateObj.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}
