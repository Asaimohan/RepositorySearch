import React from 'react';
import { View, Text, FlatList, Image, Button, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { LinearGradient } from 'expo-linear-gradient';

type FavoritesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Favorites'>;

export default function FavoritesScreen() {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const favorites = useSelector((state: RootState) => state.favorites.favorites);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.owner.avatar_url }} style={styles.avatar} />
      <View style={{ flex: 1,gap:5 }}>
        <Text style={styles.repoName}>{item.name}</Text>
        <Text style={styles.repoDescription}>{item.description}</Text>
        <Button
          title="View Details"
          onPress={() => navigation.navigate('Details', { repoId: item.id })}
        />
      </View>
    </View>
  );

  if (favorites.length === 0) {
    return (
      <LinearGradient
        colors={["#8f87f1", "#c68efd", "#e2a8f5", "#fed2e2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.container}>
          <Text style={styles.noFavoritesText}>No favorites yet!</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#8f87f1", "#c68efd", "#e2a8f5", "#fed2e2"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Text style={styles.title}>My Favorites</Text>
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  itemContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'center',
    
  },
  avatar: { width: 50, height: 50, marginRight: 8, borderRadius: 25 },
  repoName: { fontWeight: 'bold' },
  repoDescription: { color: '#555' },
  noFavoritesText: { fontSize: 18, fontWeight: 'bold',textAlign:'center' },
});
