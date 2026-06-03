# DOKUMENTASI TABEL DATABASE EDUFIN

## Daftar Tabel

1. users - Data pengguna (parent, donor, admin)
2. students - Data siswa
3. bills - Tagihan SPP
4. payments - Transaksi pembayaran
5. campaigns - Kampanye donasi
6. donations - Donasi ke kampanye
7. aid_requests - Pengajuan bantuan SPP
8. support_tickets - Tiket bantuan IT

---

## 1. Tabel: users

**Deskripsi:** Menyimpan data semua pengguna sistem (parent, donor, admin)

| No | Field Name    | Type         | Length | Constraint  | Keterangan                                    |
|----|---------------|--------------|--------|-------------|-----------------------------------------------|
| 1  | id            | UUID         | -      | PRIMARY KEY | ID unik pengguna                              |
| 2  | email         | TEXT         | -      | UNIQUE, NOT NULL | Email login pengguna                     |
| 3  | password_hash | TEXT         | -      | NOT NULL    | Password terenkripsi (bcrypt)                 |
| 4  | role          | TEXT         | -      | NOT NULL    | Role: 'student', 'parent', 'donor', 'admin'   |
| 5  | name          | TEXT         | -      | NOT NULL    | Nama lengkap pengguna                         |
| 6  | phone         | TEXT         | -      | -           | Nomor telepon/HP                              |
| 7  | avatar_url    | TEXT         | -      | -           | URL foto profil                               |
| 8  | metadata      | JSONB        | -      | DEFAULT '{}' | Data tambahan per role (flexible)            |
| 9  | created_at    | TIMESTAMPTZ  | -      | DEFAULT NOW() | Waktu pembuatan akun                        |
| 10 | updated_at    | TIMESTAMPTZ  | -      | DEFAULT NOW() | Waktu update terakhir                       |

**Index:**
- `idx_users_email` ON email
- `idx_users_role` ON role

---

## 2. Tabel: students

**Deskripsi:** Menyimpan data siswa yang terdaftar di sekolah

| No | Field Name      | Type        | Length | Constraint       | Keterangan                            |
|----|-----------------|-------------|--------|------------------|---------------------------------------|
| 1  | id              | UUID        | -      | PRIMARY KEY      | ID unik siswa                         |
| 2  | parent_id       | UUID        | -      | FOREIGN KEY      | Referensi ke users(id) → parent       |
| 3  | nisn            | TEXT        | -      | UNIQUE, NOT NULL | Nomor Induk Siswa Nasional            |
| 4  | name            | TEXT        | -      | NOT NULL         | Nama lengkap siswa                    |
| 5  | class           | TEXT        | -      | NOT NULL         | Kelas siswa (e.g., "XII IPA 2")       |
| 6  | grade_level     | INTEGER     | -      | NOT NULL         | Tingkat kelas (10, 11, 12)            |
| 7  | enrollment_year | INTEGER     | -      | NOT NULL         | Tahun masuk sekolah                   |
| 8  | status          | TEXT        | -      | DEFAULT 'active' | Status: 'active', 'inactive', 'graduated' |
| 9  | created_at      | TIMESTAMPTZ | -      | DEFAULT NOW()    | Waktu pendaftaran                     |
| 10 | updated_at      | TIMESTAMPTZ | -      | DEFAULT NOW()    | Waktu update terakhir                 |

**Index:**
- `idx_students_parent` ON parent_id
- `idx_students_nisn` ON nisn

**Foreign Key:**
- parent_id → users(id) ON DELETE CASCADE

---

## 3. Tabel: bills

**Deskripsi:** Menyimpan tagihan SPP per siswa per bulan

| No | Field Name      | Type         | Length | Constraint    | Keterangan                                    |
|----|-----------------|--------------|--------|---------------|-----------------------------------------------|
| 1  | id              | UUID         | -      | PRIMARY KEY   | ID unik tagihan                               |
| 2  | student_id      | UUID         | -      | FOREIGN KEY   | Referensi ke students(id)                     |
| 3  | month_year      | DATE         | -      | NOT NULL      | Bulan & tahun tagihan (e.g., 2026-04-01)      |
| 4  | amount          | NUMERIC(12,2)| -      | NOT NULL      | Total tagihan (Rupiah)                        |
| 5  | breakdown       | JSONB        | -      | NOT NULL      | Rincian biaya {spp, lab, library, activities} |
| 6  | due_date        | DATE         | -      | NOT NULL      | Tanggal jatuh tempo                           |
| 7  | status          | TEXT         | -      | DEFAULT 'pending' | Status: 'pending', 'paid', 'overdue', 'installment', 'deferred' |
| 8  | paid_at         | TIMESTAMPTZ  | -      | -             | Waktu pembayaran lunas                        |
| 9  | payment_method  | TEXT         | -      | -             | Metode pembayaran: 'qris', 'va', 'bank_transfer' |
| 10 | created_at      | TIMESTAMPTZ  | -      | DEFAULT NOW() | Waktu pembuatan tagihan                       |
| 11 | updated_at      | TIMESTAMPTZ  | -      | DEFAULT NOW() | Waktu update terakhir                         |

**Index:**
- `idx_bills_student` ON student_id
- `idx_bills_status` ON status
- `idx_bills_month_year` ON month_year

**Foreign Key:**
- student_id → students(id) ON DELETE CASCADE

---

## 4. Tabel: payments

**Deskripsi:** Menyimpan transaksi pembayaran tagihan SPP

| No | Field Name       | Type         | Length | Constraint      | Keterangan                                      |
|----|------------------|--------------|--------|-----------------|------------------------------------------------|
| 1  | id               | UUID         | -      | PRIMARY KEY     | ID unik pembayaran                             |
| 2  | bill_id          | UUID         | -      | FOREIGN KEY     | Referensi ke bills(id)                         |
| 3  | user_id          | UUID         | -      | FOREIGN KEY     | Referensi ke users(id) → yang bayar (parent)   |
| 4  | amount           | NUMERIC(12,2)| -      | NOT NULL        | Jumlah yang dibayarkan                         |
| 5  | payment_type     | TEXT         | -      | NOT NULL        | Tipe: 'full', 'installment', 'deferred'        |
| 6  | payment_method   | TEXT         | -      | NOT NULL        | Metode: 'qris', 'va', 'bank_transfer'          |
| 7  | installment_plan | JSONB        | -      | -               | Detail cicilan {total, current, schedule}      |
| 8  | status           | TEXT         | -      | DEFAULT 'pending' | Status: 'pending', 'success', 'failed'       |
| 9  | gateway_ref      | TEXT         | -      | -               | Reference ID dari payment gateway              |
| 10 | paid_at          | TIMESTAMPTZ  | -      | -               | Waktu pembayaran berhasil                      |
| 11 | created_at       | TIMESTAMPTZ  | -      | DEFAULT NOW()   | Waktu transaksi dibuat                         |

**Index:**
- `idx_payments_bill` ON bill_id
- `idx_payments_user` ON user_id
- `idx_payments_status` ON status

**Foreign Key:**
- bill_id → bills(id) ON DELETE CASCADE
- user_id → users(id)

---

## 5. Tabel: campaigns

**Deskripsi:** Menyimpan kampanye donasi (beasiswa, renovasi, dll)

| No | Field Name        | Type         | Length | Constraint      | Keterangan                                    |
|----|-------------------|--------------|--------|-----------------|-----------------------------------------------|
| 1  | id                | UUID         | -      | PRIMARY KEY     | ID unik kampanye                              |
| 2  | title             | TEXT         | -      | NOT NULL        | Judul kampanye                                |
| 3  | description       | TEXT         | -      | NOT NULL        | Deskripsi lengkap kampanye                    |
| 4  | reason            | TEXT         | -      | NOT NULL        | Alasan/latar belakang kampanye                |
| 5  | target_amount     | NUMERIC(12,2)| -      | NOT NULL        | Target dana yang ingin dikumpulkan            |
| 6  | collected_amount  | NUMERIC(12,2)| -      | DEFAULT 0       | Dana yang sudah terkumpul                     |
| 7  | start_date        | DATE         | -      | NOT NULL        | Tanggal mulai kampanye                        |
| 8  | end_date          | DATE         | -      | NOT NULL        | Tanggal akhir kampanye                        |
| 9  | status            | TEXT         | -      | DEFAULT 'pending' | Status: 'pending', 'active', 'completed', 'rejected' |
| 10 | student_id        | UUID         | -      | FOREIGN KEY     | Siswa yang dibantu (opsional)                 |
| 11 | cover_image_url   | TEXT         | -      | -               | URL gambar cover kampanye                     |
| 12 | verified_by       | UUID         | -      | FOREIGN KEY     | Admin yang verifikasi                         |
| 13 | verified_at       | TIMESTAMPTZ  | -      | -               | Waktu verifikasi                              |
| 14 | created_by        | UUID         | -      | FOREIGN KEY     | User yang membuat (parent/admin)              |
| 15 | created_at        | TIMESTAMPTZ  | -      | DEFAULT NOW()   | Waktu pembuatan kampanye                      |
| 16 | updated_at        | TIMESTAMPTZ  | -      | DEFAULT NOW()   | Waktu update terakhir                         |

**Index:**
- `idx_campaigns_status` ON status
- `idx_campaigns_created_by` ON created_by

**Foreign Key:**
- student_id → students(id) ON DELETE SET NULL
- verified_by → users(id)
- created_by → users(id) NOT NULL

---

## 6. Tabel: donations

**Deskripsi:** Menyimpan transaksi donasi ke kampanye

| No | Field Name    | Type         | Length | Constraint      | Keterangan                                |
|----|---------------|--------------|--------|-----------------|-------------------------------------------|
| 1  | id            | UUID         | -      | PRIMARY KEY     | ID unik donasi                            |
| 2  | campaign_id   | UUID         | -      | FOREIGN KEY     | Referensi ke campaigns(id)                |
| 3  | donor_id      | UUID         | -      | FOREIGN KEY     | Referensi ke users(id) → donatur          |
| 4  | amount        | NUMERIC(12,2)| -      | NOT NULL        | Jumlah donasi (min Rp10.000)              |
| 5  | message       | TEXT         | -      | -               | Pesan/doa dari donatur (opsional)         |
| 6  | is_anonymous  | BOOLEAN      | -      | DEFAULT FALSE   | Donasi anonim atau tidak                  |
| 7  | payment_method| TEXT         | -      | NOT NULL        | Metode: 'qris', 'va', 'bank_transfer'     |
| 8  | status        | TEXT         | -      | DEFAULT 'pending' | Status: 'pending', 'success', 'failed'  |
| 9  | gateway_ref   | TEXT         | -      | -               | Reference ID dari payment gateway         |
| 10 | created_at    | TIMESTAMPTZ  | -      | DEFAULT NOW()   | Waktu donasi dibuat                       |

**Index:**
- `idx_donations_campaign` ON campaign_id
- `idx_donations_donor` ON donor_id

**Foreign Key:**
- campaign_id → campaigns(id) ON DELETE CASCADE
- donor_id → users(id) (NULL untuk guest donor)

---

## 7. Tabel: aid_requests

**Deskripsi:** Menyimpan pengajuan bantuan SPP dari orang tua/siswa

| No | Field Name        | Type         | Length | Constraint      | Keterangan                                  |
|----|-------------------|--------------|--------|-----------------|---------------------------------------------|
| 1  | id                | UUID         | -      | PRIMARY KEY     | ID unik pengajuan                           |
| 2  | student_id        | UUID         | -      | FOREIGN KEY     | Referensi ke students(id)                   |
| 3  | parent_id         | UUID         | -      | FOREIGN KEY     | Referensi ke users(id) → parent yang ajukan |
| 4  | bill_id           | UUID         | -      | FOREIGN KEY     | Tagihan yang dibantu                        |
| 5  | reason            | TEXT         | -      | NOT NULL        | Alasan pengajuan bantuan                    |
| 6  | requested_amount  | NUMERIC(12,2)| -      | NOT NULL        | Jumlah bantuan yang diajukan                |
| 7  | approved_amount   | NUMERIC(12,2)| -      | -               | Jumlah yang disetujui admin                 |
| 8  | status            | TEXT         | -      | DEFAULT 'pending' | Status: 'pending', 'approved', 'rejected', 'disbursed' |
| 9  | reviewed_by       | UUID         | -      | FOREIGN KEY     | Admin yang review                           |
| 10 | reviewed_at       | TIMESTAMPTZ  | -      | -               | Waktu review                                |
| 11 | created_at        | TIMESTAMPTZ  | -      | DEFAULT NOW()   | Waktu pengajuan dibuat                      |
| 12 | updated_at        | TIMESTAMPTZ  | -      | DEFAULT NOW()   | Waktu update terakhir                       |

**Index:**
- `idx_aid_requests_student` ON student_id
- `idx_aid_requests_status` ON status

**Foreign Key:**
- student_id → students(id) ON DELETE CASCADE
- parent_id → users(id) ON DELETE CASCADE
- bill_id → bills(id) ON DELETE CASCADE
- reviewed_by → users(id)

---

## 8. Tabel: support_tickets

**Deskripsi:** Menyimpan tiket bantuan IT dari user

| No | Field Name    | Type        | Length | Constraint      | Keterangan                                    |
|----|---------------|-------------|--------|-----------------|-----------------------------------------------|
| 1  | id            | UUID        | -      | PRIMARY KEY     | ID unik tiket                                 |
| 2  | user_id       | UUID        | -      | FOREIGN KEY     | Referensi ke users(id) → pembuat tiket        |
| 3  | subject       | TEXT        | -      | NOT NULL        | Subject/judul masalah                         |
| 4  | category      | TEXT        | -      | NOT NULL        | Kategori: 'bug', 'password', 'payment', 'data', 'feature', 'other' |
| 5  | description   | TEXT        | -      | NOT NULL        | Deskripsi detail masalah                      |
| 6  | attachment_url| TEXT        | -      | -               | URL lampiran (screenshot/file)                |
| 7  | status        | TEXT        | -      | DEFAULT 'open'  | Status: 'open', 'in_progress', 'resolved', 'closed' |
| 8  | resolved_by   | UUID        | -      | FOREIGN KEY     | Admin yang menangani                          |
| 9  | resolved_at   | TIMESTAMPTZ | -      | -               | Waktu penyelesaian                            |
| 10 | created_at    | TIMESTAMPTZ | -      | DEFAULT NOW()   | Waktu tiket dibuat                            |
| 11 | updated_at    | TIMESTAMPTZ | -      | DEFAULT NOW()   | Waktu update terakhir                         |

**Index:**
- `idx_support_tickets_user` ON user_id
- `idx_support_tickets_status` ON status

**Foreign Key:**
- user_id → users(id) ON DELETE CASCADE
- resolved_by → users(id)

---

## Ringkasan Relasi Antar Tabel

```
users (1) ──< (N) students
  → Satu parent bisa punya banyak anak

students (1) ──< (N) bills
  → Satu siswa punya banyak tagihan (per bulan)

bills (1) ──< (N) payments
  → Satu tagihan bisa dibayar berkali-kali (cicilan)

users (1) ──< (N) payments
  → Satu user bisa melakukan banyak pembayaran

campaigns (1) ──< (N) donations
  → Satu kampanye menerima banyak donasi

users (1) ──< (N) donations
  → Satu donatur bisa donasi ke banyak kampanye

students (1) ──< (N) aid_requests
  → Satu siswa bisa ajukan banyak bantuan

bills (1) ──< (N) aid_requests
  → Satu tagihan bisa diajukan bantuannya

users (1) ──< (N) aid_requests
  → Satu parent bisa ajukan banyak bantuan

users (1) ──< (N) support_tickets
  → Satu user bisa buat banyak tiket
```

---

## Catatan Teknis

1. **UUID sebagai Primary Key**
   - Lebih aman untuk distributed system
   - Tidak predictable seperti auto-increment
   - Compatible dengan Supabase

2. **JSONB untuk Data Fleksibel**
   - `metadata` di users: custom data per role
   - `breakdown` di bills: rincian biaya SPP
   - `installment_plan` di payments: detail cicilan

3. **Timestamp dengan Timezone (TIMESTAMPTZ)**
   - Otomatis menyesuaikan zona waktu
   - Akurat untuk audit trail

4. **Cascade Delete**
   - Saat parent/student dihapus → data terkait ikut terhapus
   - Mencegah orphan records

5. **Row Level Security (RLS)**
   - Parent hanya bisa lihat data anaknya
   - Donatur hanya bisa lihat donasinya
   - Admin bisa akses semua data
