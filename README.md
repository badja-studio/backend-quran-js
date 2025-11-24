# Backend Quran JS

Backend API untuk sistem manajemen Quran menggunakan Express.js, PostgreSQL, dan Sequelize dengan arsitektur berlayer (Controller, UseCase, Repository).

## 🚀 Fitur

- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Sequelize** - ORM
- **Swagger** - API Documentation
- **Docker** - Containerization
- **Layered Architecture** - Controller → UseCase → Repository

## 📁 Struktur Folder

```
backend-quran-js/
├── cmd/
│   └── web/
│       └── main.js          # Entry point aplikasi
├── config/
│   ├── config.js            # Konfigurasi utama
│   ├── database.js          # Koneksi database
│   └── swagger.js           # Konfigurasi Swagger
├── internal/
│   ├── controller/          # HTTP handlers
│   │   └── surah.controller.js
│   ├── usecase/            # Business logic
│   │   └── surah.usecase.js
│   ├── repository/         # Database operations
│   │   └── surah.repository.js
│   ├── models/             # Database models
│   │   └── surah.model.js
│   └── routes/             # Route definitions
│       ├── index.js
│       └── surah.routes.js
├── .env                    # Environment variables
├── .env.example            # Template environment
├── .env.production.example # Template untuk production
├── docker-compose.dev.yml  # Docker compose untuk development (dengan PostgreSQL)
├── docker-compose.prod.yml # Docker compose untuk production (tanpa PostgreSQL)
├── Dockerfile              # Production dockerfile
├── Dockerfile.dev          # Development dockerfile
└── package.json
```

## 🏗️ Arsitektur Layer

### 1. **Controller Layer**
- Menangani HTTP request/response
- Validasi input dasar
- Memanggil UseCase layer

### 2. **UseCase Layer**
- Berisi semua business logic
- Validasi business rules
- Koordinasi antar repository
- Return hasil dalam format standar

### 3. **Repository Layer**
- Interaksi langsung dengan database
- CRUD operations
- Query optimization

## 🐳 Docker Setup

### Development (dengan PostgreSQL)
```bash
# Jalankan dengan PostgreSQL included
docker-compose -f docker-compose.dev.yml up

# Stop services
docker-compose -f docker-compose.dev.yml down

# Rebuild containers
docker-compose -f docker-compose.dev.yml up --build
```

Development environment sudah include:
- PostgreSQL container
- Hot reload dengan nodemon
- Volume mounting untuk development

### Production (database eksternal)
```bash
# Setup environment variables
cp .env.production.example .env.production
# Edit .env.production dengan credentials database Anda

# Jalankan dengan environment file
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d

# Stop services
docker-compose -f docker-compose.prod.yml down
```

Production environment:
- Menggunakan database eksternal (by environment variables)
- Optimized image size
- Production dependencies only

## 📦 Installation (Tanpa Docker)

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env sesuai kebutuhan

# Run development
npm run dev

# Run production
npm start
```

## 🌐 API Endpoints

### Health Check
- `GET /api/health` - Cek status service

### Surahs
- `GET /api/v1/surahs` - Get all surahs
- `GET /api/v1/surahs/:id` - Get surah by ID
- `GET /api/v1/surahs/number/:number` - Get surah by number (1-114)
- `POST /api/v1/surahs` - Create new surah
- `PUT /api/v1/surahs/:id` - Update surah
- `DELETE /api/v1/surahs/:id` - Delete surah

## 📚 API Documentation

Setelah aplikasi berjalan, akses dokumentasi Swagger di:
- Development: `http://localhost:3000/api-docs`
- Swagger JSON: `http://localhost:3000/api-docs.json`

## 🔧 Environment Variables

### Development (.env)
```env
NODE_ENV=development
PORT=3000
DB_HOST=postgres          # nama service di docker-compose
DB_PORT=5432
DB_NAME=quran_db
DB_USER=quran_user
DB_PASSWORD=quran_password
```

### Production (.env.production)
```env
NODE_ENV=production
PORT=3000
DB_HOST=your-db-host.com  # external database
DB_PORT=5432
DB_NAME=quran_db
DB_USER=quran_user
DB_PASSWORD=your-secure-password
```

## 🎯 Cara Menambah Fitur Baru

1. **Buat Model** di `internal/models/`
2. **Buat Repository** di `internal/repository/`
3. **Buat UseCase** di `internal/usecase/` (semua logic di sini)
4. **Buat Controller** di `internal/controller/`
5. **Tambah Routes** di `internal/routes/`
6. **Update Swagger docs** di controller dengan JSDoc

## 🔄 Menambah Worker

Untuk menambah worker atau background job:

```bash
# Buat file baru
cmd/worker/main.js

# Import config yang sama
const config = require('../../config/config');
```

Struktur sudah mendukung multiple entry points di folder `cmd/`.

## 🛠️ Tech Stack

- **Node.js** v18+
- **Express.js** v4.18+
- **PostgreSQL** 15+
- **Sequelize** v6.35+
- **Swagger** (swagger-jsdoc, swagger-ui-express)
- **Docker** & Docker Compose

## 📝 Notes

- Database sync dilakukan otomatis di development mode
- Production menggunakan migrations (setup via sequelize-cli)
- Semua business logic harus di UseCase layer
- Repository hanya untuk database operations
- Controller hanya untuk HTTP handling

## 🤝 Contributing

1. Create feature branch
2. Commit changes
3. Push to branch
4. Create Pull Request

## 📄 License

MIT

---

**Dibuat dengan ❤️ untuk Backend Quran API**