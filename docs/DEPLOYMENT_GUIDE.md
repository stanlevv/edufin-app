# EDUFIN - Deployment Guide

Panduan untuk deploy aplikasi EDUFIN agar mendapat URL bersih tanpa "/make/" dan menampilkan UI langsung.

---

## ❗ Tentang URL Figma Make

URL Figma Make seperti:
```
https://www.figma.com/make/6bd0Yw3Qo4VTAzMHVBn2HS/...
```

**TIDAK BISA** diubah menjadi URL tanpa `/make/` karena:
- `/make/` adalah bagian integral dari Figma Make platform
- URL tersebut khusus untuk development environment Figma
- Untuk production, aplikasi harus di-deploy ke hosting terpisah

---

## ✅ Solusi: Deploy ke Hosting

Untuk mendapat URL bersih dan menampilkan UI langsung tanpa interface Figma Make, Anda perlu deploy aplikasi ke platform hosting.

### Pilihan Hosting (Gratis)

1. **Netlify** ⭐ (Recommended)
2. **Vercel**
3. **GitHub Pages**
4. **Render**
5. **Railway**

---

## 📦 Option 1: Deploy ke Netlify (Recommended)

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Login ke Netlify
```bash
netlify login
```

### Step 3: Build Aplikasi
```bash
npm run build
```

### Step 4: Deploy
```bash
netlify deploy --prod
```

### Hasil:
Anda akan mendapat URL seperti:
```
https://edufin-sdn3malang.netlify.app
```

---

## 🚀 Option 2: Deploy ke Vercel

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login ke Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
vercel --prod
```

### Hasil:
Anda akan mendapat URL seperti:
```
https://edufin-sdn3malang.vercel.app
```

---

## 🔧 Option 3: Manual Build & Host

Jika Anda ingin host sendiri di server pribadi:

### Step 1: Build Production
```bash
npm run build
```

Ini akan generate folder `dist/` berisi file production-ready.

### Step 2: Upload ke Server
Upload semua isi folder `dist/` ke web server Anda (Apache, Nginx, dll).

### Step 3: Configure Server
Pastikan server dikonfigurasi untuk Single Page Application (SPA):

**Nginx:**
```nginx
server {
    listen 80;
    server_name edufin.yourdomain.com;
    root /var/www/edufin/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Apache (.htaccess):**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 🌐 Option 4: Deploy via GitHub Pages

### Step 1: Install gh-pages
```bash
npm install --save-dev gh-pages
```

### Step 2: Update package.json
Tambahkan di `package.json`:
```json
{
  "homepage": "https://username.github.io/edufin",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### Step 3: Deploy
```bash
npm run deploy
```

### Hasil:
```
https://username.github.io/edufin
```

---

## 📱 Custom Domain (Optional)

Setelah deploy, Anda bisa gunakan custom domain sendiri:

### Netlify Custom Domain
1. Masuk ke Netlify Dashboard
2. Pilih project Anda
3. Settings → Domain management → Add custom domain
4. Ikuti instruksi untuk configure DNS

Contoh hasil:
```
https://edufin.sdnmalang.sch.id
```

### Vercel Custom Domain
1. Masuk ke Vercel Dashboard
2. Pilih project → Settings → Domains
3. Add domain dan configure DNS

---

## 🔐 Environment Variables

Jangan lupa set environment variables di hosting platform:

### Netlify
```bash
netlify env:set VITE_SUPABASE_URL "https://xphyjtwzwdrsxkpojwxa.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "your-anon-key"
```

### Vercel
Di dashboard Vercel:
1. Settings → Environment Variables
2. Add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

---

## 📊 Monitoring & Analytics

### Add Google Analytics (Optional)
1. Buat tracking ID di Google Analytics
2. Install package:
```bash
npm install react-ga4
```

3. Setup di `src/main.tsx`:
```typescript
import ReactGA from 'react-ga4';

ReactGA.initialize('G-XXXXXXXXXX');
```

---

## ⚡ Performance Optimization

### Enable Gzip Compression
**Netlify:** Otomatis enabled
**Vercel:** Otomatis enabled
**Custom Server:** Configure di Nginx/Apache

### Enable CDN
Netlify dan Vercel sudah menggunakan CDN global secara otomatis.

### Image Optimization
Pastikan semua gambar sudah di-optimize sebelum upload:
```bash
npm install -D imagemin imagemin-webp
```

---

## 🔄 Continuous Deployment (CD)

### Setup Auto-Deploy dari GitHub

**Netlify:**
1. Connect repository GitHub
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Setiap push ke `main` otomatis deploy

**Vercel:**
1. Import dari GitHub
2. Vercel auto-detect settings
3. Push ke `main` = auto deploy

---

## ✅ Checklist Deployment

- [ ] Build aplikasi berhasil (`npm run build`)
- [ ] Test di local (`npm run preview`)
- [ ] Environment variables sudah diset
- [ ] Custom domain sudah dikonfigurasi (optional)
- [ ] SSL certificate aktif (HTTPS)
- [ ] Analytics tracking aktif (optional)
- [ ] Error monitoring setup (Sentry, optional)
- [ ] Test semua fitur di production URL

---

## 🎯 Quick Deployment Commands

### Netlify (One-liner)
```bash
npm run build && netlify deploy --prod
```

### Vercel (One-liner)
```bash
vercel --prod
```

### GitHub Pages
```bash
npm run deploy
```

---

## 🆘 Troubleshooting

### Error: "Page Not Found" saat refresh
**Solusi:** Configure server untuk SPA routing (lihat section Manual Build)

### Error: Environment variables tidak terbaca
**Solusi:** Pastikan variable dimulai dengan `VITE_` dan sudah rebuild setelah set

### Error: Build gagal
**Solusi:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Assets tidak loading
**Solusi:** Check base URL di `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/', // atau '/edufin/' jika subdirectory
})
```

---

## 📞 Support

Jika mengalami masalah deployment:
1. Check build logs di platform hosting
2. Test local dulu dengan `npm run preview`
3. Pastikan semua dependencies ter-install
4. Check browser console untuk error

---

## 🎉 Setelah Deploy

Setelah berhasil deploy, Anda akan punya:

✅ URL bersih tanpa `/make/`
✅ HTTPS otomatis (SSL)
✅ CDN global untuk performa cepat
✅ Auto-deploy saat push code
✅ Custom domain (optional)

**Contoh URL Production:**
- https://edufin.netlify.app
- https://edufin.vercel.app
- https://edufin.sdnmalang.sch.id (custom domain)

---

**Update Terakhir:** 9 April 2026
**Platform:** EDUFIN
**Target Deployment:** Production-ready
