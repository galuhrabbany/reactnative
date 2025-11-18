import React from "react";
import { StyleSheet, TextInput, Button, Alert, View, Text} from "react-native";
import { Stack } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

const TextInputExample = () => {
  const [text, onChangeText] = React.useState("Useless Text");
  const [number, onChangeNumber] = React.useState("");

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Stack.Screen options={{ title: 'Form Input' }} />
        <Text style={styles.label}>Nama</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          placeholder="Masukkan Nama"
        />
        <Text style={styles.label}>Nomor Induk Mahasiswa</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          placeholder="Masukkan NIM"
        />
        <Text style={styles.label}>Kelas</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          placeholder="Masukkan Kelas"
        />
      <View style={styles.button}>
          <Button title="Save" color="#e40f0fff" />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    color: "red",
    borderColor: "white",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20, // kasih jarak dari sisi kiri-kanan
  },
  button: {
    marginHorizontal: 12, // jarak kiri-kanan tombol
    marginTop: 10,
  },
  label: {
    color: "#eaeff5ff",
    fontWeight: "bold",
    marginLeft: 12,
    marginTop: 10,
  },
});

export default TextInputExample;
