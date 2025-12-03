import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from "react-native";

import MapView, { Marker, MapType, Region } from "react-native-maps";
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";

type MarkerType = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

const firebaseConfig = {
  apiKey: "AIzaSyAYESvyzOj8rPJkOE2qn94Pm4czkb4PJLY",
  authDomain: "reactnative-pgpbl2025.firebaseapp.com",
  databaseURL: "https://reactnative-pgpbl2025-default-rtdb.firebaseio.com",
  projectId: "reactnative-pgpbl2025",
  storageBucket: "reactnative-pgpbl2025.firebasestorage.app",
  messagingSenderId: "770495428833",
  appId: "1:770495428833:web:fe9c779fec09a1b0791fa0",
};

// ✅ cegah firebase double initialize
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

export default function MapScreen() {
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<Region | null>(null);
  const [mapType, setMapType] = useState<MapType>("standard");

  const mapRef = useRef<MapView>(null);

  // ✅ ambil parameter dari lokasi.tsx (kalau ada)
  const { latitude, longitude, name } = useLocalSearchParams();

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          Alert.alert("Izin ditolak", "Aplikasi membutuhkan akses lokasi");
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const region: Region = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.01,
        };

        setUserLocation(region);

        setTimeout(() => {
          mapRef.current?.animateToRegion(region, 1000);
        }, 500);
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Gagal mengambil lokasi");
      }
    };

    getUserLocation();

    // 🔥 Ambil data dari Firebase
    const restoRef = ref(db, "resto_locations/");

    const unsubscribe = onValue(restoRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const parsedMarkers: MarkerType[] = Object.keys(data)
          .map((key) => {
            const item = data[key];
            const lat = parseFloat(item.latitude);
            const lng = parseFloat(item.longitude);

            if (isNaN(lat) || isNaN(lng)) return null;

            return {
              id: key,
              name: item.name ?? "Unknown",
              latitude: lat,
              longitude: lng,
            };
          })
          .filter((m): m is MarkerType => m !== null);

        setMarkers(parsedMarkers);
      } else {
        setMarkers([]);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      const region: Region = {
        latitude: parseFloat(latitude as string),
        longitude: parseFloat(longitude as string),
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };

      setTimeout(() => {
        mapRef.current?.animateToRegion(region, 900);
      }, 500);
    }
  }, [latitude, longitude]);

  // ✅ Buka Google Maps Navigation sesuai nama titik
  const openDirections = (lat: number, lng: number, name: string) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${encodeURIComponent(name)}@${lat},${lng}`,
      android: `google.navigation:q=${lat},${lng}(${encodeURIComponent(name)})`,
    });

    if (url) {
      Linking.openURL(url).catch((err) => {
        console.error("Gagal membuka maps:", err);
        Alert.alert("Error", "Tidak dapat membuka Google Maps");
      });
    }
  };

  const toggleMapType = () => {
    setMapType((prev) =>
      prev === "standard"
        ? "satellite"
        : prev === "satellite"
        ? "hybrid"
        : "standard"
    );
  };

  const goToUserLocation = () => {
    if (!userLocation) return;

    mapRef.current?.animateToRegion(
      {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.01,
      },
      1000
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Memuat peta...</Text>
      </View>
    );
  }

  if (!userLocation) {
    return (
      <View style={styles.container}>
        <Text>Membaca data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={userLocation}
        mapType={mapType}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.name}
            description="Ketuk untuk navigasi"
            onPress={() =>
              openDirections(marker.latitude, marker.longitude, marker.name)
            }
          />
        ))}
      </MapView>

      {/* Tambah lokasi */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/forminputlocation")}
      >
        <FontAwesome name="plus" size={22} color="white" />
      </TouchableOpacity>

      {/* Ganti map type */}
      <TouchableOpacity style={styles.mapTypeBtn} onPress={toggleMapType}>
        <MaterialIcons name="layers" size={22} color="white" />
      </TouchableOpacity>

      {/* Fokus ke user */}
      <TouchableOpacity style={styles.homeBtn} onPress={goToUserLocation}>
        <MaterialIcons name="my-location" size={22} color="white" />
      </TouchableOpacity>
    </View>
  );
}

// ================= STYLE =================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    left: 20,
    bottom: 20,
    backgroundColor: "#4caf50",
    borderRadius: 28,
    elevation: 8,
  },
  mapTypeBtn: {
    position: "absolute",
    width: 50,
    height: 50,
    right: 20,
    bottom: 20,
    backgroundColor: "#4caf50",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },
  homeBtn: {
    position: "absolute",
    width: 50,
    height: 50,
    right: 20,
    bottom: 90,
    backgroundColor: "#4caf50",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },
});
