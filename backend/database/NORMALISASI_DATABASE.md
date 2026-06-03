# TAHAPAN NORMALISASI DATABASE EDUFIN

## 📚 Pengertian Normalisasi

Normalisasi adalah proses mengorganisasi data dalam database untuk mengurangi redundansi dan meningkatkan integritas data. Normalisasi dilakukan melalui beberapa tahap (bentuk normal) untuk memastikan struktur database yang efisien.

---

## 🔄 Tahapan Normalisasi Database EDUFIN

### **UNF (Unnormalized Form) - Bentuk Tidak Normal**

Pada tahap awal, data masih belum terstruktur dengan baik dan terdapat banyak redundansi.

**Contoh Data Awal:**
```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ NISN       │ Nama Siswa    │ Kelas     │ Parent Name     │ Parent Phone │ Tagihan SPP   │
├────────────┼───────────────┼───────────┼─────────────────┼──────────────┼───────────────┤
│ 0012345678 │ Budi Santoso  │ XII IPA 2 │ Hendra Santoso  │ 08123456789  │ SPP:500000,   │
│            │               │           │                 │              │ Lab:125000,   │
│            │               │           │                 │              │ Library:75000 │
├────────────┼───────────────┼───────────┼─────────────────┼──────────────┼───────────────┤
│ 0012345679 │ Dewi Rahayu   │ XII IPA 1 │ Ahmad Rahayu    │ 08198765432  │ SPP:500000,   │
│            │               │           │                 │              │ Lab:125000    │
└────────────┴───────────────┴───────────┴─────────────────┴──────────────┴───────────────┘
```

**Masalah:**
- ❌ Data tagihan disimpan dalam satu field (multivalued attribute)
- ❌ Data orang tua tercampur dengan data siswa
- ❌ Tidak ada primary key yang jelas
- ❌ Redundansi data tinggi

---

### **1NF (First Normal Form) - Bentuk Normal Pertama**

**Syarat:**
1. ✅ Setiap kolom hanya berisi satu nilai (atomic)
2. ✅ Setiap baris harus unik (ada primary key)
3. ✅ Tidak ada repeating groups

**Tabel Setelah 1NF:**

**Tabel: student_data**
```
┌──────────────┬───────────────┬───────────┬─────────────────┬──────────────┬───────────┬────────┐
│ nisn (PK)    │ nama_siswa    │ kelas     │ parent_name     │ parent_phone │ fee_type  │ amount │
├──────────────┼───────────────┼───────────┼─────────────────┼──────────────┼───────────┼────────┤
│ 0012345678   │ Budi Santoso  │ XII IPA 2 │ Hendra Santoso  │ 08123456789  │ SPP       │ 500000 │
│ 0012345678   │ Budi Santoso  │ XII IPA 2 │ Hendra Santoso  │ 08123456789  │ Lab       │ 125000 │
│ 0012345678   │ Budi Santoso  │ XII IPA 2 │ Hendra Santoso  │ 08123456789  │ Library   │ 75000  │
│ 0012345679   │ Dewi Rahayu   │ XII IPA 1 │ Ahmad Rahayu    │ 08198765432  │ SPP       │ 500000 │
│ 0012345679   │ Dewi Rahayu   │ XII IPA 1 │ Ahmad Rahayu    │ 08198765432  │ Lab       │ 125000 │
└──────────────┴───────────────┴───────────┴─────────────────┴──────────────┴───────────┴────────┘
```

**Perbaikan:**
- ✅ Setiap kolom berisi satu nilai saja
- ✅ Ada primary key (nisn + fee_type)
- ❌ Masih ada redundansi (nama siswa, parent data berulang)

---

### **2NF (Second Normal Form) - Bentuk Normal Kedua**

**Syarat:**
1. ✅ Sudah dalam bentuk 1NF
2. ✅ Tidak ada partial dependency (semua atribut non-key harus bergantung penuh pada primary key)

**Tabel Setelah 2NF:**

**Tabel: students**
```
┌──────────────┬───────────────┬───────────┬────────────┐
│ nisn (PK)    │ nama_siswa    │ kelas     │ parent_id  │
├──────────────┼───────────────┼───────────┼────────────┤
│ 0012345678   │ Budi Santoso  │ XII IPA 2 │ P001       │
│ 0012345679   │ Dewi Rahayu   │ XII IPA 1 │ P002       │
└──────────────┴───────────────┴───────────┴────────────┘
```

**Tabel: parents**
```
┌──────────────┬─────────────────┬──────────────┐
│ parent_id(PK)│ parent_name     │ parent_phone │
├──────────────┼─────────────────┼──────────────┤
│ P001         │ Hendra Santoso  │ 08123456789  │
│ P002         │ Ahmad Rahayu    │ 08198765432  │
└──────────────┴─────────────────┴──────────────┘
```

**Tabel: fee_types**
```
┌──────────────┬───────────┬────────┐
│ fee_type(PK) │ type_name │ amount │
├──────────────┼───────────┼────────┤
│ FT001        │ SPP       │ 500000 │
│ FT002        │ Lab       │ 125000 │
│ FT003        │ Library   │ 75000  │
└──────────────┴───────────┴────────┘
```

**Perbaikan:**
- ✅ Menghilangkan partial dependency
- ✅ Data orang tua dipisah ke tabel sendiri
- ✅ Jenis biaya dipisah ke tabel tersendiri
- ❌ Masih bisa ada transitive dependency

---

### **3NF (Third Normal Form) - Bentuk Normal Ketiga**

**Syarat:**
1. ✅ Sudah dalam bentuk 2NF
2. ✅ Tidak ada transitive dependency (atribut non-key tidak boleh bergantung pada atribut non-key lainnya)

**Tabel Final Setelah 3NF:**

**Tabel: users** (gabungan parent & donor & admin)
```
┌─────────────┬──────────────┬────────────┬──────┬─────────────────┬──────────────┐
│ id (PK)     │ email        │ password   │ role │ name            │ phone        │
├─────────────┼──────────────┼────────────┼──────┼─────────────────┼──────────────┤
│ UUID-001    │ parent@x.id  │ hash123    │ P    │ Hendra Santoso  │ 08123456789  │
│ UUID-002    │ donor@x.id   │ hash456    │ D    │ Rina Permata    │ 08198765432  │
└─────────────┴──────────────┴────────────┴──────┴─────────────────┴──────────────┘
```

**Tabel: students**
```
┌─────────────┬──────────────┬───────────────┬───────────┬─────────────┐
│ id (PK)     │ parent_id(FK)│ nisn          │ name      │ class       │
├─────────────┼──────────────┼───────────────┼───────────┼─────────────┤
│ UUID-S001   │ UUID-001     │ 0012345678    │ Budi      │ XII IPA 2   │
└─────────────┴──────────────┴───────────────┴───────────┴─────────────┘
```

**Tabel: bills** (tagihan per siswa per bulan)
```
┌─────────────┬──────────────┬────────────┬────────┬──────────────────────────────────┐
│ id (PK)     │ student_id(FK)│ month_year │ amount │ breakdown (JSONB)                │
├─────────────┼──────────────┼────────────┼────────┼──────────────────────────────────┤
│ UUID-B001   │ UUID-S001    │ 2026-04-01 │ 850000 │ {spp:500k,lab:125k,library:75k}  │
└─────────────┴──────────────┴────────────┴────────┴──────────────────────────────────┘
```

**Tabel: payments** (transaksi pembayaran)
```
┌─────────────┬──────────────┬──────────────┬────────┬────────────┐
│ id (PK)     │ bill_id (FK) │ user_id (FK) │ amount │ status     │
├─────────────┼──────────────┼──────────────┼────────┼────────────┤
│ UUID-P001   │ UUID-B001    │ UUID-001     │ 850000 │ success    │
└─────────────┴──────────────┴──────────────┴────────┴────────────┘
```

**Tabel: campaigns** (kampanye donasi)
```
┌─────────────┬───────────────────────┬────────────┬──────────────┬────────┐
│ id (PK)     │ title                 │ target     │ collected    │ status │
├─────────────┼───────────────────────┼────────────┼──────────────┼────────┤
│ UUID-C001   │ Beasiswa Berprestasi  │ 15000000   │ 11200000     │ active │
└─────────────┴───────────────────────┴────────────┴──────────────┴────────┘
```

**Tabel: donations** (donasi ke kampanye)
```
┌─────────────┬──────────────────┬──────────────┬────────┬────────┐
│ id (PK)     │ campaign_id (FK) │ donor_id(FK) │ amount │ status │
├─────────────┼──────────────────┼──────────────┼────────┼────────┤
│ UUID-D001   │ UUID-C001        │ UUID-002     │ 200000 │ success│
└─────────────┴──────────────────┴──────────────┴────────┴────────┘
```

**Tabel: aid_requests** (pengajuan bantuan SPP)
```
┌─────────────┬──────────────┬──────────────┬──────────────┬────────┐
│ id (PK)     │ student_id(FK)│ parent_id(FK)│ bill_id (FK) │ status │
├─────────────┼──────────────┼──────────────┼──────────────┼────────┤
│ UUID-A001   │ UUID-S001    │ UUID-001     │ UUID-B001    │ pending│
└─────────────┴──────────────┴──────────────┴──────────────┴────────┘
```

**Tabel: support_tickets** (form bantuan IT)
```
┌─────────────┬──────────────┬──────────┬─────────────┬────────┐
│ id (PK)     │ user_id (FK) │ category │ description │ status │
├─────────────┼──────────────┼──────────┼─────────────┼────────┤
│ UUID-T001   │ UUID-001     │ bug      │ Error login │ open   │
└─────────────┴──────────────┴──────────┴─────────────┴────────┘
```

**Perbaikan:**
- ✅ Tidak ada transitive dependency
- ✅ Setiap tabel memiliki satu fungsi/concern saja
- ✅ Relasi antar tabel jelas dengan foreign key
- ✅ Redundansi data minimal
- ✅ Update/delete anomali sudah dihilangkan

---

## 📊 Relasi Antar Tabel (Kardinalitas)

```
users (1) ──< (N) students
  "Satu parent bisa punya banyak anak"

students (1) ──< (N) bills
  "Satu siswa punya banyak tagihan (per bulan)"

bills (1) ──< (N) payments
  "Satu tagihan bisa dibayar berkali-kali (cicilan)"

users (1) ──< (N) donations
  "Satu donatur bisa donasi ke banyak kampanye"

campaigns (1) ──< (N) donations
  "Satu kampanye menerima banyak donasi"

students (1) ──< (N) aid_requests
  "Satu siswa bisa ajukan banyak bantuan"

users (1) ──< (N) support_tickets
  "Satu user bisa buat banyak ticket support"
```

---

## ✅ Keuntungan Normalisasi 3NF

1. **Mengurangi Redundansi**
   - Data tidak disimpan berulang-ulang
   - Hemat storage dan memudahkan update

2. **Integritas Data Terjaga**
   - Dengan foreign key constraint
   - Mencegah orphan records

3. **Performa Query Lebih Baik**
   - Index pada primary/foreign key
   - Query optimization lebih mudah

4. **Mudah Maintenance**
   - Perubahan struktur lebih terlokalisir
   - Bug fixing lebih mudah

5. **Skalabilitas**
   - Mudah menambah fitur baru
   - Tidak perlu restructure besar-besaran

---

## 🎯 Kesimpulan

Database EDUFIN sudah dinormalisasi hingga **3NF** dengan:
- ✅ **8 tabel utama** yang terstruktur
- ✅ **Relasi jelas** dengan foreign key
- ✅ **Tidak ada redundansi** yang tidak perlu
- ✅ **Integritas data terjaga** dengan constraints
- ✅ **Mudah di-scale** untuk fitur masa depan

Struktur ini sudah optimal untuk aplikasi single-school seperti EDUFIN, dengan balance antara normalisasi dan performa query.
