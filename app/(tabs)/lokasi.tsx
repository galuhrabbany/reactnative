import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  SectionList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Linking, Alert,
} from "react-native";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type PointItem = {
  id: string;
  name: string;
  coordinates: string;
};

type SectionData = {
  title: string;
  data: PointItem[];
};

export default function LokasiScreen() {
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

  const [sections, setSections] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const handlePress = (coordinates: string) => {
    const [latitude, longitude] = coordinates
      .split(",")
      .map((coord) => coord.trim());
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  // if running on ios or android platform
  const handleDelete = (id: string) => {
    Alert.alert(
      "Hapus Lokasi",
      "Apakah Anda yakin ingin menghapus lokasi ini?",
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Hapus",
          onPress: () => {
            const pointRef = ref(db, `points/${id}`);
            remove(pointRef);
          },
          style: "destructive",
        },
      ]
    );
  };

  useEffect(() => {
    const pointsRef = ref(db, "points/");

    const unsubscribe = onValue(
      pointsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const pointsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));

          const formattedData = [
            {
              title: "Lokasi Tersimpan",
              data: pointsArray,
            },
          ];
          setSections(formattedData);
        } else {
          setSections([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <View style={styles.container}>
      {sections.length > 0 ? (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <TouchableOpacity
                style={styles.item}
                onPress={() => handlePress(item.coordinates)}
              >
                <ThemedText style={styles.itemName}>{item.name}</ThemedText>
                <ThemedText>{item.coordinates}</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                style={styles.deleteButton}
              >
                <MaterialIcons name="delete" size={28} color="red" />
              </TouchableOpacity>
            </View>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <ThemedText style={styles.header}>{title}</ThemedText>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <ThemedView style={styles.container}>
          <ThemedText>Tidak ada data lokasi tersimpan.</ThemedText>
        </ThemedView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    backgroundColor: "#f2f2f2",
  },

  // Row wrapper untuk item + delete icon
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // Card lokasi
  item: {
    backgroundColor: "#f64b4bff",
    padding: 16,
    marginVertical: 8,
    marginLeft: 16,
    borderRadius: 12,
    flex: 1,
  },

  itemName: {
    fontSize: 18,
    fontWeight: "bold",
  },

  header: {
    fontSize: 24,
    fontWeight: "bold",
    backgroundColor: "#000",
    color: "#fff",
    padding: 16,
  },

  deleteButton: {
    padding: 10,
    marginRight: 16,
  },
});
