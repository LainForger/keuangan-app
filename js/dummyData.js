/**
 * Data awal transaksi dummy untuk pengisian awal website KeuanganKu
 * (Ubah INITIAL_TRANSACTIONS menjadi [] jika ingin memulai dalam kondisi bersih tanpa data bawaan)
 */

const INITIAL_CATEGORIES = {
    pemasukan: [
        { id: 'gaji', name: 'Gaji Utama', icon: 'wallet', color: '#10b981' },
        { id: 'freelance', name: 'Freelance / Sampingan', icon: 'code', color: '#06b6d4' },
        { id: 'investasi', name: 'Hasil Investasi', icon: 'trending-up', color: '#8b5cf6' },
        { id: 'hadiah', name: 'Hadiah / Bonus', icon: 'gift', color: '#f59e0b' },
        { id: 'pemasukan_lain', name: 'Pemasukan Lainnya', icon: 'plus-circle', color: '#64748b' }
    ],
    pengeluaran: [
        { id: 'makanan', name: 'Makanan & Minuman', icon: 'utensils', color: '#ef4444' },
        { id: 'tagihan', name: 'Tagihan & Utilitas', icon: 'file-text', color: '#f97316' },
        { id: 'transportasi', name: 'Transportasi & Bensin', icon: 'car', color: '#eab308' },
        { id: 'belanja', name: 'Belanja & Kebutuhan', icon: 'shopping-bag', color: '#ec4899' },
        { id: 'hiburan', name: 'Hiburan & Rekreasi', icon: 'film', color: '#a855f7' },
        { id: 'kesehatan', name: 'Kesehatan & Medis', icon: 'activity', color: '#06b6d4' },
        { id: 'pendidikan', name: 'Pendidikan & Kursus', icon: 'book', color: '#3b82f6' },
        { id: 'pengeluaran_lain', name: 'Pengeluaran Lainnya', icon: 'minus-circle', color: '#64748b' }
    ]
};

// Set [] agar aplikasi dimulai dari kondisi bersih Rp 0 tanpa transaksi dummy
const INITIAL_TRANSACTIONS = [];
