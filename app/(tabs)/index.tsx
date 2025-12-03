import { useState, useEffect } from "react";
import {
  ImageBackground,
  Image,
  StyleSheet,
  View,
  TextInput,
  Modal,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { WebView } from "react-native-webview";
import { LinearGradient } from "expo-linear-gradient";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

type Resto = {
  id: string;
  name: string;
  category: string;
  address: string;
  latitude?: string;
  longitude?: string;
  accuracy?: string;
  open_hours?: string;
  price_range?: string;
  menu_top?: string;
};

export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [restoList, setRestoList] = useState<Resto[]>([]);

  // FIREBASE
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

  // LOAD DATA
  useEffect(() => {
    const restoRef = ref(db, "resto_locations/");
    const unsubscribe = onValue(restoRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return setRestoList([]);

      const arr: Resto[] = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      setRestoList(arr);
    });

    return () => unsubscribe();
  }, []);

  const filteredResto = restoList.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase())
  );

  const features = [
    {
      title: "🍜 Pencarian Kuliner",
      desc: "Temukan tempat makan populer & hidden gems di Yogyakarta.",
    },
    {
      title: "🗺️ Navigasi Lokasi",
      desc: "Dapatkan rute tercepat ke lokasi kuliner terbaik.",
    },
    {
      title: "📑 Notes Pengguna",
      desc: "Catat kuliner yang ingin kamu cicipi.",
    },
  ];

  const filteredFeature = features.filter((f) =>
    f.title.toLowerCase().includes(search.toLowerCase())
  );

  // ========================== STATISTIK REAL ==========================

  const totalPlaces = useAnimatedCount(restoList.length);

  const uniqueCategories = useAnimatedCount(
    new Set(restoList.map((r) => r.category)).size
  );

  const avgPrice = useAnimatedCount(
    Math.round(
      restoList
        .map((r) => Number(r.price_range))
        .filter((n) => !isNaN(n))
        .reduce((a, b) => a + b, 0) /
        (restoList.filter((r) => !isNaN(Number(r.price_range))).length || 1)
    )
  );

  const topMenuCount = useAnimatedCount(
    restoList.filter((r) => r.menu_top && r.menu_top.trim() !== "").length
  );

  const statistics = [
    { label: "Places", value: totalPlaces },
    { label: "Categories", value: uniqueCategories },
    { label: "Avg Price", value: avgPrice },
    { label: "Top Menu", value: topMenuCount },
  ];

  return (
    <ImageBackground
      source={require("@/assets/images/bgbm.jpg")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(216, 243, 220, 0.9)", "rgba(82, 183, 136, 0.8)"]}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
          {/* HEADER */}
          <View style={styles.headerContainer}>
            <Image
              source={require("@/assets/images/makanlogo.png")}
              style={styles.logo}
            />
            <ThemedText type="title" style={styles.title}>
              MAKAN
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Map Assistant for Kulinary Areas & Navigation
            </ThemedText>
          </View>

          {/* SEARCH */}
          <TextInput
            style={styles.searchBar}
            placeholder="Cari fitur atau kuliner..."
            placeholderTextColor="#345e4f"
            value={search}
            onChangeText={setSearch}
          />

          {/* ==================== STATISTICS ==================== */}
          <View style={styles.statsContainer}>
            {statistics.map((item, index) => (
              <View key={index} style={styles.statCard}>
                <ThemedText type="defaultSemiBold" style={styles.statNumber}>
                  {item.value}
                </ThemedText>
                <ThemedText style={styles.statLabel}>{item.label}</ThemedText>
              </View>
            ))}
          </View>

          {/* FEATURES */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Fitur Utama
            </ThemedText>
            {filteredFeature.length > 0 ? (
              filteredFeature.map((item, i) => (
                <LinearGradient
                  key={i}
                  colors={["rgba(216,243,220,0.7)", "rgba(82,183,136,0.5)"]}
                  style={styles.featureCard}
                >
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.featureTitle}
                  >
                    {item.title}
                  </ThemedText>
                  <ThemedText style={styles.featureDesc}>
                    {item.desc}
                  </ThemedText>
                </LinearGradient>
              ))
            ) : (
              <ThemedText style={styles.notFound}>
                Tidak ditemukan fitur.
              </ThemedText>
            )}
          </View>

          {/* RECOMMENDED RESTO */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Rekomendasi Restoran
            </ThemedText>
            {filteredResto.length > 0 ? (
              filteredResto.map((item, i) => (
                <LinearGradient
                  key={i}
                  colors={["rgba(216,243,220,0.7)", "rgba(82,183,136,0.5)"]}
                  style={styles.featureCard}
                >
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.featureTitle}
                  >
                    {item.name}
                  </ThemedText>
                  <ThemedText style={styles.featureDesc}>
                    {item.category} - {item.address}
                  </ThemedText>
                </LinearGradient>
              ))
            ) : (
              <ThemedText style={styles.notFound}>
                Tidak ditemukan restoran.
              </ThemedText>
            )}
          </View>

          {/* MAP */}
          <View style={styles.mapWrapper}>
            <ThemedText type="subtitle" style={styles.mapTitle}>
              Peta Kuliner
            </ThemedText>
            <LinearGradient
              colors={["rgba(216,243,220,0.8)", "rgba(82,183,136,0.5)"]}
              style={styles.mapContainer}
            >
              <WebView
                source={require("@/assets/html/map.html")}
                originWhitelist={["*"]}
                allowFileAccess
                allowFileAccessFromFileURLs
                allowUniversalAccessFromFileURLs
                javaScriptEnabled
                domStorageEnabled
                style={{ flex: 1 }}
              />
            </LinearGradient>
          </View>

          {/* MODAL */}
          <Modal visible={modalVisible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <ThemedText type="title" style={styles.modalTitle}>
                  Rekomendasi Hari Ini
                </ThemedText>
                <ThemedText style={styles.modalDesc}>
                  Cobalah:{" "}
                  <ThemedText type="defaultSemiBold">
                    Nasi Goreng Mafia - Sleman
                  </ThemedText>
                </ThemedText>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <ThemedText style={{ color: "white", fontSize: 16 }}>
                    Tutup
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* FLOATING BUTTON */}
          <TouchableOpacity
            style={styles.fab}
            onPress={() => setModalVisible(true)}
          >
            <Text style={{ fontSize: 28 }}>✨</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
}

/* ANIMATED COUNTER */
function useAnimatedCount(target: number) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.ceil(target / 25);
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      setCount(current);
    }, 30);

    return () => clearInterval(interval);
  }, [target]);

  return count;
}

/* ============================= STYLES ============================ */
const styles = StyleSheet.create({
  headerContainer: { paddingTop: 30, paddingBottom: 10, alignItems: "center" },
  logo: { height: 180, width: 350, resizeMode: "contain", marginBottom: 12 },
  title: {
    color: "#145c3d",
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: 1,
    textAlign: "center",
    paddingTop: 10,
  },
  subtitle: {
    color: "#345e4f",
    fontSize: 15,
    marginTop: 5,
    opacity: 0.9,
    textAlign: "center",
  },

  searchBar: {
    backgroundColor: "rgba(216,243,220,0.85)",
    padding: 14,
    borderRadius: 18,
    marginHorizontal: 22,
    marginTop: 14,
    fontSize: 15,
    borderWidth: 1.3,
    borderColor: "rgba(82,183,136,0.9)",
  },

  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 22,
  },

  statCard: {
    width: "48%",
    backgroundColor: "rgba(216,243,220,0.88)",
    marginBottom: 14,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 18,
    alignItems: "center",
    borderWidth: 1.2,
    borderColor: "rgba(82,183,136,0.7)",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  statNumber: {
    color: "#104f36",
    fontSize: 22,
    fontWeight: "800",
  },

  statLabel: {
    fontSize: 13,
    color: "#345e4f",
    marginTop: 4,
    letterSpacing: 0.3,
  },
  section: { marginBottom: 20, paddingHorizontal: 18, marginTop: 30 },
  sectionTitle: { color: "#145c3d", fontSize: 26, fontWeight: "800" },
  featureCard: { padding: 16, borderRadius: 16, marginTop: 12 },
  featureTitle: { color: "#145c3d", fontSize: 18, fontWeight: "600" },
  featureDesc: { fontSize: 14, color: "#345e4f", marginTop: 4 },
  notFound: {
    textAlign: "center",
    marginTop: 10,
    color: "#6a6a6a",
    fontStyle: "italic",
  },

  mapWrapper: { marginTop: 30, paddingHorizontal: 16 },
  mapTitle: {
    color: "#145c3d",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 12,
  },
  mapContainer: {
    height: 360,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1.2,
    borderColor: "rgba(82,183,136,0.8)",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    width: "82%",
    padding: 24,
    borderRadius: 24,
  },
  modalTitle: {
    textAlign: "center",
    color: "#145c3d",
    fontSize: 20,
    fontWeight: "700",
  },
  modalDesc: {
    marginTop: 10,
    textAlign: "center",
    color: "#345e4f",
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: "#145c3d",
    padding: 12,
    marginTop: 20,
    borderRadius: 14,
    alignItems: "center",
  },

  fab: {
    position: "absolute",
    bottom: 35,
    right: 25,
    backgroundColor: "#52b788",
    padding: 20,
    borderRadius: 50,
  },
});
