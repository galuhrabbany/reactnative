import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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
        Alert.alert("Nama makanan wajib diisi");
        return;
      }

      const newData = { nama, kategori, desc };
      const stored = await AsyncStorage.getItem("bookmarks");
      const parsed = stored ? JSON.parse(stored) : [];

      parsed.push(newData);
      await AsyncStorage.setItem("bookmarks", JSON.stringify(parsed));

      Alert.alert("Berhasil", "Catatan makanan disimpan");
      router.back();
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Gagal menyimpan catatan");
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
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <LinearGradient
              colors={["rgba(240,248,245,0.95)", "rgba(210,235,220,0.9)"]}
              style={styles.container}
            >
              <View style={styles.headerWrap}>
                <Text style={styles.header}>Catatan Baru</Text>
                <Text style={styles.subHeader}>
                  Tambahkan detail makanan dengan lengkap
                </Text>
              </View>

              <View style={styles.card}>
                <View style={styles.inputWrap}>
                  <Text style={styles.label}>Nama Makanan</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Contoh: Nasi Goreng Ayam"
                    placeholderTextColor="#9bb9a5"
                    value={nama}
                    onChangeText={setNama}
                  />
                </View>

                <View style={styles.inputWrap}>
                  <Text style={styles.label}>Kategori</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Contoh: Main Course"
                    placeholderTextColor="#9bb9a5"
                    value={kategori}
                    onChangeText={setKategori}
                  />
                </View>

                <View style={styles.inputWrap}>
                  <Text style={styles.label}>Deskripsi</Text>
                  <TextInput
                    style={[styles.input, { height: 120 }]}
                    placeholder="Tuliskan catatan tambahan..."
                    placeholderTextColor="#9bb9a5"
                    value={desc}
                    onChangeText={setDesc}
                    multiline
                  />
                </View>

                <LinearGradient
                  colors={["#1c4532", "#133026", "#0b1a16"]}
                  style={styles.button}
                >
                  <TouchableOpacity onPress={saveFood} style={styles.buttonTouch}>
                    <Text style={styles.buttonText}>Simpan Catatan</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </LinearGradient>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 26,
  },

  headerWrap: {
    marginBottom: 22,
    alignItems: "center",
  },

  header: {
    fontSize: 30,
    fontWeight: "800",
    color: "#143d2a",
  },

  subHeader: {
    fontSize: 14,
    color: "#506d61",
    marginTop: 4,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.55)",
    padding: 24,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
    shadowColor: "#1a3c31",
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  inputWrap: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f4d39",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.75)",
    padding: 14,
    borderRadius: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#b9dcc9",
    elevation: 3,
  },

  button: {
    marginTop: 10,
    borderRadius: 20,
    elevation: 5,
  },

  buttonTouch: {
    paddingVertical: 16,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
