import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {StyleSheet, Text, View, SectionList, StatusBar} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const DATA = [
  {
    title: 'Kelas A',
    data: ['Cece', 'Angel', 'Myla', 'Jagung', 'Fairuz', 'Nanda'],
  },
  {
    title: 'Kelas B',
    data: ['Galuh', 'Atika', 'Meiva', 'Zahra', 'Alifah', 'Zidni'],
  },
  {
    title: 'Asisten',
    data: ['Hayyu', 'Rini', 'Veronica', 'Syaiful'],
  },
];

const App = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container} edges={['top']}>
      <SectionList
        sections={DATA}
        keyExtractor={(item, index) => item + index}
        renderItem={({item}) => (
          <View style={styles.item}>
            <Text style={styles.title}>
                <MaterialIcons name="person" size={24} color="black" />
                {item}</Text>
          </View>
        )}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.header}>{title}</Text>
        )}
      />
    </SafeAreaView>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    marginHorizontal: 16,
    marginVertical: 10,
  },
  item: {
    backgroundColor: '#e61515ff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  header: {
    fontSize: 20,
    backgroundColor: '#d7b3b3ff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 15,
  },
});

export default App;