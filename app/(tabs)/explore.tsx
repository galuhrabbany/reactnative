import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

type FoodItem = {
  nama: string;
  kategori: string;
  desc: string;
};

export default function ExploreScreen() {
  const [bookmarks, setBookmarks] = useState<FoodItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadBookmarks = async () => {
        try {
          const data = await AsyncStorage.getItem("bookmarks");
          setBookmarks(data ? JSON.parse(data) : []);
        } catch (error) {
          console.log("Error loading bookmarks:", error);
        }
      };

      loadBookmarks();
    }, [])
  );

  return (
    <ImageBackground
      source={require('@/assets/images/bgbm.jpg')}  // ganti path sesuai gambarmu
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(216, 243, 220, 0.9)", "rgba(82, 183, 136, 0.8)"]}
        style={styles.container}
      >
        <Text style={styles.header}>Place To Go Yogyakarta</Text>
        <Text style={styles.subHeader}>Catatan Tempat Kuliner Pengguna</Text>

        {/* BUTTON */}
        <LinearGradient
          colors={["#2d6a4f", "#1b4332", "#081c15"]}
          style={styles.addButton}
        >
          <TouchableOpacity
            style={styles.addButtonTouchable}
            onPress={() => router.push("/addFood")}
          >
            <Text style={styles.addText}>+ Tambah Makanan</Text>
          </TouchableOpacity>
        </LinearGradient>

        {bookmarks.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>🍽️</Text>
            <Text style={styles.empty}>Belum ada makanan tersimpan</Text>
          </View>
        ) : (
          <FlatList
            data={bookmarks}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: 30 }}
            renderItem={({ item }) => (
              <LinearGradient
                colors={[
                  "rgba(255,255,255,0.7)",
                  "rgba(255,255,255,0.4)",
                  "rgba(255,255,255,0.15)",
                ]}
                style={styles.card}
              >
                <Text style={styles.cardTitle}>{item.nama}</Text>
                <Text style={styles.cardCategory}>Kategori • {item.kategori}</Text>
                <Text style={styles.cardDesc}>{item.desc}</Text>
              </LinearGradient>
            )}
          />
        )}
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  header: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1b4332",
    textAlign: "center",        // DIBUAT TENGAH
    marginTop: 15,
    letterSpacing: 0.5,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },

  subHeader: {
    fontSize: 16,
    color: "#345e4f",
    textAlign: "center",        // DIBUAT TENGAH
    marginBottom: 25,
  },

  addButton: {
    borderRadius: 18,
    shadowColor: "#2d6a4f",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 9,
    marginBottom: 22,
  },

  addButtonTouchable: {
    paddingVertical: 16,
    alignItems: "center",
  },

  addText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  emptyBox: {
    marginTop: 80,
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  empty: {
    fontSize: 16,
    color: "#345e4f",
  },

  card: {
    padding: 20,
    marginVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    shadowColor: "#74c69d",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 10,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1b4332",
    marginBottom: 6,
  },

  cardCategory: {
    fontSize: 14,
    color: "#2d6a4f",
  },

  cardDesc: {
    fontSize: 14,
    color: "#444",
    marginTop: 8,
  },
});
