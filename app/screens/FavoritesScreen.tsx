import React from 'react';
import { View, Text, FlatList, Image, Button, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type FavoritesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Favorites'>;

export default function FavoritesScreen() {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const favorites = useSelector((state: RootState) => state.favorites.favorites);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.owner.avatar_url }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
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
      <View style={styles.container}>
        <Text>No favorites yet!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Favorites</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  itemContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'center',
  },
  avatar: { width: 50, height: 50, marginRight: 8, borderRadius: 25 },
  repoName: { fontWeight: 'bold' },
  repoDescription: { color: '#555' },
});

