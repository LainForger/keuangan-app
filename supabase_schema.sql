-- ==========================================================================
-- SCRIPT SQL SCHEMA SUPABASE - MULTI-USER & NAMA PENGGUNA UNIK
-- Copy & Paste ke SQL Editor Supabase Anda, lalu klik "RUN"
-- ==========================================================================

-- 1. Buat Tabel Users (Menyimpan Nama Pengguna Unik)
CREATE TABLE IF NOT EXISTS public.users (
    username TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Buat Tabel Transaksi (Dengan Kolom username)
CREATE TABLE IF NOT EXISTS public.transactions (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL REFERENCES public.users(username) ON DELETE CASCADE,
    title TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('pemasukan', 'pengeluaran')),
    category TEXT NOT NULL,
    date DATE NOT NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Aktifkan Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- 4. Kebijakan Akses Publik (Public Policies)
DROP POLICY IF EXISTS "Public Users Policy" ON public.users;
CREATE POLICY "Public Users Policy" ON public.users
    FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Transactions Policy" ON public.transactions;
CREATE POLICY "Public Transactions Policy" ON public.transactions
    FOR ALL USING (true) WITH CHECK (true);

-- 5. Masukkan Data Pengguna Bawaan (Dummy Users)
INSERT INTO public.users (username)
VALUES 
    ('Budi Pratama'),
    ('Siti Rahma')
ON CONFLICT (username) DO NOTHING;

-- 6. Masukkan Transaksi Awal Terikat ke 'Budi Pratama'
INSERT INTO public.transactions (id, username, title, amount, type, category, date, note)
VALUES 
    ('tx-101', 'Budi Pratama', 'Gaji Bulanan September', 8500000, 'pemasukan', 'gaji', '2026-09-01', 'Gaji pokok bulan September'),
    ('tx-102', 'Budi Pratama', 'Belanja Bulanan Supermarket', 1450000, 'pengeluaran', 'belanja', '2026-09-02', 'Beli stok bahan makanan & perlengkapan rumah'),
    ('tx-103', 'Budi Pratama', 'Bayar Listrik & WiFi', 680000, 'pengeluaran', 'tagihan', '2026-09-04', 'PLN & Indihome 100Mbps'),
    ('tx-104', 'Budi Pratama', 'Project Website Client A', 3200000, 'pemasukan', 'freelance', '2026-09-05', 'DP Project Redesign Landing Page'),
    ('tx-105', 'Budi Pratama', 'Makan Malam Resto', 340000, 'pengeluaran', 'makanan', '2026-09-07', 'Makan bersama keluarga'),
    ('tx-106', 'Budi Pratama', 'Bensin & Servis Motor', 280000, 'pengeluaran', 'transportasi', '2026-09-09', 'Isi Pertamax dan ganti oli'),
    ('tx-107', 'Budi Pratama', 'Langganan Netflix & Spotify', 215000, 'pengeluaran', 'hiburan', '2026-09-10', 'Autodebet bulanan'),
    ('tx-081', 'Budi Pratama', 'Gaji Bulanan Agustus', 8500000, 'pemasukan', 'gaji', '2026-08-01', 'Gaji pokok'),
    ('tx-082', 'Budi Pratama', 'Tagihan Listrik, Air & WiFi', 720000, 'pengeluaran', 'tagihan', '2026-08-03', 'Tagihan rutin bulanan'),
    ('tx-083', 'Budi Pratama', 'Belanja Mingguan', 1850000, 'pengeluaran', 'belanja', '2026-08-05', 'Belanja bahan makanan & kebutuhan')
ON CONFLICT (id) DO NOTHING;
