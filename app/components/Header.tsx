import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

const Header = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.top}>Welcome to</Text>
        <MaskedView maskElement={<Text style={styles.title}>GitHub Explorer</Text>}>
          <LinearGradient
            colors={["#FF6B00", "#FF006E", "#9B00E8", "#0057FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={[styles.title, styles.hiddenText]}>GitHub Explorer</Text>
          </LinearGradient>
        </MaskedView>
        <Text style={styles.subtitle}>Search and save your favorite repositories</Text>
      </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  top: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  title: {
    fontSize: 45,
    fontWeight: 'bold',
    textAlign: 'center',
    // textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 15,
  },
  hiddenText: {
    opacity: 0,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
});