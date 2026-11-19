# KasirKu — Frontend

Frontend POS sederhana (single user) untuk KasirKu, dibangun dengan
Vite + React 19 + TypeScript.

Backend: [express-ts-app](https://github.com/squadl-lew/express-ts-app)
(API Product sudah jadi; Sale, Restok, Expense, Report masih dummy dulu).

Rencana lengkap ada di [PLANNING.md](./PLANNING.md).

## Stack

- Vite + React 19 + TypeScript (`strict`)
- react-router, @tanstack/react-query, axios
- react-hook-form + zod + @hookform/resolvers
- Tailwind via CDN, font Poppins, Font Awesome

## Menjalankan

```bash
cp .env.example .env   # sesuaikan VITE_API_PATH dengan BE lokal
npm install
npm run dev            # http://localhost:5173
npm run build          # tsc + vite build
```

## Struktur

Lihat [PLANNING.md](./PLANNING.md) bagian "Struktur folder (v4)".
