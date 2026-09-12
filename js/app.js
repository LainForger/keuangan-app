/**
 * Controller Utama Aplikasi Website KeuanganKu (Dengan Supabase Instant Connect UI)
 */

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Element References
    const filterMonthSelect = document.getElementById('filterMonth');
    const filterCategorySelect = document.getElementById('filterCategory');
    const filterTypeSelect = document.getElementById('filterType');
    const searchInput = document.getElementById('searchInput');
    const btnResetFilter = document.getElementById('btnResetFilter');

    // Header buttons, User Profile & FAB
    const activeUsernameText = document.getElementById('activeUsernameText');
    const btnSwitchUser = document.getElementById('btnSwitchUser');
    const supabaseStatusBadge = document.getElementById('supabaseStatusBadge');
    const supabaseStatusText = document.getElementById('supabaseStatusText');
    const btnOpenAddModal = document.getElementById('btnOpenAddModal');
    const mobileFabAdd = document.getElementById('mobileFabAdd');
    const btnExportData = document.getElementById('btnExportData');
    const importFileInput = document.getElementById('importFileInput');
    const btnResetData = document.getElementById('btnResetData');

    // User Auth Modal Elements
    const userAuthModal = document.getElementById('userAuthModal');
    const tabNewUser = document.getElementById('tabNewUser');
    const tabExistingUser = document.getElementById('tabExistingUser');
    const formRegisterUser = document.getElementById('formRegisterUser');
    const formLoginUser = document.getElementById('formLoginUser');
    const regUsernameInput = document.getElementById('regUsernameInput');
    const loginUsernameInput = document.getElementById('loginUsernameInput');
    const loginUserDatalist = document.getElementById('loginUserDatalist');
    const regErrorAlert = document.getElementById('regErrorAlert');
    const regErrorMsg = document.getElementById('regErrorMsg');
    const loginErrorAlert = document.getElementById('loginErrorAlert');
    const loginErrorMsg = document.getElementById('loginErrorMsg');

    // Metrics elements
    const metricTotalIncome = document.getElementById('metricTotalIncome');
    const metricTotalExpense = document.getElementById('metricTotalExpense');
    const metricNetBalance = document.getElementById('metricNetBalance');
    const metricSavingsRate = document.getElementById('metricSavingsRate');
    const budgetProgressBarFill = document.getElementById('budgetProgressBarFill');
    const periodIncomeSub = document.getElementById('periodIncomeSub');
    const periodExpenseSub = document.getElementById('periodExpenseSub');
    const netStatusText = document.getElementById('netStatusText');
    const budgetTextSub = document.getElementById('budgetTextSub');

    // Table & Mobile Card View elements
    const transactionTableBody = document.getElementById('transactionTableBody');
    const mobileCardList = document.getElementById('mobileCardList');
    const tableEmptyState = document.getElementById('tableEmptyState');

    // Transaction Modal elements
    const transactionModal = document.getElementById('transactionModal');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const btnCancelModal = document.getElementById('btnCancelModal');
    const transactionForm = document.getElementById('transactionForm');
    const modalTitle = document.getElementById('modalTitle');
    const txIdInput = document.getElementById('txId');
    const txTypeInput = document.getElementById('txType');
    const btnTypeExpense = document.getElementById('btnTypeExpense');
    const btnTypeIncome = document.getElementById('btnTypeIncome');
    const txDateInput = document.getElementById('txDate');
    const txAmountInput = document.getElementById('txAmount');
    const txTitleInput = document.getElementById('txTitle');
    const txCategorySelect = document.getElementById('txCategory');
    const txNoteInput = document.getElementById('txNote');

    // Supabase Modal elements
    const supabaseModal = document.getElementById('supabaseModal');
    const btnCloseSupabaseModal = document.getElementById('btnCloseSupabaseModal');
    const supabaseForm = document.getElementById('supabaseForm');
    const supabaseUrlInput = document.getElementById('supabaseUrlInput');
    const supabaseKeyInput = document.getElementById('supabaseKeyInput');
    const btnDisconnectSupabase = document.getElementById('btnDisconnectSupabase');

    // 2. State Management
    let currentFilters = {
        yearMonth: 'all',
        category: 'all',
        type: 'all',
        search: ''
    };

    // 3. User Authentication Check on Load
    const activeUser = UserService.getCurrentUser();
    if (!activeUser) {
        await openUserAuthModal();
    } else {
        await initAppForUser(activeUser);
    }

    // ==========================================
    // Core Application Initialization per User
    // ==========================================

    async function initAppForUser(username) {
        activeUsernameText.textContent = username;
        userAuthModal.classList.remove('active');

        await StorageManager.init();
        updateSupabaseStatusUI();
        await setupFilterMonthOptions();
        setupFilterCategoryOptions();
        await refreshAppUI();
    }

    async function refreshAppUI() {
        await renderMetrics();
        await renderTableAndMobileCards();
        await ChartsManager.updateCharts(currentFilters.yearMonth);
    }

    function updateSupabaseStatusUI() {
        if (SupabaseService.isReady()) {
            supabaseStatusBadge.className = 'status-badge connected';
            supabaseStatusText.textContent = 'Supabase: Terhubung Cloud';
        } else {
            supabaseStatusBadge.className = 'status-badge offline';
            supabaseStatusText.textContent = 'Supabase: Offline (Klik di sini)';
        }
    }

    // ==========================================
    // Supabase Settings Modal Handlers (Instant UI Setup)
    // ==========================================

    function openSupabaseModal() {
        const creds = ConfigManager.getSupabaseCredentials();
        supabaseUrlInput.value = creds.url || '';
        supabaseKeyInput.value = creds.anonKey || '';
        supabaseModal.classList.add('active');
    }

    function closeSupabaseModal() {
        supabaseModal.classList.remove('active');
    }

    supabaseStatusBadge.addEventListener('click', openSupabaseModal);
    btnCloseSupabaseModal.addEventListener('click', closeSupabaseModal);

    supabaseForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const url = supabaseUrlInput.value.trim();
        const key = supabaseKeyInput.value.trim();

        if (!url || !key) {
            showToast('Harap isi URL dan Anon Key Supabase.', 'error');
            return;
        }

        showToast('Menguji koneksi ke Supabase...', 'success');
        const isOk = await SupabaseService.testConnection(url, key);

        if (isOk) {
            ConfigManager.saveSupabaseCredentials(url, key);
            SupabaseService.init();
            await StorageManager.init();

            updateSupabaseStatusUI();
            closeSupabaseModal();
            await setupFilterMonthOptions();
            await refreshAppUI();
            showToast('Berhasil terhubung ke Supabase Cloud!', 'success');
        } else {
            showToast('Gagal terhubung. Periksa URL, Key & SQL Schema.', 'error');
        }
    });

    btnDisconnectSupabase.addEventListener('click', async () => {
        ConfigManager.clearSupabaseCredentials();
        SupabaseService.init();
        await StorageManager.init();

        updateSupabaseStatusUI();
        closeSupabaseModal();
        await setupFilterMonthOptions();
        await refreshAppUI();
        showToast('Beralih ke mode Offline (LocalStorage)', 'success');
    });

    // ==========================================
    // Multi-User Auth & Cloud Account Recovery Logic
    // ==========================================

    async function openUserAuthModal() {
        regErrorAlert.classList.add('hidden');
        loginErrorAlert.classList.add('hidden');
        regUsernameInput.value = '';
        loginUsernameInput.value = '';

        const users = await UserService.getAllRegisteredUsers();
        loginUserDatalist.innerHTML = '';
        users.forEach(u => {
            const opt = document.createElement('option');
            opt.value = u;
            loginUserDatalist.appendChild(opt);
        });

        userAuthModal.classList.add('active');
    }

    tabNewUser.addEventListener('click', () => {
        tabNewUser.classList.add('active');
        tabExistingUser.classList.remove('active');
        formRegisterUser.classList.remove('hidden');
        formLoginUser.classList.add('hidden');
        regErrorAlert.classList.add('hidden');
        loginErrorAlert.classList.add('hidden');
    });

    tabExistingUser.addEventListener('click', () => {
        tabExistingUser.classList.add('active');
        tabNewUser.classList.remove('active');
        formLoginUser.classList.remove('hidden');
        formRegisterUser.classList.add('hidden');
        regErrorAlert.classList.add('hidden');
        loginErrorAlert.classList.add('hidden');
    });

    formRegisterUser.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = regUsernameInput.value.trim();
        if (!username) return;

        try {
            regErrorAlert.classList.add('hidden');
            const registeredName = await UserService.registerNewUser(username);
            showToast(`Selamat datang, ${registeredName}!`, 'success');
            await initAppForUser(registeredName);
        } catch (err) {
            regErrorMsg.textContent = err.message || 'Nama pengguna sudah digunakan oleh orang lain.';
            regErrorAlert.classList.remove('hidden');
        }
    });

    formLoginUser.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = loginUsernameInput.value.trim();
        if (!username) return;

        try {
            loginErrorAlert.classList.add('hidden');
            const loggedName = await UserService.loginExistingUser(username);
            showToast(`Akun "${loggedName}" berhasil dipulihkan dari Supabase Cloud!`, 'success');
            await initAppForUser(loggedName);
        } catch (err) {
            loginErrorMsg.textContent = err.message || 'Nama pengguna tidak ditemukan.';
            loginErrorAlert.classList.remove('hidden');
        }
    });

    btnSwitchUser.addEventListener('click', async () => {
        if (confirm('Apakah Anda ingin keluar / beralih ke pengguna lain?')) {
            UserService.clearCurrentUser();
            await openUserAuthModal();
        }
    });

    // ==========================================
    // Filter & UI Renderers (Mobile + Desktop)
    // ==========================================

    async function setupFilterMonthOptions() {
        const months = await StorageManager.getAvailableMonths();
        filterMonthSelect.innerHTML = '<option value="all">Semua Bulan (Tutup Filter)</option>';

        months.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m.value;
            opt.textContent = m.label;
            filterMonthSelect.appendChild(opt);
        });

        filterMonthSelect.value = currentFilters.yearMonth;
    }

    function setupFilterCategoryOptions() {
        const categories = StorageManager.getCategories();
        filterCategorySelect.innerHTML = '<option value="all">Semua Kategori</option>';

        const groupExpense = document.createElement('optgroup');
        groupExpense.label = 'Pengeluaran';
        categories.pengeluaran.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = c.name;
            groupExpense.appendChild(opt);
        });

        const groupIncome = document.createElement('optgroup');
        groupIncome.label = 'Pemasukan';
        categories.pemasukan.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = c.name;
            groupIncome.appendChild(opt);
        });

        filterCategorySelect.appendChild(groupExpense);
        filterCategorySelect.appendChild(groupIncome);
    }

    async function renderMetrics() {
        const summary = await StorageManager.getSummary(currentFilters.yearMonth);

        metricTotalIncome.textContent = formatRupiah(summary.totalIncome);
        metricTotalExpense.textContent = formatRupiah(summary.totalExpense);

        if (summary.netBalance >= 0) {
            metricNetBalance.textContent = formatRupiah(summary.netBalance);
            metricNetBalance.style.color = 'var(--color-income)';
            netStatusText.textContent = 'Surplus (Pemasukan > Pengeluaran)';
        } else {
            metricNetBalance.textContent = formatRupiah(summary.netBalance);
            metricNetBalance.style.color = 'var(--color-expense)';
            netStatusText.textContent = 'Defisit (Pengeluaran > Pemasukan)';
        }

        if (currentFilters.yearMonth === 'all') {
            periodIncomeSub.textContent = 'Akumulasi seluruh waktu';
            periodExpenseSub.textContent = 'Akumulasi seluruh waktu';
        } else {
            const [y, m] = currentFilters.yearMonth.split('-');
            const dateObj = new Date(parseInt(y), parseInt(m) - 1, 1);
            const monthLabel = dateObj.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
            periodIncomeSub.textContent = `Bulan ${monthLabel}`;
            periodExpenseSub.textContent = `Bulan ${monthLabel}`;
        }

        metricSavingsRate.textContent = `${summary.savingsRate}%`;
        budgetProgressBarFill.style.width = `${Math.min(100, Math.max(0, summary.savingsRate))}%`;

        if (summary.savingsRate >= 40) {
            budgetTextSub.textContent = 'Sangat Sehat! (Tabungan > 40%)';
            budgetTextSub.style.color = 'var(--color-income)';
        } else if (summary.savingsRate >= 20) {
            budgetTextSub.textContent = 'Cukup Baik (Tabungan 20-40%)';
            budgetTextSub.style.color = '#f59e0b';
        } else {
            budgetTextSub.textContent = 'Waspada (Tabungan < 20%)';
            budgetTextSub.style.color = 'var(--color-expense)';
        }
    }

    async function renderTableAndMobileCards() {
        const txList = await StorageManager.getFilteredTransactions(currentFilters);
        transactionTableBody.innerHTML = '';
        mobileCardList.innerHTML = '';

        if (txList.length === 0) {
            tableEmptyState.classList.remove('hidden');
            return;
        }

        tableEmptyState.classList.add('hidden');

        txList.forEach(tx => {
            const isIncome = tx.type === 'pemasukan';
            const catObj = StorageManager.getCategoryById(tx.category, tx.type);

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div style="font-weight: 600;">${formatDateIndo(tx.date)}</div>
                </td>
                <td>
                    <div style="font-weight: 700; color: var(--text-main);">${escapeHtml(tx.title)}</div>
                    ${tx.note ? `<div style="font-size: 0.775rem; color: var(--text-muted);">${escapeHtml(tx.note)}</div>` : ''}
                </td>
                <td>
                    <span class="type-pill ${isIncome ? 'income' : 'expense'}">
                        ${isIncome ? '<i class="fa-solid fa-plus"></i> Masuk' : '<i class="fa-solid fa-minus"></i> Keluar'}
                    </span>
                </td>
                <td>
                    <span class="category-badge">
                        <i class="fa-solid fa-tag" style="color: ${catObj.color};"></i> ${escapeHtml(catObj.name)}
                    </span>
                </td>
                <td style="text-align: right;">
                    <span class="amount-display ${isIncome ? 'amount-income' : 'amount-expense'}">
                        ${isIncome ? '+' : '-'} ${formatRupiah(tx.amount)}
                    </span>
                </td>
                <td style="text-align: center;">
                    <div style="display: flex; gap: 0.4rem; justify-content: center;">
                        <button class="btn btn-outline btn-sm btn-icon btn-edit" data-id="${tx.id}" title="Edit Transaksi">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="btn btn-danger-outline btn-sm btn-icon btn-delete" data-id="${tx.id}" title="Hapus Transaksi">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            `;
            transactionTableBody.appendChild(tr);

            const card = document.createElement('div');
            card.className = 'mobile-tx-card';
            card.innerHTML = `
                <div class="mobile-tx-card-top">
                    <div>
                        <div class="mobile-tx-card-title">${escapeHtml(tx.title)}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">
                            <i class="fa-regular fa-calendar"></i> ${formatDateIndo(tx.date)}
                        </div>
                    </div>
                    <span class="amount-display ${isIncome ? 'amount-income' : 'amount-expense'}" style="font-size: 1.05rem;">
                        ${isIncome ? '+' : '-'} ${formatRupiah(tx.amount)}
                    </span>
                </div>
                ${tx.note ? `<div class="mobile-tx-card-note">${escapeHtml(tx.note)}</div>` : ''}
                <div class="mobile-tx-card-bottom">
                    <div style="display: flex; gap: 0.4rem; align-items: center;">
                        <span class="type-pill ${isIncome ? 'income' : 'expense'}">
                            ${isIncome ? 'Masuk' : 'Keluar'}
                        </span>
                        <span class="category-badge">
                            <i class="fa-solid fa-tag" style="color: ${catObj.color};"></i> ${escapeHtml(catObj.name)}
                        </span>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-outline btn-sm btn-edit" data-id="${tx.id}">
                            <i class="fa-solid fa-pen-to-square"></i> Edit
                        </button>
                        <button class="btn btn-danger-outline btn-sm btn-delete" data-id="${tx.id}">
                            <i class="fa-solid fa-trash-can"></i> Hapus
                        </button>
                    </div>
                </div>
            `;
            mobileCardList.appendChild(card);
        });

        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                await openEditModal(id);
            });
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                await confirmDeleteTransaction(id);
            });
        });
    }

    // ==========================================
    // Modal & Form Handlers
    // ==========================================

    function updateModalCategoryOptions(type) {
        const categories = StorageManager.getCategories();
        const catList = type === 'pemasukan' ? categories.pemasukan : categories.pengeluaran;

        txCategorySelect.innerHTML = '';
        catList.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = c.name;
            txCategorySelect.appendChild(opt);
        });
    }

    function setModalType(type) {
        txTypeInput.value = type;
        if (type === 'pengeluaran') {
            btnTypeExpense.classList.add('active');
            btnTypeIncome.classList.remove('active');
        } else {
            btnTypeIncome.classList.add('active');
            btnTypeExpense.classList.remove('active');
        }
        updateModalCategoryOptions(type);
    }

    btnTypeExpense.addEventListener('click', () => setModalType('pengeluaran'));
    btnTypeIncome.addEventListener('click', () => setModalType('pemasukan'));

    function openAddModal() {
        modalTitle.textContent = 'Tambah Transaksi Baru';
        txIdInput.value = '';
        transactionForm.reset();

        const today = new Date().toISOString().split('T')[0];
        txDateInput.value = today;

        setModalType('pengeluaran');
        transactionModal.classList.add('active');
    }

    async function openEditModal(id) {
        const transactions = await StorageManager.getTransactions();
        const tx = transactions.find(t => t.id === id);
        if (!tx) return;

        modalTitle.textContent = 'Edit Transaksi';
        txIdInput.value = tx.id;
        txDateInput.value = tx.date;
        txAmountInput.value = tx.amount;
        txTitleInput.value = tx.title;
        txNoteInput.value = tx.note || '';

        setModalType(tx.type);
        txCategorySelect.value = tx.category;

        transactionModal.classList.add('active');
    }

    function closeModal() {
        transactionModal.classList.remove('active');
    }

    btnOpenAddModal.addEventListener('click', openAddModal);
    if (mobileFabAdd) mobileFabAdd.addEventListener('click', openAddModal);

    btnCloseModal.addEventListener('click', closeModal);
    btnCancelModal.addEventListener('click', closeModal);

    transactionForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = txIdInput.value;
        const txData = {
            title: txTitleInput.value,
            amount: txAmountInput.value,
            type: txTypeInput.value,
            category: txCategorySelect.value,
            date: txDateInput.value,
            note: txNoteInput.value
        };

        if (id) {
            await StorageManager.updateTransaction(id, txData);
            showToast('Transaksi berhasil diperbarui!', 'success');
        } else {
            await StorageManager.addTransaction(txData);
            showToast('Transaksi baru berhasil ditambahkan!', 'success');
        }

        closeModal();
        await setupFilterMonthOptions();
        await refreshAppUI();
    });

    async function confirmDeleteTransaction(id) {
        if (confirm('Apakah Anda yakin ingin menghapus catatan transaksi ini?')) {
            await StorageManager.deleteTransaction(id);
            showToast('Transaksi telah dihapus.', 'error');
            await setupFilterMonthOptions();
            await refreshAppUI();
        }
    }

    // ==========================================
    // Filter Event Listeners
    // ==========================================

    filterMonthSelect.addEventListener('change', async (e) => {
        currentFilters.yearMonth = e.target.value;
        await refreshAppUI();
    });

    filterCategorySelect.addEventListener('change', async (e) => {
        currentFilters.category = e.target.value;
        await refreshAppUI();
    });

    filterTypeSelect.addEventListener('change', async (e) => {
        currentFilters.type = e.target.value;
        await refreshAppUI();
    });

    searchInput.addEventListener('input', async (e) => {
        currentFilters.search = e.target.value;
        await renderTableAndMobileCards();
    });

    btnResetFilter.addEventListener('click', async () => {
        currentFilters = { yearMonth: 'all', category: 'all', type: 'all', search: '' };
        filterMonthSelect.value = 'all';
        filterCategorySelect.value = 'all';
        filterTypeSelect.value = 'all';
        searchInput.value = '';
        await refreshAppUI();
        showToast('Filter telah di-reset.', 'success');
    });

    // ==========================================
    // Export, Import & Reset Data
    // ==========================================

    btnExportData.addEventListener('click', async () => {
        const transactions = await StorageManager.getTransactions();
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(transactions, null, 2));
        const downloadAnchor = document.createElement('a');
        const fileName = `KeuanganKu_Export_${new Date().toISOString().split('T')[0]}.json`;

        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", fileName);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();

        showToast('Data transaksi berhasil diekspor!', 'success');
    });

    importFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const activeUser = UserService.getCurrentUser();
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const parsed = JSON.parse(event.target.result);
                if (Array.isArray(parsed)) {
                    StorageManager.saveLocalTransactionsForUser(activeUser, parsed);
                    await setupFilterMonthOptions();
                    await refreshAppUI();
                    showToast('Data transaksi berhasil diimpor!', 'success');
                } else {
                    showToast('Format file JSON tidak valid.', 'error');
                }
            } catch (err) {
                showToast('Gagal membaca file JSON.', 'error');
            }
        };
        reader.readAsText(file);
    });

    btnResetData.addEventListener('click', async () => {
        if (confirm('Apakah Anda yakin ingin mengembalikan seluruh data ke sampel bawaan (Dummy Data)?')) {
            StorageManager.resetToDefault();
            await setupFilterMonthOptions();
            await refreshAppUI();
            showToast('Data dikembalikan ke Sampel Bawaan!', 'success');
        }
    });

    // Helper Toast
    function showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const iconClass = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';

        toast.innerHTML = `
            <i class="fa-solid ${iconClass}" style="color: ${type === 'success' ? 'var(--color-income)' : 'var(--color-expense)'}"></i>
            <span>${escapeHtml(message)}</span>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
});
