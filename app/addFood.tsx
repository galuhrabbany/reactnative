import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from "react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function AddFood() {
  const router = useRouter();

  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState("");
  const [desc, setDesc] = useState("");

  const saveFood = async () => {
    try {
      if (!nama.trim()) {
        Alert.alert("Nama makanan wajib!");
        return;
      }

      const newData = { nama, kategori, desc };
      const stored = await AsyncStorage.getItem("bookmarks");
      const parsed = stored ? JSON.parse(stored) : [];

      parsed.push(newData);
      await AsyncStorage.setItem("bookmarks", JSON.stringify(parsed));

      Alert.alert("Berhasil!", "Makanan berhasil ditambahkan.");
      router.back();
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Gagal menyimpan");
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Tambahkan Catatan Baru" }} />

      <ImageBackground
        source={require("@/assets/images/bgbm.jpg")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(216,243,220,0.9)", "rgba(82,183,136,0.85)"]}
          style={styles.container}
        >
          <View style={styles.card}>
            <Text style={styles.title}>Tambah Catatan Baru</Text>
            <Text style={styles.subtitle}>
              Isi detail makanan dengan lengkap
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nama makanan"
              placeholderTextColor="#8cad98"
              value={nama}
              onChangeText={setNama}
            />

            <TextInput
              style={styles.input}
              placeholder="Kategori"
              placeholderTextColor="#8cad98"
              value={kategori}
              onChangeText={setKategori}
            />

            <TextInput
              style={[styles.input, { height: 120 }]}
              placeholder="Deskripsi"
              placeholderTextColor="#8cad98"
              value={desc}
              onChangeText={setDesc}
              multiline
            />

            <LinearGradient
              colors={["#2d6a4f", "#1b4332", "#081c15"]}
              style={styles.button}
            >
              <TouchableOpacity onPress={saveFood} style={styles.buttonWrap}>
                <Text style={styles.buttonText}>Simpan</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </LinearGradient>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
    justifyContent: "center",
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.45)",
    padding: 28,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.55)",
    shadowColor: "#74c69d",
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },

  title: {
    fontSize: 28,
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
    padding: 16,
    borderRadius: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#b7e4c7",
    shadowColor: "#95d5b2",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },

  button: {
    borderRadius: 18,
    marginTop: 10,
    shadowColor: "#1b4332",
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 7,
  },

  buttonWrap: {
    paddingVertical: 16,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
