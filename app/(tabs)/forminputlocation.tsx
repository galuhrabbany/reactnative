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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import * as Location from "expo-location";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";
import { LinearGradient } from "expo-linear-gradient";

type InputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

// =======================================================
// MAIN COMPONENT
// =======================================================
const App = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [openHours, setOpenHours] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [menuTop, setMenuTop] = useState("");
  const [accuracy, setAccuracy] = useState("");

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

  // Firebase
  const app = initializeApp({
    apiKey: "AIzaSyAYESvyzOj8rPJkOE2qn94Pm4czkb4PJLY",
    authDomain: "reactnative-pgpbl2025.firebaseapp.com",
    databaseURL: "https://reactnative-pgpbl2025-default-rtdb.firebaseio.com",
    projectId: "reactnative-pgpbl2025",
    storageBucket: "reactnative-pgpbl2025.firebasestorage.app",
    messagingSenderId: "770495428833",
    appId: "1:770495428833:web:fe9c779fec09a1b0791fa0",
  });

  const db = getDatabase(app);

  const saveData = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Nama restoran wajib diisi.");
      return;
    }

    const refDB = ref(db, "resto_locations/");
    push(refDB, {
      name,
      category,
      address,
      latitude,
      longitude,
      accuracy,
      open_hours: openHours,
      price_range: priceRange,
      menu_top: menuTop,
      timestamp: Date.now(),
    })
      .then(() => {
        Alert.alert("Sukses", "Data restoran berhasil disimpan.");

        setName("");
        setCategory("");
        setAddress("");
        setLatitude("");
        setLongitude("");
        setAccuracy("");
        setOpenHours("");
        setPriceRange("");
        setMenuTop("");
      })
      .catch((e) => {
        console.error(e);
        Alert.alert("Error", "Gagal menyimpan data.");
      });
  };

  return (
    <SafeAreaProvider>
      <ImageBackground
        source={require("@/assets/images/bgbm.jpg")}
        style={{ flex: 1 }}
      >
        <LinearGradient
          colors={["rgba(210, 240, 218, 0.9)", "rgba(60, 120, 90, 0.65)"]}
          style={{ flex: 1 }}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <Stack.Screen options={{ title: "Form Lokasi Restoran" }} />

            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.container}
              >
                {/* HEADER FLOATING */}
                <View style={styles.headerBox}>
                  <Text style={styles.headerTitle}>Tambah Data Restoran</Text>
                  <Text style={styles.headerSub}>
                    Lengkapi informasi restoran secara detail.
                  </Text>
                </View>

                {/* FORM CARD */}
                <View style={styles.card}>
                  <Input
                    label="Nama Restoran"
                    value={name}
                    onChangeText={setName}
                    placeholder="Contoh: Resto Sunda"
                  />
                  <Input
                    label="Kategori"
                    value={category}
                    onChangeText={setCategory}
                    placeholder="Cafe / Jepang / Sunda"
                  />
                  <Input
                    label="Alamat"
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Alamat lengkap"
                  />
                  <Input
                    label="Latitude"
                    value={latitude}
                    onChangeText={setLatitude}
                    placeholder="-6.xxxxx"
                  />
                  <Input
                    label="Longitude"
                    value={longitude}
                    onChangeText={setLongitude}
                    placeholder="107.xxxxx"
                  />
                  <Input
                    label="Akurasi GPS"
                    value={accuracy}
                    onChangeText={setAccuracy}
                    placeholder="Akurasi dalam meter"
                  />
                  <Input
                    label="Jam Buka - Tutup"
                    value={openHours}
                    onChangeText={setOpenHours}
                    placeholder="08.00 - 22.00"
                  />
                  <Input
                    label="Kisaran Harga"
                    value={priceRange}
                    onChangeText={setPriceRange}
                    placeholder="Rp 20.000 - 60.000"
                  />
                  <Input
                    label="Menu Unggulan"
                    value={menuTop}
                    onChangeText={setMenuTop}
                    placeholder="Ayam Penyet, Kopi Susu, dll"
                  />

                  {/* GET LOCATION */}
                  <TouchableOpacity
                    style={styles.btnSecondary}
                    onPress={getCoordinates}
                  >
                    <Text style={styles.btnSecondaryText}>
                      Ambil Lokasi Sekarang
                    </Text>
                  </TouchableOpacity>

                  {/* SAVE BUTTON */}
                  <TouchableOpacity style={styles.btnPrimary} onPress={saveData}>
                    <Text style={styles.btnPrimaryText}>Simpan</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaProvider>
  );
};

// =======================================================
// REUSABLE INPUT COMPONENT
// =======================================================
const Input = ({ label, value, onChangeText, placeholder }: InputProps) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#40665a"
    />
  </View>
);

// =======================================================
// STYLES
// =======================================================
const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },

  headerBox: {
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.55)",
    borderRadius: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1f4d39",
    marginBottom: 4,
  },

  headerSub: {
    fontSize: 14,
    color: "#3f7058",
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e4f3c",
    marginBottom: 6,
  },

  input: {
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderWidth: 1,
    borderColor: "#92d0b3",
  },

  btnSecondary: {
    backgroundColor: "#52b788",
    paddingVertical: 13,
    borderRadius: 12,
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },

  btnSecondaryText: {
    textAlign: "center",
    color: "white",
    fontWeight: "700",
  },

  btnPrimary: {
    backgroundColor: "#1b4332",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 18,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },

  btnPrimaryText: {
    textAlign: "center",
    color: "white",
    fontWeight: "800",
    fontSize: 16,
  },
});

export default App;
