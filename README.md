🍽️ MAKAN

Map Assistant for Kulinary Areas & Navigation

Aplikasi mobile berbasis React Native untuk mencari lokasi kuliner di Yogyakarta, navigasi ke lokasi melalui Google Maps, serta mencatat kuliner favorit pengguna.

📖 Deskripsi Produk

MAKAN dirancang untuk membantu pengguna menemukan tempat makan populer maupun hidden gems di Yogyakarta.
Aplikasi ini juga menawarkan fitur navigasi lokasi dan pencatatan kuliner secara lokal.

Fitur yang tersedia:

🔍 Pencarian kuliner berdasarkan nama & kategori

🗺️ Peta lokasi restoran kuliner (Firebase Realtime Database)

🚏 Navigasi langsung ke Google Maps

📑 Catatan kuliner favorit menggunakan AsyncStorage

🛠️ CRUD Data (Tambah, Edit, Hapus) restoran

📊 Statistik kuliner real-time di halaman Home

🧩 Komponen Pembangun Produk
| Komponen      | Teknologi                          |
| ------------- | ---------------------------------- |
| UI Framework  | React Native (Expo)                |
| Maps          | react-native-maps + expo-location  |
| Backend       | Firebase Realtime Database         |
| Local Storage | AsyncStorage                       |
| Router        | Expo Router                        |
| UI Styling    | Custom Stylesheet + LinearGradient |
| Embedded Map  | WebView (HTML Local Assets)        |

🗂️ Sumber Data
| Data                       | Sumber                                         |
| -------------------------- | ---------------------------------------------- |
| Lokasi restoran (realtime) | Firebase Realtime Database: `resto_locations/` |
| Catatan kuliner pribadi    | Local Storage (AsyncStorage)                   |

📱 Halaman Utama Aplikasi
| Halaman                              | Fungsi                                               |
| ------------------------------------ | ---------------------------------------------------- |
| Home (`index.tsx`)                   | Statistik kuliner, rekomendasi restoran, fitur utama |
| Maps (`Gmap.tsx`)                    | Menampilkan marker restoran dan navigasi             |
| Tambah Lokasi (`Forminput.tsx`)      | Form tambah data lokasi restoran                     |
| Edit Lokasi (`formeditlocation.tsx`) | Edit informasi restoran                              |
| List Lokasi (`lokasi.tsx`)           | Daftar semua restoran (CRUD + lihat di map)          |
| Catatan Kuliner (`explore.tsx`)      | List catatan kuliner pengguna                        |
| Tambah Catatan (`addFood.tsx`)       | Form tambah catatan makanan                          |

🖼️ Tangkapan Layar
![WhatsApp Image 2025-12-03 at 17 30 35_b8e53b82](https://github.com/user-attachments/assets/00d5bfef-ed2c-4d49-9d15-5dcd946d8edf)
![WhatsApp Image 2025-12-03 at 17 30 36_caaa7e34](https://github.com/user-attachments/assets/d6ae12bf-2202-4c8b-93e2-62a579e27a8b)
![WhatsApp Image 2025-12-03 at 17 30 36_e898f3d8](https://github.com/user-attachments/assets/5817bd45-f943-45bf-a05f-88bf3c8e7544)
![WhatsApp Image 2025-12-03 at 17 30 36_e878c4a7](https://github.com/user-attachments/assets/d8ea3183-22a0-4812-8c26-07a0340094bb)
![WhatsApp Image 2025-12-03 at 17 30 37_0cc9dc97](https://github.com/user-attachments/assets/a474c387-9d11-4875-bd6f-d5063a216258)

🔧 Instalasi & Cara Menjalankan
# Clone repository
git clone <URL-repository-GitHub-anda>

# Masuk folder project
cd makan-app

# Install dependencies
npm install

# Jalankan aplikasi
expo start


📌 Pastikan Firebase sudah dikonfigurasi sesuai firebaseConfig di dalam project.

👨‍💻 Developer

Proyek ini dikembangkan sebagai Tugas PGPBL 2025
Tema: Sistem Informasi Kuliner Yogyakarta berbasis Lokasi
