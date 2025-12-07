# Erol Mobilya & Koltuk - Web Sitesi

Erol Mobilya & Koltuk için Astro SSG ile oluşturulmuş web sitesi ve Strapi CMS ile içerik yönetimi.

## Proje Yapısı

```
erol-mobilya/
├── cms/                 # Strapi CMS (Admin Panel)
│   └── src/api/         # Content-type tanımları
├── web/                 # Astro Frontend (SSG)
│   ├── src/
│   │   ├── components/  # Astro bileşenleri
│   │   ├── layouts/     # Sayfa şablonları
│   │   ├── lib/         # API ve yardımcı fonksiyonlar
│   │   ├── pages/       # Site sayfaları
│   │   └── styles/      # Global stiller
│   └── public/          # Statik dosyalar
└── logo/                # Logo dosyaları
```

## Kurulum

### 1. Strapi CMS (Admin Panel)

```bash
cd cms
npm install
npm run develop
```

İlk çalıştırmada admin kullanıcısı oluşturmanız istenecek.

**Admin URL:** http://localhost:1337/admin

### 2. Astro Frontend

```bash
cd web
npm install
npm run dev
```

**Site URL:** http://localhost:4321

## Environment Variables

### Strapi (`cms/.env`)

```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=your-app-keys
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret

# Netlify Build Hook (içerik güncellendiğinde tetiklenecek)
NETLIFY_BUILD_HOOK=https://api.netlify.com/build_hooks/YOUR_HOOK_ID
```

### Astro Frontend (`web/.env`)

```env
STRAPI_URL=http://localhost:1337
STRAPI_READ_TOKEN=your-strapi-api-token
```

## Strapi API Token Oluşturma

1. Strapi admin paneline girin
2. Settings > API Tokens > Create new API Token
3. Token type: Read-only
4. Permissions: `oturma-grubu` koleksiyonu için `find` ve `findOne`
5. Token'ı kopyalayın ve `web/.env` dosyasına ekleyin

## Netlify Dağıtımı

### 1. Build Hook Oluşturma

1. Netlify Dashboard > Site settings > Build & deploy > Build hooks
2. "Add build hook" tıklayın
3. İsim verin (örn: "Strapi Content Update")
4. Hook URL'sini kopyalayın
5. Strapi `.env` dosyasına `NETLIFY_BUILD_HOOK` olarak ekleyin

### 2. Environment Variables (Netlify)

Netlify Dashboard > Site settings > Environment variables:

- `STRAPI_URL`: Strapi sunucu URL'si (örn: https://cms.erollmobilya.com)
- `STRAPI_READ_TOKEN`: Strapi API token

### 3. Build Ayarları

Netlify otomatik olarak `netlify.toml` dosyasını okuyacak:

- Build command: `npm run build`
- Publish directory: `dist`

## İçerik Yönetimi

### Oturma Grubu Ekleme

1. Strapi admin paneline girin
2. Content Manager > Oturma Grubu > Create new entry
3. Gerekli alanları doldurun:
   - **Title**: Ürün adı
   - **Slug**: URL için otomatik oluşturulur
   - **Menu Label**: Menüde görünecek isim (opsiyonel)
   - **Summary**: Kısa açıklama
   - **Body Rich**: Detaylı açıklama (WYSIWYG)
   - **Dimensions**: Boyutlar
   - **Materials**: Malzemeler
   - **Order**: Sıralama numarası
   - **Hero Image**: Ana görsel
   - **Gallery**: Galeri görselleri
4. Publish butonuna tıklayın

İçerik kaydedildiğinde otomatik olarak Netlify build tetiklenecek.

## Geliştirme

### Astro Komutları

```bash
npm run dev      # Geliştirme sunucusu
npm run build    # Production build
npm run preview  # Build önizleme
```

### Strapi Komutları

```bash
npm run develop  # Geliştirme sunucusu
npm run start    # Production sunucusu
npm run build    # Admin panel build
```

## Teknolojiler

- **Frontend:** Astro 5, Tailwind CSS 4, Motion
- **CMS:** Strapi 5
- **Hosting:** Netlify (Frontend), Self-hosted/Cloud (Strapi)

## Renk Paleti

- Ana Renk (Accent): `#B19877`
- Siyah: `#0a0908`
- Beyaz (Background): `#fefae0`
- Muted Tonlar: `#cbb79a`, `#d9c8ad`, `#e8dcc5`

## İletişim

- **Telefon:** 0532 771 32 24
- **Adres:** Karşıyaka mahallesi 3001 sokak No:46, Merkez Elazığ, 23050
- **Instagram:** [@erollmobilya](https://instagram.com/erollmobilya)
- **Facebook:** [/agahmob](https://facebook.com/agahmob)

