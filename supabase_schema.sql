-- ==========================================================================
-- SCRIPT SQL SCHEMA SUPABASE - MULTI-USER & NAMA PENGGUNA UNIK (BERSIH)
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

-- (Opsional) Jika ingin menghapus seluruh transaksi lama yang sudah terlanjur ada di Supabase:
-- TRUNCATE TABLE public.transactions;
