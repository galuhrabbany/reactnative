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
        style={{ flex: 1 }}
      >
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.container}
          renderSectionHeader={({ section: { title } }) => (
            <LinearGradient
              colors={["rgba(216,243,220,0.7)", "rgba(82,183,136,0.5)"]}
              style={styles.headerCard}
            >
              <Text style={styles.headerCardText}>{title}</Text>
            </LinearGradient>
          )}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <LinearGradient
                colors={["rgba(216,243,220,0.6)", "rgba(82,183,136,0.3)"]}
                style={styles.card}
              >
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardCategory}>{item.category}</Text>
                <Text style={styles.cardAddress}>{item.address}</Text>

                <View style={styles.detailRow}>
                  <MaterialIcons
                    name="location-pin"
                    size={16}
                    color="#003d33"
                  />
                  <Text style={styles.cardDetail}>
                    {item.latitude}, {item.longitude}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <MaterialIcons name="gps-fixed" size={16} color="#003d33" />
                  <Text style={styles.cardDetail}>{item.accuracy || "-"}</Text>
                </View>

                <View style={styles.infoRowSingle}>
                  <MaterialIcons name="access-time" size={16} color="#003d33" />
                  <Text style={styles.infoText}>{item.open_hours}</Text>
                </View>

                <View style={styles.infoRowSingle}>
                  <MaterialIcons
                    name="attach-money"
                    size={16}
                    color="#003d33"
                  />
                  <Text style={styles.infoText}>{item.price_range}</Text>
                </View>

                <View style={styles.infoRowSingle}>
                  <MaterialIcons name="star" size={16} color="#FFD700" />
                  <Text style={styles.infoText}>{item.menu_top}</Text>
                </View>

                <View style={styles.actionsInsideCard}>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: "#4caf50" }]}
                    onPress={() => handleEdit(item)}
                  >
                    <MaterialIcons name="edit" size={20} color="#fff" />
                    <Text style={styles.actionText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: "#ff5252" }]}
                    onPress={() => handleDelete(item.id)}
                  >
                    <MaterialIcons name="delete" size={20} color="#fff" />
                    <Text style={styles.actionText}>Hapus</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: "#00bcd4" }]}
                    onPress={() =>
                      openInMaps(item.name, item.latitude, item.longitude)
                    }
                  >
                    <MaterialIcons name="map" size={20} color="#fff" />
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
  container: {
    paddingBottom: 30,
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  headerCard: {
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 24,
  },

  headerCardText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#003d33",
    textAlign: "center",
  },

  cardWrapper: {
    marginHorizontal: 16,
    marginVertical: 8,
  },

  card: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#52b788",
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#145c3d",
    marginBottom: 2,
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
    marginBottom: 8,
  },

  cardDetail: {
    fontSize: 13,
    color: "#2d6a4f",
    marginLeft: 4,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  infoRowSingle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  infoText: {
    fontSize: 13,
    color: "#2d6a4f",
    fontWeight: "600",
    marginLeft: 6,
  },

  actionsInsideCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },

  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },

  actionText: {
    color: "#fff",
    fontSize: 13,
    marginLeft: 6,
    fontWeight: "600",
  },
});
