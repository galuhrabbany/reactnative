import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

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

  const handleDelete = async (index: number) => {
    Alert.alert("Hapus Item", "Yakin ingin menghapus catatan kuliner ini?", [
      { text: "Batal" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          const updated = bookmarks.filter((_, i) => i !== index);
          setBookmarks(updated);
          await AsyncStorage.setItem("bookmarks", JSON.stringify(updated));
        },
      },
    ]);
  };

  return (
    <ImageBackground
      source={require("@/assets/images/bgbm.jpg")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(216,243,220,0.95)", "rgba(82,183,136,0.9)"]}
        style={styles.container}
      >
        <View style={styles.headerBox}>
          <Text style={styles.header}>Place To Go Yogyakarta</Text>
          <Text style={styles.subHeader}>Catatan Tempat Kuliner Pengguna</Text>
        </View>

        <TouchableOpacity onPress={() => router.push("/addFood")}>
          <LinearGradient
            colors={["#40916c", "#1b4332"]}
            style={styles.addButton}
          >
            <MaterialIcons name="add-circle" size={24} color="#fff" />
            <Text style={styles.addText}>Tambah Catatan</Text>
          </LinearGradient>
        </TouchableOpacity>

        {bookmarks.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>🍽️</Text>
            <Text style={styles.empty}>Belum ada catatan kuliner</Text>
          </View>
        ) : (
          <FlatList
            data={bookmarks}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: 40 }}
            renderItem={({ item, index }) => (
              <View style={styles.cardWrapper}>
                <LinearGradient
                  colors={[
                    "rgba(255,255,255,0.9)",
                    "rgba(255,255,255,0.65)",
                  ]}
                  style={styles.card}
                >
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(index)}
                  >
                    <MaterialIcons name="delete" size={24} color="#d00000" />
                  </TouchableOpacity>

                  <Text style={styles.cardTitle}>{item.nama}</Text>
                  <Text style={styles.cardCategory}>Kategori • {item.kategori}</Text>
                  <Text style={styles.cardDesc}>{item.desc}</Text>
                </LinearGradient>
              </View>
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
    paddingHorizontal: 18,
    paddingTop: 20,
  },

  headerBox: {
    alignItems: "center",
    marginBottom: 15,
  },

  header: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1b4332",
    textAlign: "center",
  },

  subHeader: {
    fontSize: 15,
    color: "#2d6a4f",
    textAlign: "center",
    marginTop: 4,
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 26,
    elevation: 8,
    shadowColor: "#1b4332",
  },

  addText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
    marginLeft: 8,
  },

  emptyBox: {
    marginTop: 90,
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  empty: {
    fontSize: 16,
    color: "#2d6a4f",
  },

  cardWrapper: {
    marginBottom: 14,
  },

  card: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
    elevation: 6,
    shadowColor: "#40916c",
  },

  deleteBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 4,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1b4332",
    marginBottom: 4,
  },

  cardCategory: {
    fontSize: 14,
    color: "#2d6a4f",
  },

  cardDesc: {
    fontSize: 14,
    color: "#333",
    marginTop: 6,
  },
});
