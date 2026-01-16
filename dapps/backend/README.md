<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# 📘 Backend API NestJS untuk Avalanche dApp (Day 4)

Backend ini adalah bagian dari **Avalanche Indonesia Short Course** (Day 4). Project ini dibangun menggunakan framework **NestJS** dan library **viem** untuk berinteraksi dengan smart contract di jaringan **Avalanche Fuji Testnet**.

---

## 🚀 Fitur Utama

Backend ini berfungsi sebagai middleware antara blockchain dan frontend (Client) dengan kemampuan:

- **Read Smart Contract**: Membaca state variabel `value` dari Smart Contract SimpleStorage.
- **Fetch Event History**: Mengambil riwayat event `ValueUpdated` dari blockchain.
- **API Documentation**: Dokumentasi API otomatis menggunakan **Swagger UI**.
- **Robust Error Handling**: Penanganan error RPC (Timeout/Network Error) yang rapi.

---

## 🛠️ Teknologi yang Digunakan

- **[NestJS](https://nestjs.com/)**: Framework Node.js yang modular dan scalable.
- **[viem](https://viem.sh/)**: Library TypeScript ringan untuk interaksi Ethereum/Avalanche.
- **[Swagger](https://swagger.io/)**: Untuk dokumentasi API interaktif.

---

## 📦 Instalasi & Setup

Ikuti langkah-langkah berikut untuk menjalankan project ini di komputer lokal Anda.

### 1. Masuk ke direktori backend

```bash
cd dapps/backend
```

### 2. Install Dependencies

Install semua library yang dibutuhkan:

```bash
npm install
```

### 3. Konfigurasi Smart Contract

Pastikan address smart contract sudah diset dengan benar di file `src/blockchain/blockchain.service.ts`:

```typescript
// src/blockchain/blockchain.service.ts
this.contractAddress = '0x...'; // Ganti dengan address contract Anda
```

---

## ▶️ Menjalankan Aplikasi

### Mode Development

```bash
npm run start:dev
```

Aplikasi akan berjalan di: `http://localhost:3000`

### Mode Production

```bash
npm run build
npm run start:prod
```

---

## 📚 Dokumentasi API (Swagger)

Setelah aplikasi berjalan, buka browser dan akses URL berikut untuk melihat dokumentasi API yang interaktif:

👉 **http://localhost:3000/documentation**

Di sana Anda bisa mencoba langsung endpoint-endpoint yang tersedia.

### Daftar Endpoint

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/blockchain/value` | Mengambil nilai `value` terbaru dari smart contract. |
| `GET` | `/blockchain/events` | Mengambil daftar event `ValueUpdated` (history perubahan). |

---

## 📂 Struktur Project

Berikut adalah struktur folder utama dari backend ini:

```text
dapps/backend/
├── src/
│   ├── blockchain/
│   │   ├── blockchain.controller.ts  # Mengatur endpoint API
│   │   ├── blockchain.module.ts      # Modul blockchain
│   │   ├── blockchain.service.ts     # Logika bisnis & interaksi viem
│   │   └── simple-storage.abi.ts     # ABI Smart Contract
│   ├── app.module.ts                 # Root Module
│   └── main.ts                       # Entry point aplikasi
├── test/
├── package.json
└── README.md
```

---

## 👤 Author

**Nama**: Dimas Febrianto Wicaksono  
**NIM**: 251011401392

---

<p align="center">
  <i>Dibuat untuk memenuhi tugas Avalanche Indonesia Short Course.</i>
</p>
