/**
 * Data awal transaksi dummy untuk pengisian awal website KeuanganKu
 * Berisi transaksi beberapa bulan terakhir (Maret 2026 - September 2026)
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

const INITIAL_TRANSACTIONS = [
    // September 2026 (Bulan Ini)
    {
        id: 'tx-101',
        title: 'Gaji Bulanan September',
        amount: 8500000,
        type: 'pemasukan',
        category: 'gaji',
        date: '2026-09-01',
        note: 'Gaji pokok bulan September'
    },
    {
        id: 'tx-102',
        title: 'Belanja Bulanan Supermarket',
        amount: 1450000,
        type: 'pengeluaran',
        category: 'belanja',
        date: '2026-09-02',
        note: 'Beli stok bahan makanan & perlengkapan rumah'
    },
    {
        id: 'tx-103',
        title: 'Bayar Listrik & WiFi',
        amount: 680000,
        type: 'pengeluaran',
        category: 'tagihan',
        date: '2026-09-04',
        note: 'PLN & Indihome 100Mbps'
    },
    {
        id: 'tx-104',
        title: 'Project Website Client A',
        amount: 3200000,
        type: 'pemasukan',
        category: 'freelance',
        date: '2026-09-05',
        note: 'DP Project Redesign Landing Page'
    },
    {
        id: 'tx-105',
        title: 'Makan Malam Resto',
        amount: 340000,
        type: 'pengeluaran',
        category: 'makanan',
        date: '2026-09-07',
        note: 'Makan bersama keluarga'
    },
    {
        id: 'tx-106',
        title: 'Bensin & Servis Motor',
        amount: 280000,
        type: 'pengeluaran',
        category: 'transportasi',
        date: '2026-09-09',
        note: 'Isi Pertamax dan ganti oli'
    },
    {
        id: 'tx-107',
        title: 'Langganan Netflix & Spotify',
        amount: 215000,
        type: 'pengeluaran',
        category: 'hiburan',
        date: '2026-09-10',
        note: 'Autodebet bulanan'
    },

    // Agustus 2026
    {
        id: 'tx-081',
        title: 'Gaji Bulanan Agustus',
        amount: 8500000,
        type: 'pemasukan',
        category: 'gaji',
        date: '2026-08-01',
        note: 'Gaji pokok'
    },
    {
        id: 'tx-082',
        title: 'Tagihan Listrik, Air & WiFi',
        amount: 720000,
        type: 'pengeluaran',
        category: 'tagihan',
        date: '2026-08-03',
        note: 'Tagihan rutin bulanan'
    },
    {
        id: 'tx-083',
        title: 'Belanja Mingguan',
        amount: 1850000,
        type: 'pengeluaran',
        category: 'belanja',
        date: '2026-08-05',
        note: 'Belanja bahan makanan & kebutuhan'
    },
    {
        id: 'tx-084',
        title: 'Beli Sepatu Olahraga',
        amount: 890000,
        type: 'pengeluaran',
        category: 'belanja',
        date: '2026-08-12',
        note: 'Sepatu running'
    },
    {
        id: 'tx-085',
        title: 'Dividen Saham',
        amount: 1250000,
        type: 'pemasukan',
        category: 'investasi',
        date: '2026-08-15',
        note: 'Hasil dividen kuartal II'
    },
    {
        id: 'tx-086',
        title: 'Tiket Bioskop & Kuliner',
        amount: 450000,
        type: 'pengeluaran',
        category: 'hiburan',
        date: '2026-08-18',
        note: 'Nonton bareng teman'
    },
    {
        id: 'tx-087',
        title: 'Medical Checkup & Obat',
        amount: 650000,
        type: 'pengeluaran',
        category: 'kesehatan',
        date: '2026-08-22',
        note: 'Pemeriksaan rutin'
    },
    {
        id: 'tx-088',
        title: 'Bensin & Tol',
        amount: 420000,
        type: 'pengeluaran',
        category: 'transportasi',
        date: '2026-08-28',
        note: 'Perjalanan luar kota'
    },

    // Juli 2026
    {
        id: 'tx-071',
        title: 'Gaji Bulanan Juli',
        amount: 8500000,
        type: 'pemasukan',
        category: 'gaji',
        date: '2026-07-01',
        note: 'Gaji pokok'
    },
    {
        id: 'tx-072',
        title: 'Bonus Kinerja Perusahaan',
        amount: 2500000,
        type: 'pemasukan',
        category: 'hadiah',
        date: '2026-07-02',
        note: 'Bonus capaian Q2'
    },
    {
        id: 'tx-073',
        title: 'Bayar Kost / Sewa Rumah',
        amount: 2200000,
        type: 'pengeluaran',
        category: 'tagihan',
        date: '2026-07-03',
        note: 'Sewa tempat tinggal'
    },
    {
        id: 'tx-074',
        title: 'Belanja Bahan Pokok',
        amount: 1600000,
        type: 'pengeluaran',
        category: 'belanja',
        date: '2026-07-06',
        note: 'Supermarket'
    },
    {
        id: 'tx-075',
        title: 'Kursus Online Web Dev',
        amount: 750000,
        type: 'pengeluaran',
        category: 'pendidikan',
        date: '2026-07-10',
        note: 'Langganan platform belajar'
    },
    {
        id: 'tx-076',
        title: 'Transportasi Harian',
        amount: 510000,
        type: 'pengeluaran',
        category: 'transportasi',
        date: '2026-07-20',
        note: 'Ojek online & KRL'
    },
    {
        id: 'tx-077',
        title: 'Makan di Cafe & Resto',
        amount: 620000,
        type: 'pengeluaran',
        category: 'makanan',
        date: '2026-07-25',
        note: 'Nongkrong weekend'
    },

    // Juni 2026
    {
        id: 'tx-061',
        title: 'Gaji Bulanan Juni',
        amount: 8500000,
        type: 'pemasukan',
        category: 'gaji',
        date: '2026-06-01',
        note: 'Gaji pokok'
    },
    {
        id: 'tx-062',
        title: 'Belanja & Utilitas',
        amount: 2100000,
        type: 'pengeluaran',
        category: 'belanja',
        date: '2026-06-04',
        note: 'Belanja bulanan'
    },
    {
        id: 'tx-063',
        title: 'Servis Mobil',
        amount: 1350000,
        type: 'pengeluaran',
        category: 'transportasi',
        date: '2026-06-11',
        note: 'Ganti oli & tune up'
    },
    {
        id: 'tx-064',
        title: 'Proyek Sampingan UI/UX',
        amount: 4000000,
        type: 'pemasukan',
        category: 'freelance',
        date: '2026-06-15',
        note: 'Desain mobile app'
    },
    {
        id: 'tx-065',
        title: 'Tagihan Listrik & Internet',
        amount: 690000,
        type: 'pengeluaran',
        category: 'tagihan',
        date: '2026-06-18',
        note: 'Rutin'
    },
    {
        id: 'tx-066',
        title: 'Liburan Akhir Pekan',
        amount: 1750000,
        type: 'pengeluaran',
        category: 'hiburan',
        date: '2026-06-25',
        note: 'Staycation singkat'
    },

    // Mei 2026
    {
        id: 'tx-051',
        title: 'Gaji Bulanan Mei',
        amount: 8500000,
        type: 'pemasukan',
        category: 'gaji',
        date: '2026-05-01',
        note: 'Gaji pokok'
    },
    {
        id: 'tx-052',
        title: 'Pengeluaran Makanan & Kebutuhan',
        amount: 1950000,
        type: 'pengeluaran',
        category: 'makanan',
        date: '2026-05-05',
        note: 'Kebutuhan dapur & makan luar'
    },
    {
        id: 'tx-053',
        title: 'Tagihan Bulanan',
        amount: 780000,
        type: 'pengeluaran',
        category: 'tagihan',
        date: '2026-05-10',
        note: 'Listrik & internet'
    },
    {
        id: 'tx-054',
        title: 'Transportasi',
        amount: 460000,
        type: 'pengeluaran',
        category: 'transportasi',
        date: '2026-05-18',
        note: 'Bensin & tol'
    },

    // April 2026
    {
        id: 'tx-041',
        title: 'Gaji Bulanan April',
        amount: 8500000,
        type: 'pemasukan',
        category: 'gaji',
        date: '2026-04-01',
        note: 'Gaji pokok'
    },
    {
        id: 'tx-042',
        title: 'Belanja Pakaian & Sepatu',
        amount: 1200000,
        type: 'pengeluaran',
        category: 'belanja',
        date: '2026-04-08',
        note: 'Pakaian kerja'
    },
    {
        id: 'tx-043',
        title: 'Tagihan Utilitas',
        amount: 710000,
        type: 'pengeluaran',
        category: 'tagihan',
        date: '2026-04-12',
        note: 'Listrik & WiFi'
    },
    {
        id: 'tx-044',
        title: 'Makan & Kuliner',
        amount: 1550000,
        type: 'pengeluaran',
        category: 'makanan',
        date: '2026-04-20',
        note: 'Konsumsi bulanan'
    }
];
