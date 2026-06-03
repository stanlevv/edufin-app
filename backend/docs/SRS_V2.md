# Software Requirements Specification (SRS) - EDUFIN V2

## 1. Functional Requirements

### 1.1 Pinjaman Mikro (School-funded Micro-loans)
- **REQ-LOAN-01**: Admin dapat mengaktifkan/menonaktifkan fitur pinjaman mikro dari kas sekolah.
- **REQ-LOAN-02**: Siswa dapat mengajukan nominal pinjaman (maks limit disetel admin) dengan tenor cicilan tertentu.
- **REQ-LOAN-03**: Admin dapat melakukan CRUD penuh pada daftar pengajuan pinjaman (Approve, Reject, Ubah Status).
- **REQ-LOAN-04**: Jika pinjaman disetujui, cicilan baru akan dibuat otomatis terikat ke akun siswa, dan dana cair (secara real/sistem).

### 1.2 Transparansi Campaign ("Feed Update")
- **REQ-FEED-01**: Siswa pembuat campaign wajib bisa memposting "Update" (teks + gambar/bukti nota).
- **REQ-FEED-02**: Saat ada update baru, sistem *harus* memicu notifikasi (In-App & Email) ke semua donatur yang mendanai campaign tersebut.
- **REQ-FEED-03**: Klik notifikasi akan membawa donatur langsung ke halaman *Feed Update* di Campaign terkait.
- **REQ-FEED-04**: Admin sekolah dapat meninjau (review) Feed Update dan dapat menghapusnya jika tidak sesuai.

### 1.3 Integrasi Pembayaran (Midtrans)
- **REQ-PAY-01**: Sistem dapat membuat token transaksi Snap Midtrans untuk SPP & Donasi.
- **REQ-PAY-02**: Sistem mendengarkan (listen) webhook Midtrans dan mengubah status pembayaran menjadi LUNAS/SUCCESS secara otomatis tanpa campur tangan admin.

## 2. Non-Functional Requirements
- **NFR-01 (Security)**: Data nota bukti ("Feed Update") disimpan di Supabase Storage dengan bucket policy yang mengizinkan donatur terkait membaca (read) gambar tersebut.
- **NFR-02 (Performance)**: Load halaman Campaign dengan feed history harus dimuat kurang dari 3 detik (lazy loading untuk gambar).
- **NFR-03 (Reliability)**: Kegagalan sistem notifikasi email tidak boleh menggagalkan proses posting *Feed Update*.
