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

// ------------------------------------
// MAIN COMPONENT
// ------------------------------------
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
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(216, 243, 220, 0.85)", "rgba(82, 183, 136, 0.6)"]}
          style={{ flex: 1 }}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <Stack.Screen options={{ title: "Form Input Lokasi Restoran" }} />

            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
              >
                <LinearGradient
                  colors={["rgba(255,255,255,0.3)", "rgba(82,183,136,0.2)"]}
                  style={styles.card}
                >
                  <Text style={styles.title}>Input Data Restoran</Text>

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

                  <TouchableOpacity
                    style={styles.btnSecondary}
                    onPress={getCoordinates}
                  >
                    <Text style={styles.btnSecondaryText}>
                      Get Current Location
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnPrimary}
                    onPress={saveData}
                  >
                    <Text style={styles.btnPrimaryText}>Save Data</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaProvider>
  );
};

// ------------------------------------
// INPUT COMPONENT
// ------------------------------------
const Input = ({ label, value, onChangeText, placeholder }: InputProps) => (
  <View style={{ marginBottom: 14 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[
        styles.input,
        { backgroundColor: "rgba(255,255,255,0.25)", borderColor: "#52b788" },
      ]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#245c44"
    />
  </View>
);

// ------------------------------------
// STYLES
// ------------------------------------
const styles = StyleSheet.create({
  container: { padding: 16 },
  card: {
    backgroundColor: "rgba(255,255,255,0.35)",
    padding: 20,
    borderRadius: 14,
    elevation: 4,
    shadowColor: "#00000040",
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: "#245c44",
  },
  label: { fontSize: 15, fontWeight: "600", marginBottom: 6, color: "#2d6a4f" },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  btnSecondary: {
    backgroundColor: "rgba(82,183,136,0.8)",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  btnSecondaryText: { textAlign: "center", color: "white", fontWeight: "700" },
  btnPrimary: {
    backgroundColor: "rgba(45,108,79,0.85)",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 16,
  },
  btnPrimaryText: { textAlign: "center", color: "white", fontWeight: "800" },
});

export default App;
