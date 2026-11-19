# Rencana FE React — KasirKu (v4, DISETUJUI 2026-11-19)

> Status: **disetujui Maru 2026-11-19** ("overall saya setujui semua").
> Revisi v4 mengikuti pola hook + service yang ditentukan Maru (TanStack Query, useProduct.tsx).
> Kalau disetujui, file ini pindah ke repo FE baru sebagai `PLANNING.md` / `README.md`.

## Dasar yang sudah disepakati

- Prototype KasirKu (artifact `prototype-pos`) sudah disetujui — itu jadi patokan tampilan FE.
- Figma tidak dipakai lagi, kecuali Maru minta.
- FE pakai **data dummy dulu** untuk API yang belum ready (Sale, Restok, Expense, Report);
  API **Product pakai API beneran**. Nanti dummy diganti API beneran satu-satu, tanpa ubah tampilan.
- Kerja satu fitur satu tahap, seperti BE kemarin: tunjukkan rencananya dulu, baru coding
  kalau Maru bilang mulai. Maru pull ke laptop untuk ngetes per batch.
- Repo FE baru — dibuat Maru (nama repo masih ditunggu).

## Stack

- Vite + React 19 + **TypeScript (`.ts` / `.tsx`, `strict: true`)**
- `react-router` v7, `react-use`, `sweetalert2`
- **`axios`** untuk HTTP — satu instance terpusat di `src/libs/axios/instance.ts`
- **`@tanstack/react-query`** untuk ambil data (`useQuery`) dan ubah data (`useMutation`)
- **`react-hook-form` + `zod` + `@hookform/resolvers`** untuk semua form
- Tailwind lewat CDN di `index.html` (ikut PZN), font Poppins, ikon Font Awesome
- Env: `VITE_API_PATH=http://localhost:3000/api`
- Tanpa auth/token (single user, tidak ada halaman login).

> Catatan: repo referensi PZN (`belajar-reactjs-contact-management`) pakai JavaScript
> (`.jsx`) dan `fetch` polos. Yang diambil dari PZN hanya polanya (route nested,
> layout + `<Outlet/>`, komponen per domain, alert SweetAlert2).
> Penulisan kodenya mengikuti best practice TypeScript di bawah.

## Aturan utama: logic dan UI dipisah

Prinsipnya: **komponen hanya render, hook yang pegang logic.**

- `Product.tsx` — hanya JSX + styling + memanggil hook dan komponen pecahan.
  Dilarang: `axios`/`fetch` langsung, `useEffect` untuk ambil data, logic hitung-hitungan.
- `useProduct.tsx` (custom hook, satu per fitur, **file `.tsx`**) — semua logic fitur
  itu: ambil data pakai `useQuery`, ubah data pakai `useMutation`, form pakai
  `useForm` (react-hook-form), state `toaster`, search + pagination.
  Hook mengembalikan data + fungsi yang siap dipakai komponen.
- Satu komponen maksimal ~250 baris; kalau sudah gemuk, pecah jadi komponen anak
  atau pindahkan logic ke hook.

Alur data (4 lapis):

```
Komponen view (.tsx)
  → custom hook (useProduct.tsx)      # useQuery/useMutation/useForm + toaster
    → service (product.service.ts)    # fungsi typed, satu per endpoint
      → axios instance (instance.ts)  # baseURL, header, error handling terpusat
```

## Custom hook — pola TanStack Query (sesuai contoh Maru)

Semua ambil data pakai `useQuery`, semua ubah data pakai `useMutation`.
Tidak ada `useEffect` + `axios` manual di hook. Contoh pola untuk Product
(diadaptasi dari contoh `useQuery`/`useMutation` Maru):

```tsx
// src/components/views/Product/useProduct.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productServices } from "../../../../service/product.service";
import { productSchema } from "../../../lib/validation/productSchema";

export function useProduct() {
  const queryClient = useQueryClient();

  // Ambil data — contoh: list produk (search + paging dari state lokal hook)
  const getProducts = async () => {
    const { data } = await productServices.getProducts({ name, category, page, size });
    return data; // { data: Product[]; paging: Paging }
  };

  const {
    data: products,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
  } = useQuery({
    queryKey: ["products", name, category, page],
    queryFn: () => getProducts(),
    enabled: true, // atau kondisi lain, misal id sudah ada (detail page)
  });

  // Ubah data — contoh: update produk
  const { mutate: mutateUpdateProduct } = useMutation({
    mutationFn: (payload: IUpdateProduct) =>
      productServices.updateProduct(payload.id, payload),
    onError(error) {
      setToaster({ type: "error", message: error.message });
    },
    onSuccess: () => {
      setToaster({ type: "success", message: "Produk berhasil diubah" });
      queryClient.invalidateQueries({ queryKey: ["products"] }); // refresh list
    },
  });

  // Form — react-hook-form bermain di hook ini
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: "", category: "", buyPrice: 0, sellPrice: 0 },
    mode: "onBlur",
  });

  return { products, isLoadingProducts, isErrorProducts, mutateUpdateProduct, form, toaster };
}
```

Aturan hook:

- `queryKey` selalu berisi nama fitur + parameter yang memengaruhi data
  (contoh: `["products", name, category, page]`) supaya cache dan refresh-nya benar.
- `enabled` dipakai untuk query yang butuh syarat dulu (misal detail produk:
  `enabled: !!id`).
- `onSuccess` mutation: tampilkan toaster sukses + `invalidateQueries` supaya
  list/detail yang tampil ikut ke-refresh. `onError`: toaster error dari
  `error.message` (error BE `{ errors }` sudah diseragamkan di interceptor axios).
- Toaster: state `toaster` di hook (`{ type: "success" | "error", message }`),
  dirender oleh komponen `Toaster` di `components/ui/`.
- `QueryClientProvider` dipasang sekali di `main.tsx` membungkus aplikasi.
- **Dummy hook:** untuk API yang belum ready (Sale, Restok, Expense, Report),
  hook-nya dibuat dengan pola yang **sama persis** (`useQuery`/`useMutation` +
  `useForm` + toaster), hanya service yang dipanggil adalah service dummy
  (return data dummy, bentuk sama dengan real). Jadi saat BE-nya jadi, hook
  tidak berubah — yang diganti hanya isi service-nya.

## Service layer

Satu file per domain, bentuknya **satu object** seperti contoh Maru:

```ts
// service/product.service.ts
import instance from "../src/libs/axios/instance";
import { endpoint } from "./endpoints";

const productServices = {
  getProducts: (params: ProductSearchParams) =>
    instance.get<PagedResponse<Product>>(endpoint.PRODUCT, { params }),
  getProduct: (id: number) =>
    instance.get<ApiResponse<Product>>(`${endpoint.PRODUCT}/${id}`),
  createProduct: (payload: ICreateProduct) =>
    instance.post<ApiResponse<Product>>(endpoint.PRODUCT, payload),
  updateProduct: (id: number, payload: IUpdateProduct) =>
    instance.put<ApiResponse<Product>>(`${endpoint.PRODUCT}/${id}`, payload),
  deleteProduct: (id: number) =>
    instance.delete<ApiResponse<Product>>(`${endpoint.PRODUCT}/${id}`),
};

export { productServices };
```

Aturan service:

- Service hanya panggil `instance` + `endpoint`, tanpa logic UI dan tanpa state.
- Semua method ber-type: parameter dan return-nya memakai type dari `types/`.
- **Dummy dulu:** service Sale/Restok/Expense/Report versi dummy mengimplementasikan
  object yang sama persis (nama method + return type sama), datanya dari
  `src/lib/dummy/`. Ganti dummy → real tinggal ganti isi file service-nya;
  hook dan komponen tidak berubah.

## Endpoint object

Object `endpoint` ditampung di **`service/endpoints.ts`** — satu file dengan
semua service, karena hanya service yang memakainya:

```ts
// service/endpoints.ts
export const endpoint = {
  PRODUCT: "/api/products",
  SALE: "/api/sales",
  RESTOCK: "/api/restocks",
  EXPENSE: "/api/expenses",
  REPORT: "/api/reports",
} as const;
```

> Perhatian — contoh Maru (`PRODUCT: "/api/product"`, `PATCH .../update-product`)
> itu contoh bentuknya saja. Path beneran mengikuti BE yang sudah jadi:
> `/api/products` (jamak) dengan `PUT /api/products/:id` untuk update, sesuai
> `doc/product.md`. Jadi `endpoint.PRODUCT = "/api/products"` dan update pakai
> `PUT`, bukan `PATCH .../update-product`, kecuali nanti diputuskan lain.

## Type — ditentukan dulu sebelum coding

Type adalah kontraknya; semua lapisan di atas memakai type yang sama.

- **Domain type** — di `types/*.d.ts`, satu file per domain:
  `Product.d.ts` berisi `interface Product`, `ICreateProduct`, `IUpdateProduct`,
  `ProductSearchParams`; `api.d.ts` berisi type umum:
  `ApiResponse<T> = { data: T }`, `ApiErrorResponse = { errors: string }`,
  `Paging = { current_page, total_page, size }`,
  `PagedResponse<T> = { data: T[]; paging: Paging }`.
  Type ini mengikuti `doc/product.md` (final) dan `doc/sale.md` / `doc/expense.md` /
  `doc/report.md` (DRAFT) — kalau DRAFT berubah, type-nya ikut berubah.
- **Form type dari Zod, bukan ditulis manual** — schema validasi di
  `src/lib/validation/productSchema.ts` (misal `z.object({ name: z.string().min(1),
  buyPrice: z.coerce.number().int().min(0), ... })`), lalu tipenya diambil dari schema:
  `type ProductFormValues = z.infer<typeof productSchema>`.
  Satu sumber kebenaran: aturan validasi, tipe data, dan pesan error berasal
  dari schema yang sama. Perhatian: input HTML selalu string, jadi angka pakai
  `z.coerce.number()`; kalau schema pakai transform, pakai
  `useForm<z.input<typeof S>, unknown, z.output<typeof S>>`.
  Schema Zod tinggal di `src/lib/validation/` (butuh runtime), sedangkan
  `types/*.d.ts` hanya berisi interface/type murni — keduanya tidak dicampur.
- **Larangan:** `any` dilarang (pakai `unknown` + narrowing kalau memang belum
  jelas tipenya); `as` casting dihindari — kalau perlu casting, berarti type-nya
  yang salah dan harus dibetulkan; response axios selalu diberi generic,
  misal `instance.get<ApiResponse<Product[]>>("/api/products")`.
- `tsconfig` ketat: `strict: true`, `noUnusedLocals`, `noUnusedParameters`.
  `npm run build` harus lolos `tsc` dulu baru `vite build` (script:
  `"build": "tsc -b && vite build"`, seperti template resmi Vite + React + TS).

## Axios instance

`src/libs/axios/instance.ts` — satu-satunya tempat `axios.create`:

```ts
import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_PATH,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});
// interceptor response: error BE { errors } dilempar sebagai Error yang sama
// bentuknya untuk semua fitur, jadi hook tidak perlu parsing error per endpoint.
export default instance;
```

## React Hook Form — semua form pakai ini, dan bermain di hook

- Form dibuat **di dalam `useX.tsx`** dengan
  `useForm<ProductFormValues>({ resolver: zodResolver(productSchema),
  defaultValues: {...}, mode: "onBlur" })` — `mode: "onBlur"` supaya error muncul
  saat field ditinggalkan, bukan tiap ketik.
- `register` tanpa aturan validasi inline — semua aturan ada di schema Zod.
  Error tampil dari `formState.errors` (tipenya sudah mengikuti schema).
- Input khusus (misal picker produk yang bisa dicari di Restok, input tanggal)
  pakai `Controller`. Error dari server (misal validasi BE gagal) dipetakan dengan
  `setError` per field.
- `<form noValidate>` supaya validasi bawaan browser tidak menahan submit sebelum
  schema Zod berjalan.
- Komponen hanya menerima `form` (atau `register`, `errors`, `handleSubmit`,
  `isSubmitting`) dari hook — tidak ada `useForm` di komponen.

## Struktur folder (v4)

```
kasirku-fe/
  service/                    # SEJAJAR src — layer service
    endpoints.ts              # object endpoint (lihat atas)
    product.service.ts        # const productServices = { ... }; export { productServices }
    sale.service.ts           # DUMMY dulu
    restock.service.ts        # DUMMY dulu
    expense.service.ts        # DUMMY dulu
    report.service.ts         # DUMMY dulu
  types/                      # SEJAJAR src — type domain, file .d.ts
    Product.d.ts              # interface Product, ICreateProduct, IUpdateProduct, ...
    Sale.d.ts
    Restock.d.ts
    Expense.d.ts
    Report.d.ts
    api.d.ts                  # ApiResponse<T>, ApiErrorResponse, Paging, PagedResponse<T>
  utils/                      # SEJAJAR src — fungsi utilitas, hanya kalau dibutuhkan
    format.ts                 # formatCurrency (Rp), formatDate
  src/
    main.tsx                  # QueryClientProvider + route nested, DashboardLayout + Outlet
    libs/
      axios/
        instance.ts           # axios instance (baseURL VITE_API_PATH, interceptor error)
    lib/
      alert.ts                # alertSuccess / alertError / alertConfirm (sweetalert2)
      validation/
        productSchema.ts      # zod schema + type form (z.infer)
      dummy/                  # data dummy typed (bentuk sama dgn real)
    components/
      layout/                 # DashboardLayout.tsx, Sidebar.tsx, TopBar.tsx
      ui/                     # dipakai ulang di mana-mana:
                              # Button, Card, DataTable, Pagination, Modal, Toaster, Input
      views/                  # HASIL RENDER per fitur — hanya 2 file per fitur:
        Product/
          Product.tsx         # render utama Product (gabungkan pecahan di bawah)
          useProduct.tsx      # logic fitur Product (useQuery/useMutation/useForm)
        Sale/
          Kasir.tsx
          useSale.tsx         # DUMMY hook (pola sama, service dummy)
        Restock/
          Restock.tsx
          useRestock.tsx      # DUMMY hook
        Expense/
          Expense.tsx
          useExpense.tsx      # DUMMY hook
        Report/
          Report.tsx
          useReport.tsx       # DUMMY hook
        Dashboard/
          Dashboard.tsx
          useDashboard.tsx    # DUMMY hook
      product/                # PECAHAN UI Product (dipakai Product.tsx):
        ProductTable.tsx      # tabel + pagination
        ProductForm.tsx       # form create/edit (pakai form dari hook)
        ProductDetail.tsx     # modal/detail
      sale/                   # pecahan UI Kasir: CartPanel.tsx, PaymentModal.tsx, ReceiptModal.tsx
      restock/                # pecahan UI Restok: RestockForm.tsx, RestockItemRow.tsx
      expense/                # pecahan UI Pengeluaran: ExpenseTable.tsx, ExpenseForm.tsx
      report/                 # pecahan UI Laporan: ReportRangePicker.tsx
      dashboard/              # pecahan UI Dashboard: StatCard.tsx, ActivityFeed.tsx
```

### Aturan penempatan

- **`views/` hanya 2 file per fitur** — `X.tsx` (render) + `useX.tsx` (logic).
  Boleh dipecah, tapi pecahannya **tetap digabungkan di dalam `X.tsx`**.
- **Pecahan list/form** ditaruh di `src/components/<fitur>/` (contoh:
  `src/components/product/ProductTable.tsx`, `ProductForm.tsx`) — jadi `views/`
  tetap bersih 2 file, dan pecahannya tetap dekat dengan fiturnya.
- **`components/layout/`** — layout yang dipakai semua halaman: `DashboardLayout`,
  `Sidebar`, `TopBar` (termasuk toggle dark/light + sidebar bisa buka-tutup).
- **`components/ui/`** — komponen kecil yang dipakai terus-menerus di banyak fitur:
  `Button`, `Card`, `DataTable`, `Pagination`, `Modal`, `Toaster`, `Input`.
- **`service/` (sejajar `src`)** — satu file per domain, bentuk `const xServices = {...}`.
- **`types/` (sejajar `src`)** — type domain per file `.d.ts`.
- **`utils/` (sejajar `src`)** — fungsi utilitas (tanggal, currency); dibuat hanya
  kalau dibutuhkan, bukan di depan.

### Catatan setup (akibat folder sejajar `src`)

Template Vite + React + TS bawaan hanya meng-include `src` di `tsconfig`.
Karena `service/`, `types/`, `utils/` sejajar `src`, `tsconfig.app.json` harus
diubah `include`-nya jadi `["src", "service", "types", "utils"]` supaya
TypeScript ikut memeriksa file-file itu. Import dari komponen memakai path
relatif (`../../../service/product.service`) atau alias `@/` kalau disetujui —
default: path relatif dulu, alias menyusul kalau Maru setuju.

## Route & menu (urutan sesuai prototype yang disetujui)

| Route | Menu | Isi |
|---|---|---|
| `/` | Dashboard | 3 kartu: Penjualan hari ini, Pengeluaran bulan ini, Stok menipis; grafik 7 hari; Aktivitas |
| `/kasir` | Kasir | Hanya produk stok > 0; keranjang; modal bayar; struk, tombol **Selesai** saja |
| `/produk` | Produk | Cari/filter, Tambah (tanpa field stok — produk baru stok 0), Edit, Hapus |
| `/restok` | Restok | Picker produk bisa dicari (ketik nama); multi-item; **Total Belanja** |
| `/pengeluaran` | Pengeluaran | List, form label **Harga**, tombol **Lihat rincian** (modal) |
| `/laporan` | Laporan | Tab Hari Ini / Semua / **Pilih Rentang** (tanggal, bulan, atau tahun); **Total bersih** |

## Pemetaan API: mana real, mana dummy

Bentuk return disamakan persis dengan API beneran (`{data}` / `{errors}`, `paging`),
supaya ganti dummy → real tinggal ganti isi fungsi di service.

| Domain | Status | Endpoint (rencana) | Catatan |
|---|---|---|---|
| Product | **REAL** | `POST/GET/PUT/DELETE /api/products`, `GET /api/products?name&category&page&size` | Sudah jadi di BE (PR #5, main). Create: `stock` opsional — FE tidak kirim stok. Update: `stock` wajib. Hook `useProduct.tsx` bisa langsung dipakai. |
| Sale | DUMMY | `POST /api/sales`, `GET /api/sales`, `GET /api/sales/:id`, `DELETE /api/sales/:id` | Bentuk ikut `doc/sale.md` (DRAFT): `paymentMethod`, `items: [{productId, quantity}]` → `invoiceNumber: INV-YYYYMMDD-0001`, `totalAmount`, `totalProfit`, `items` berisi `price` + `subtotal`. Stok berkurang saat jual. Hook dummy `useSale.tsx`. |
| Restock | DUMMY | `POST /api/restocks`, `GET /api/restocks` | **Belum ada `doc/restock.md`** — bentuk turunan dari prototype (lihat bawah). Hook dummy `useRestock.tsx`. |
| Expense | DUMMY | `POST/GET/PUT/DELETE /api/expenses`, `GET /api/expenses?startDate&endDate&category&page&size` | Bentuk ikut `doc/expense.md` (DRAFT): `title, category, amount, description, date`. Hook dummy `useExpense.tsx`. |
| Report | DUMMY | `GET /api/reports/daily?date`, `GET /api/reports/monthly?month`, `GET /api/reports?startDate&endDate` | Bentuk ikut `doc/report.md` (DRAFT): `totalIncome, totalExpense, profit, salesCount, expensesCount, daily[]`. Di FE, `profit` tampil sebagai **Total bersih**. Hook dummy `useReport.tsx` / `useDashboard.tsx`. |

## Data dummy (pakai angka Maru sendiri, sama seperti prototype)

- Malkist: beli Rp900, jual Rp2.000 (laba Rp1.100/pcs)
- Mie Instan Goreng: beli Rp2.000; Mie Instan Kuah: beli Rp2.000, jual Rp3.500
- Contoh restok: Malkist 10 × Rp900 + Mie Goreng 2 × Rp2.000 + Mie Kuah 1 × Rp2.000
  = **Total Belanja Rp15.000** → tercatat sebagai **satu** Expense kategori **Belanja Stok**
- Dummy disimpan di `localStorage` (default yang saya usulkan) supaya data tidak hilang
  tiap refresh saat Maru ngetes; kalau Maru mau cukup di memori, tinggal bilang.
- Dummy dipakai lewat service dummy + hook dummy dengan pola `useQuery`/`useMutation`
  yang sama — jadi komponen tidak tahu (dan tidak peduli) datanya dummy atau real.

## Aturan dummy Restock (turunan dari prototype — perlu dikonfirmasi)

- Restok hanya untuk produk yang sudah ada di menu Produk (produk baru mulai stok 0).
- Satu Restok berisi banyak item: `POST /api/restocks` dengan
  `{ items: [{ productId, quantity, buyPrice }] }` → stok tiap produk bertambah,
  dan otomatis tercatat **satu** Expense kategori `Belanja Stok` sebesar totalnya.
- Harga beli di-snapshot per item Restok, jadi laba penjualan lama tidak berubah
  kalau harga beli naik belakangan.

## Tahapan pengerjaan (satu fitur satu tahap)

1. **Fase 0 — Setup:** scaffold Vite + React + TS (`strict`), dep
   (`axios`, `@tanstack/react-query`, `react-hook-form`, `zod`,
   `@hookform/resolvers`, `react-router`, `react-use`, `sweetalert2`),
   `QueryClientProvider` di `main.tsx`, `src/libs/axios/instance.ts`,
   `service/endpoints.ts`, `types/api.d.ts`, router + layout
   (`components/layout/`), env `VITE_API_PATH`,
   `tsconfig` include `["src", "service", "types", "utils"]`.
2. **Fase 1 — Product (REAL API):** type + schema + `productServices` +
   `useProduct.tsx` (useQuery/useMutation/useForm) + UI (`Product.tsx` + pecahan
   di `components/product/`) nyambung ke BE. Fase ini jadi contoh pola untuk
   semua fitur.
3. **Fase 2 — Kasir (dummy Sale):** hook dummy `useSale.tsx`, keranjang, bayar, struk.
4. **Fase 3 — Restok (dummy):** hook dummy `useRestock.tsx`, form multi-item + Total Belanja.
5. **Fase 4 — Pengeluaran (dummy):** hook dummy `useExpense.tsx`, list, form, modal rincian.
6. **Fase 5 — Dashboard + Laporan (dummy Report):** hook dummy `useDashboard.tsx` /
   `useReport.tsx`, 3 kartu, grafik, Pilih Rentang.
7. Tiap BE jadi (Sale → Restok → Expense → Report), ganti dummy-nya dengan API beneran
   (isi service-nya saja; hook dan komponen tidak berubah).

## Keputusan yang masih dibutuhkan dari Maru

1. **Nama repo FE** — sudah ditunggu sejak 2026-11-19 04:27 (Maru yang buat).
2. **Metode bayar Sale:** Tunai / QRIS / Kartu? Format invoice `INV-YYYYMMDD-0001` setuju?
   (di `doc/sale.md` contohnya baru `CASH` dan `QRIS`).
3. **Harga beli berubah:** kalau Malkist restok lagi Rp950, `buyPrice` produk ikut jadi
   Rp950 atau tetap Rp900 (harga beli dicatat hanya di tiap Restok)?
4. **Batalkan Restok:** kalau salah input, stok dikurangi lagi + pengeluarannya ikut
   dihapus, atau restok tidak bisa dibatalkan?
5. Default yang saya pakai kecuali Maru bilang lain: Tailwind via CDN (ikut PZN),
   dummy di `localStorage`.

## Yang TIDAK dilakukan di tahap ini

- Tidak ada coding, tidak ada repo dibuat, tidak ada push ke GitHub.
- `doc/sale.md`, `doc/expense.md`, `doc/report.md` masih DRAFT — belum disetujui Maru,
  belum di-coding di BE. Kalau Maru mengubah isinya saat bahas Sale/Restok,
  bentuk dummy FE dan type-nya ikut berubah.

## Sumber best practice (yang saya baca untuk revisi ini)

- React/TypeScript conventions (feature folders, `*.types.ts`, API client terpusat,
  RHF + Zod): https://github.com/emre-yildiz-efs/claude-feature-dev/blob/HEAD/plugins/react-dev/skills/react-conventions/SKILL.md
- Three-layer API architecture (client → service → hook → component):
  https://copyprogramming.com/howto/javascript-react-separate-component-to-call-rest-api
- Zod + React Hook Form (`zodResolver`, `z.infer`, `z.coerce.number()`):
  https://tuts.kandz.me/zod-18-%f0%9f%9b%a1%ef%b8%8f-react-hook-form-integration-zodresolver-setup-and-useform/
- Pola `useQuery` / `useMutation` + toaster: contoh yang diberikan Maru (2026-11-19).
