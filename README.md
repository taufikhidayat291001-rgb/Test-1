# KelasKita

Aplikasi pengelolaan kursus full-stack dengan Django REST Framework, React, dan SQLite.

## Menjalankan backend

```powershell
cd backend
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py seed_courses   # opsional
python manage.py runserver
```

API berjalan di `http://127.0.0.1:8000`.

Buat file `backend/.env` dengan key berikut sebelum menjalankan server:

```env
OPENWEATHER_API_KEY=your_openweathermap_key
```

## Menjalankan frontend

Buka terminal kedua:

```powershell
cd frontend
npm install
npm run dev
```

Buka `http://localhost:5173`.

## Endpoint API

| Method | URL | Kegunaan |
|---|---|---|
| GET | `/api/courses/` | Daftar semua kursus |
| POST | `/api/courses/` | Membuat kursus |
| GET | `/api/courses/<id>/` | Detail satu kursus |
| PUT | `/api/courses/<id>/` | Mengganti seluruh data kursus |
| PATCH | `/api/courses/<id>/` | Mengubah sebagian data kursus |
| DELETE | `/api/courses/<id>/` | Menghapus kursus |
| GET | `/api/weather/?city=Jakarta` | Mengambil cuaca kota dari OpenWeather |

Contoh body `POST`, `PUT`, atau `PATCH`:

```json
{
  "title": "Kursus React Modern",
  "description": "Belajar membangun UI React.",
  "instructor": "Budi Santoso",
  "level": "Pemula",
  "duration": 8,
  "price": 199000,
  "is_published": true
}
```

SQLite tersimpan di `backend/db.sqlite3`. Admin Django tersedia di `/admin/` setelah membuat superuser dengan `python manage.py createsuperuser`.

## Deployment ke Railway

Buat dua service dari repository GitHub ini:

1. **Backend**: gunakan Root Directory `/backend`, tambahkan PostgreSQL, lalu set `SECRET_KEY`, `DEBUG=False`, `ALLOWED_HOSTS=<domain-backend>.up.railway.app`, `CORS_ALLOWED_ORIGINS=https://<domain-frontend>.up.railway.app`, dan `OPENWEATHER_API_KEY`.
2. **Frontend**: gunakan Root Directory `/frontend`, set `VITE_API_URL=https://<domain-backend>.up.railway.app/api`, lalu generate domain publik.

Railway membaca `backend/Procfile`; migrasi berjalan otomatis saat deploy dan database memakai `DATABASE_URL` dari PostgreSQL.
