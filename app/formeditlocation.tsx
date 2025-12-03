import * as Location from "expo-location";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, update } from "firebase/database";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const App = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const {
    id,
    name: initialName,
    category: initialCategory,
    address: initialAddress,
    latitude: initialLatitude,
    longitude: initialLongitude,
    accuracy: initialAccuracy,
    open_hours: initialOpenHours,
    price_range: initialPriceRange,
    menu_top: initialMenuTop,
  } = params;

  const [name, setName] = useState(String(initialName ?? ""));
  const [category, setCategory] = useState(String(initialCategory ?? ""));
  const [address, setAddress] = useState(String(initialAddress ?? ""));
  const [latitude, setLatitude] = useState(String(initialLatitude ?? ""));
  const [longitude, setLongitude] = useState(String(initialLongitude ?? ""));
  const [accuracy, setAccuracy] = useState(String(initialAccuracy ?? ""));
  const [openHours, setOpenHours] = useState(String(initialOpenHours ?? ""));
  const [priceRange, setPriceRange] = useState(String(initialPriceRange ?? ""));
  const [menuTop, setMenuTop] = useState(String(initialMenuTop ?? ""));

  const getCoordinates = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Izin lokasi diperlukan.");
      return;
    }

    let loc = await Location.getCurrentPositionAsync({});
    setLatitude(String(loc.coords.latitude));
    setLongitude(String(loc.coords.longitude));
    setAccuracy(loc.coords.accuracy + " m");
  };

  const firebaseConfig = {
    apiKey: "AIzaSyAYESvyzOj8rPJkOE2qn94Pm4czkb4PJLY",
    authDomain: "reactnative-pgpbl2025.firebaseapp.com",
    databaseURL: "https://reactnative-pgpbl2025-default-rtdb.firebaseio.com",
    projectId: "reactnative-pgpbl2025",
    storageBucket: "reactnative-pgpbl2025.firebasestorage.app",
    messagingSenderId: "770495428833",
    appId: "1:770495428833:web:fe9c779fec09a1b0791fa0",
  };

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  const handleUpdate = () => {
    if (!id) {
      Alert.alert("Error", "ID lokasi tidak ditemukan.");
      return;
    }

    const pointRef = ref(db, `resto_locations/${id}`);
    update(pointRef, {
      name,
      category,
      address,
      latitude,
      longitude,
      accuracy,
      open_hours: openHours,
      price_range: priceRange,
      menu_top: menuTop,
    })
      .then(() => {
        Alert.alert("Sukses", "Data berhasil diperbarui", [
          { text: "OK", onPress: () => router.back() },
        ]);
      })
      .catch((e) => {
        console.error(e);
        Alert.alert("Error", "Gagal memperbarui data");
      });
  };

  return (
    <SafeAreaProvider>
      <ImageBackground
        source={require("@/assets/images/bgbm.jpg")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(216,243,220,0.9)", "rgba(82,183,136,0.7)"]}
          style={{ flex: 1 }}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <Stack.Screen options={{ title: "Edit Lokasi Restoran" }} />

            <ScrollView
              contentContainerStyle={styles.container}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.card}>
                <Text style={styles.title}>Edit Lokasi Restoran</Text>
                <Text style={styles.subtitle}>
                  Perbarui data sesuai kebutuhan
                </Text>

                <Input label="Nama Restoran" value={name} onChangeText={setName} placeholder="Contoh: Resto Sunda" />
                <Input label="Kategori" value={category} onChangeText={setCategory} placeholder="Cafe / Jepang / Sunda" />
                <Input label="Alamat" value={address} onChangeText={setAddress} placeholder="Alamat lengkap" />
                <Input label="Latitude" value={latitude} onChangeText={setLatitude} placeholder="-6.xxxxx" />
                <Input label="Longitude" value={longitude} onChangeText={setLongitude} placeholder="107.xxxxx" />
                <Input label="Akurasi GPS" value={accuracy} onChangeText={setAccuracy} placeholder="Akurasi dalam meter" />
                <Input label="Jam Buka - Tutup" value={openHours} onChangeText={setOpenHours} placeholder="08.00 - 22.00" />
                <Input label="Kisaran Harga" value={priceRange} onChangeText={setPriceRange} placeholder="Rp 20.000 - 60.000" />
                <Input label="Menu Unggulan" value={menuTop} onChangeText={setMenuTop} placeholder="Ayam Penyet, Kopi Susu, dll" />

                <TouchableOpacity style={styles.btnSecondary} onPress={getCoordinates}>
                  <Text style={styles.btnSecondaryText}>Ambil Lokasi Saat Ini</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnPrimary} onPress={handleUpdate}>
                  <Text style={styles.btnPrimaryText}>Simpan Perubahan</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaProvider>
  );
};

type InputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

const Input = ({ label, value, onChangeText, placeholder }: InputProps) => (
  <View style={{ marginBottom: 18 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#52796f"
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 22,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.45)",
    padding: 26,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.55)",
    shadowColor: "#74c69d",
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1b4332",
    textAlign: "center",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#52796f",
    marginBottom: 22,
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.7)",
    padding: 14,
    borderRadius: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#b7e4c7",
    shadowColor: "#95d5b2",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6,
    color: "#2d6a4f",
  },

  btnSecondary: {
    backgroundColor: "#52b788",
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 4,
  },

  btnSecondaryText: {
    textAlign: "center",
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },

  btnPrimary: {
    backgroundColor: "#1b4332",
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 14,
  },

  btnPrimaryText: {
    textAlign: "center",
    color: "white",
    fontWeight: "800",
    fontSize: 17,
  },
});

export default App;
