import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  SectionList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Text,
} from "react-native";

import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, onValue, remove } from "firebase/database";

import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

/* ===================== TYPE ===================== */
type RestoItem = {
  id: string;
  name: string;
  category: string;
  address: string;
  latitude: string;
  longitude: string;
  accuracy?: string;
  open_hours: string;
  price_range: string;
  menu_top: string;
};

type SectionData = {
  title: string;
  data: RestoItem[];
};

/* ===================== FIREBASE ===================== */
const firebaseConfig = {
  apiKey: "AIzaSyAYESvyzOj8rPJkOE2qn94Pm4czkb4PJLY",
  authDomain: "reactnative-pgpbl2025.firebaseapp.com",
  databaseURL: "https://reactnative-pgpbl2025-default-rtdb.firebaseio.com",
  projectId: "reactnative-pgpbl2025",
  storageBucket: "reactnative-pgpbl2025.firebasestorage.app",
  messagingSenderId: "770495428833",
  appId: "1:770495428833:web:fe9c779fec09a1b0791fa0",
};

// Hindari double initialize
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

/* ===================== COMPONENT ===================== */
export default function LokasiScreen() {
  const router = useRouter();

  const [sections, setSections] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const openInMaps = (name: string, lat: string, long: string) => {
    router.push({
      pathname: "/gmap",
      params: {
        name,
        latitude: lat,
        longitude: long,
      },
    });
  };

  const handleEdit = (item: RestoItem) => {
    router.push({ pathname: "/formeditlocation", params: item });
  };

  const handleDelete = (id: string) => {
    Alert.alert("Hapus Data", "Yakin ingin menghapus restoran ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => remove(ref(db, `resto_locations/${id}`)),
      },
    ]);
  };

  /* ===================== GET DATA ===================== */
  useEffect(() => {
    const restoRef = ref(db, "resto_locations/");

    const unsubscribe = onValue(restoRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const array: RestoItem[] = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        setSections([{ title: "Restaurant Picks", data: array }]);
      } else {
        setSections([]);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 900);
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#40916c" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("@/assets/images/bgbm.jpg")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(216,243,220,0.9)", "rgba(82,183,136,0.8)"]}
        style={styles.wrapper}
      >
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.container}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeaderWrapper}>
              <Text style={styles.sectionTitle}>{title}</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <LinearGradient
                colors={["rgba(216,243,220,0.8)", "rgba(82,183,136,0.4)"]}
                style={styles.card}
              >
                <View style={styles.cardTopRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardCategory}>{item.category}</Text>
                    <Text style={styles.cardAddress}>{item.address}</Text>
                  </View>

                  <View style={styles.badgeWrapper}>
                    <MaterialIcons name="star" size={20} color="#FFD700" />
                    <Text style={styles.badgeText}>{item.menu_top}</Text>
                  </View>
                </View>

                <View style={styles.infoGrid}>
                  <View style={styles.infoBox}>
                    <MaterialIcons name="location-pin" size={16} color="#003d33" />
                    <Text style={styles.infoTextSmall}>
                      {item.latitude}, {item.longitude}
                    </Text>
                  </View>

                  <View style={styles.infoBox}>
                    <MaterialIcons name="gps-fixed" size={16} color="#003d33" />
                    <Text style={styles.infoTextSmall}>
                      {item.accuracy || "-"}
                    </Text>
                  </View>

                  <View style={styles.infoBox}>
                    <MaterialIcons name="access-time" size={16} color="#003d33" />
                    <Text style={styles.infoTextSmall}>{item.open_hours}</Text>
                  </View>

                  <View style={styles.infoBox}>
                    <MaterialIcons
                      name="attach-money"
                      size={16}
                      color="#003d33"
                    />
                    <Text style={styles.infoTextSmall}>{item.price_range}</Text>
                  </View>
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: "#4caf50" }]}
                    onPress={() => handleEdit(item)}
                  >
                    <MaterialIcons name="edit" size={18} color="#fff" />
                    <Text style={styles.actionText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: "#ff5252" }]}
                    onPress={() => handleDelete(item.id)}
                  >
                    <MaterialIcons name="delete" size={18} color="#fff" />
                    <Text style={styles.actionText}>Hapus</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: "#00bcd4" }]}
                    onPress={() =>
                      openInMaps(item.name, item.latitude, item.longitude)
                    }
                  >
                    <MaterialIcons name="map" size={18} color="#fff" />
                    <Text style={styles.actionText}>Maps</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          )}
        />
      </LinearGradient>
    </ImageBackground>
  );
}

/* ===================== STYLE ===================== */
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: 20,
  },

  container: {
    paddingBottom: 40,
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  sectionHeaderWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },

  sectionTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#003d33",
  },

  cardWrapper: {
    paddingHorizontal: 18,
    paddingVertical: 8,
  },

  card: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#52b788",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },

  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#145c3d",
    marginBottom: 4,
  },

  cardCategory: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1b4332",
    marginBottom: 4,
  },

  cardAddress: {
    fontSize: 13,
    color: "#2d6a4f",
  },

  badgeWrapper: {
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    height: 32,
  },

  badgeText: {
    marginLeft: 4,
    fontWeight: "600",
    color: "#003d33",
    fontSize: 13,
  },

  infoGrid: {
    marginTop: 8,
    marginBottom: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 20,
    rowGap: 8,
  },

  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    width: "45%",
  },

  infoTextSmall: {
    marginLeft: 6,
    fontSize: 13,
    color: "#003d33",
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  actionBtn: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
  },

  actionText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },
});
