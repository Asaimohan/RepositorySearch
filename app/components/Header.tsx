import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';


const Header = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.top}>Welcome to</Text>
       <Text style={styles.title}>GitHub Explorer</Text>
          
        <Text style={styles.subtitle}>Search and save your favorite repositories</Text>
      </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    marginTop:50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  top: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  title: {
    fontSize: 45,
    fontWeight: 'bold',
    textAlign: 'center',
    color:'white',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 15,
  },
 
  subtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
});