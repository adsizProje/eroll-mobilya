# Eroll Mobilya & Koltuk - Web Sitesi

Eroll Mobilya & Koltuk için Astro SSG ile oluşturulmuş web sitesi ve Strapi CMS ile içerik yönetimi.

## 🌐 Canlı Linkler

| Servis                | URL                                                       |
| --------------------- | --------------------------------------------------------- |
| **Website**           | https://eroll-mobilya.netlify.app/                        |
| **CMS Admin Panel**   | https://eroll-mobilya-cms-production.up.railway.app/admin |
| **Netlify Dashboard** | https://app.netlify.com/projects/eroll-mobilya/overview   |

## 📁 Proje Yapısı

Bu proje iki ayrı repository'den oluşmaktadır:

### Frontend (Bu Repo)

🔗 https://github.com/adsizProje/eroll-mobilya

```
erol-mobilya/
├── web/                 # Astro Frontend (SSG)
│   ├── src/
│   │   ├── components/  # Header, Footer
│   │   ├── layouts/     # BaseLayout
│   │   ├── lib/         # API client (Strapi entegrasyonu)
│   │   ├── pages/       # Site sayfaları
│   │   └── styles/      # Tailwind 4 + tema
│   ├── public/          # Logo, favicon
│   └── netlify.toml     # Netlify yapılandırması
├── logo/                # Orijinal logo dosyaları
└── site.txt             # Site içerik referansı
```

### CMS (Ayrı Repo)

🔗 https://github.com/adsizProje/eroll-mobilya-cms

```
eroll-mobilya-cms/
├── config/              # Strapi yapılandırması
├── src/api/             # Content-type tanımları
│   └── oturma-grubu/    # Oturma grupları koleksiyonu
└── public/uploads/      # Yüklenen medya dosyaları
```

## 🚀 Hosting

| Servis   | Platform    | Açıklama               |
| -------- | ----------- | ---------------------- |
| Frontend | **Netlify** | Astro SSG static build |
| CMS      | **Railway** | Strapi + PostgreSQL    |

## 🛠️ Local Geliştirme

### Frontend

```bash
cd web
npm install
npm run dev
```

→ http://localhost:4321

### CMS (ayrı repo'dan)

```bash
cd ../eroll-mobilya-cms  # veya cms klasörünüz neredeyse
npm install
npm run develop
```

→ http://localhost:1337/admin

## 🔐 Environment Variables

### Netlify (Frontend)

| Variable            | Değer                                                 |
| ------------------- | ----------------------------------------------------- |
| `STRAPI_URL`        | `https://eroll-mobilya-cms-production.up.railway.app` |
| `STRAPI_READ_TOKEN` | Strapi API Token                                      |

### Railway (CMS)

| Variable              | Değer                      |
| --------------------- | -------------------------- |
| `DATABASE_CLIENT`     | `postgres`                 |
| `DATABASE_HOST`       | `${{Postgres.PGHOST}}`     |
| `DATABASE_PORT`       | `${{Postgres.PGPORT}}`     |
| `DATABASE_NAME`       | `${{Postgres.PGDATABASE}}` |
| `DATABASE_USERNAME`   | `${{Postgres.PGUSER}}`     |
| `DATABASE_PASSWORD`   | `${{Postgres.PGPASSWORD}}` |
| `APP_KEYS`            | Rastgele key'ler           |
| `ADMIN_JWT_SECRET`    | Rastgele secret            |
| `JWT_SECRET`          | Rastgele secret            |
| `API_TOKEN_SALT`      | Rastgele salt              |
| `TRANSFER_TOKEN_SALT` | Rastgele salt              |
| `ENCRYPTION_KEY`      | Rastgele key               |
| `NETLIFY_BUILD_HOOK`  | Netlify hook URL           |

## 📝 İçerik Yönetimi

1. **CMS Admin Panel**'e git: https://eroll-mobilya-cms-production.up.railway.app/admin
2. **Content Manager** → **Oturma Grubu** → **Create new entry**
3. Alanları doldur:
   - **Title**: Ürün adı
   - **Slug**: Otomatik oluşur
   - **Summary**: Kısa açıklama
   - **Body Rich**: Detaylı açıklama (WYSIWYG)
   - **Hero Image**: Ana görsel
   - **Gallery**: Galeri görselleri
   - **Dimensions** / **Materials**: Özellikler
   - **Order**: Menü sıralaması
4. **Publish** → Netlify otomatik rebuild tetiklenir

## 🎨 Teknolojiler

- **Frontend:** Astro 5, Tailwind CSS 4, Motion
- **CMS:** Strapi 5
- **Database:** PostgreSQL (Railway)
- **Hosting:** Netlify (Frontend) + Railway (CMS)

## 🎨 Renk Paleti

| Renk       | Hex                             | Kullanım           |
| ---------- | ------------------------------- | ------------------ |
| Accent     | `#B19877`                       | Butonlar, vurgular |
| Black      | `#0a0908`                       | Metin, footer      |
| Background | `#fefae0`                       | Sayfa arka planı   |
| Muted      | `#cbb79a`, `#d9c8ad`, `#e8dcc5` | Alt tonlar         |

## 📞 İletişim

- **Telefon:** 0530 122 76 23
- **Adres:** Karşıyaka mahallesi 3001 sokak No:46, Merkez Elazığ, 23050
- **Instagram:** [@erollmobilya](https://instagram.com/erollmobilya)
- **Facebook:** [/agahmob](https://facebook.com/agahmob)
