import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#f8c8cfff', dark: '#eeb7bcff' }}
      headerImage={
        <Image
          source={require('@/assets/images/f1.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={ styles.title }>Selamat Datang!🏎️</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle" >Nama</ThemedText>
        <ThemedText>
          Galuh Ayu Cita Rabbany
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle" >NIM</ThemedText>
        <ThemedText>
          23/514562/SV/22380
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle" >Kelas</ThemedText>
        <ThemedText>
          B
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle" >Mata Kuliah</ThemedText>
        <ThemedText>
          Praktikum Pemrograman Geospasial: Perangkat Bergerak Lanjut 
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle" >Aplikasi</ThemedText>
        <ThemedText>
          Aplikasi ini dijalankan di perangkat <ThemedText type="defaultSemiBold">{Platform.select({
            ios: 'iOS',
            android: 'Android',
            web: 'web',
          })} </ThemedText> menggunakan React Native dan Expo.
        </ThemedText>
      </ThemedView>
      
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 158,
    width: 290,
    bottom: 0,
    top: 10,
    right: 0,
    left: 10,
    position: 'absolute'
  },
  title: { 
    color: 'pink',
    fontWeight: 'bold',
    fontSize: 32,
  },
});
