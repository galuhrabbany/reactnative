import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import MapView, { Marker, Callout, MapType } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router } from "expo-router";

type MarkerType = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

const GOOGLE_MAPS_APIKEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Ganti dengan key Anda

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

export default function MapScreen() {
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [mapType, setMapType] = useState<MapType>("standard");
  const [selectedMarker, setSelectedMarker] = useState<MarkerType | null>(null);

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    // Get user location
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Cannot access location");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // Pindahkan map ke lokasi pengguna saat pertama load
      mapRef.current?.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.01,
      });
    })();

    const restoRef = ref(db, "resto_locations/");

    const unsubscribe = onValue(
      restoRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const parsedMarkers: MarkerType[] = Object.keys(data)
            .map((key) => {
              const item = data[key];
              const lat = parseFloat(item.latitude);
              const long = parseFloat(item.longitude);
              if (isNaN(lat) || isNaN(long)) return null;
              return { id: key, name: item.name, latitude: lat, longitude: long };
            })
            .filter((m): m is MarkerType => m !== null);

          setMarkers(parsedMarkers);
        } else setMarkers([]);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const openDirections = (lat: number, long: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${long}`;
    Linking.openURL(url);
  };

  const toggleMapType = () => {
    setMapType((prev) =>
      prev === "standard" ? "satellite" : prev === "satellite" ? "hybrid" : "standard"
    );
  };

  const goToUserLocation = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.01,
      });
    }
  };

  if (loading || !userLocation) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Loading map data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.01,
        }}
        mapType={mapType}
        showsUserLocation
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            onPress={() => setSelectedMarker(marker)}
          >
            <Callout tooltip>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{marker.name}</Text>
                <TouchableOpacity
                  style={styles.calloutBtn}
                  onPress={() => openDirections(marker.latitude, marker.longitude)}
                >
                  <MaterialIcons name="directions" size={20} color="#fff" />
                  <Text style={styles.calloutBtnText}>Rute</Text>
                </TouchableOpacity>
              </View>
            </Callout>
          </Marker>
        ))}

        {selectedMarker && userLocation && (
          <MapViewDirections
            origin={userLocation}
            destination={{ latitude: selectedMarker.latitude, longitude: selectedMarker.longitude }}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={4}
            strokeColor="#00bcd4"
            mode="DRIVING"
          />
        )}
      </MapView>

      {/* FAB untuk tambah lokasi */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push("/forminputlocation")}>
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>

      {/* Tombol map type */}
      <TouchableOpacity style={styles.mapTypeBtn} onPress={toggleMapType}>
        <MaterialIcons name="layers" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Tombol home / lokasi pengguna */}
      <TouchableOpacity style={styles.homeBtn} onPress={goToUserLocation}>
        <MaterialIcons name="my-location" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  map: { width: "100%", height: "100%" },
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  callout: {
    width: 160,
    backgroundColor: "rgba(0,0,0,0.85)",
    borderRadius: 10,
    padding: 8,
    alignItems: "center",
  },
  calloutTitle: { color: "#fff", fontWeight: "700", marginBottom: 6, textAlign: "center" },
  calloutBtn: {
    flexDirection: "row",
    backgroundColor: "#00bcd4",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
  },
  calloutBtnText: { color: "#fff", marginLeft: 4, fontWeight: "600" },
});
