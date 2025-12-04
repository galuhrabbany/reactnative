# 🍽️ MAKAN

Map Assistant for Kulinary Areas & Navigation

Aplikasi mobile berbasis React Native untuk mencari lokasi kuliner di Yogyakarta, navigasi ke lokasi melalui Google Maps, serta mencatat kuliner favorit pengguna.

## 📖 Deskripsi Produk

MAKAN dirancang untuk membantu pengguna menemukan tempat makan populer maupun hidden gems di Yogyakarta.
Aplikasi ini juga menawarkan fitur navigasi lokasi dan pencatatan kuliner secara lokal.

## ✅ Fitur yang tersedia

* 🔍 Pencarian kuliner berdasarkan nama & kategori
* 🗺️ Peta lokasi restoran kuliner (Firebase Realtime Database)
* 🚏 Navigasi langsung ke Google Maps
* 📑 Catatan kuliner favorit menggunakan AsyncStorage
* 🛠️ CRUD Data (Tambah, Edit, Hapus) restoran
* 📊 Statistik kuliner real-time di halaman Home

## 🧩 Komponen Pembangun Produk

| Komponen      | Teknologi                          |
| ------------- | ---------------------------------- |
| UI Framework  | React Native (Expo)                |
| Maps          | react-native-maps + expo-location  |
| Backend       | Firebase Realtime Database         |
| Local Storage | AsyncStorage                       |
| Router        | Expo Router                        |
| UI Styling    | Custom Stylesheet + LinearGradient |
| Embedded Map  | WebView (HTML Local Assets)        |

## 🗂️ Sumber Data

| Data                       | Sumber                                         |
| -------------------------- | ---------------------------------------------- |
| Lokasi restoran (realtime) | Firebase Realtime Database: `resto_locations/` |
| Catatan kuliner pribadi    | Local Storage (AsyncStorage)                   |

## 📱 Halaman Utama Aplikasi

| Halaman                              | Fungsi                                               |
| ------------------------------------ | ---------------------------------------------------- |
| Home (`index.tsx`)                   | Statistik kuliner, rekomendasi restoran, fitur utama |
| Maps (`Gmap.tsx`)                    | Menampilkan marker restoran dan navigasi             |
| Tambah Lokasi (`Forminput.tsx`)      | Form tambah data lokasi restoran                     |
| Edit Lokasi (`formeditlocation.tsx`) | Edit informasi restoran                              |
| List Lokasi (`lokasi.tsx`)           | Daftar semua restoran (CRUD + lihat di map)          |
| Catatan Kuliner (`explore.tsx`)      | List catatan kuliner pengguna                        |
| Tambah Catatan (`addFood.tsx`)       | Form tambah catatan makanan                          |

## 🔧 Instalasi

Clone repository:

```
git clone https://github.com/galuhrabbany/reactnative.git
```

Masuk ke folder project:

```
cd makan-app
```

Install dependencies:

```
npm install
```

Jalankan aplikasi:

```
expo start
```

⚠️ Pastikan `firebaseConfig` sudah disesuaikan dengan konfigurasi Firebase milik Anda.

## 👨‍💻 Developer

Proyek ini dikembangkan sebagai Tugas PGPBL 2025
Tema: Sistem Informasi Kuliner Yogyakarta berbasis Lokasi
