import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeProvider';

type FavoritesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Favorites'>;

export default function FavoritesScreen() {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const favorites = useSelector((state: RootState) => state.favorites.favorites);
  const { colors } = useTheme();

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.itemContainer, { backgroundColor: colors.card }]}>
      <Image source={{ uri: item.owner.avatar_url }} style={styles.avatar} />
      <View style={styles.repoDetails}>
        <Text style={[styles.repoName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.repoDescription, { color: colors.subText }]}>{item.description || 'No description available'}</Text>
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => navigation.navigate('Details', { repoId: item.id })}
        >
          <Text style={[styles.detailsButtonText, { color: colors.primary }]}>View Details</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.primary} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (favorites.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.noFavoritesText, { color: colors.text }]}>No favorites yet!</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>My Favorites</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  itemContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'center',
    padding: 12,
    borderRadius: 10
    ,borderWidth:1.5,borderColor: '#C0C0C0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: { width: 50, height: 50, marginRight: 12, borderRadius: 25 },
  repoDetails: { flex: 1 },
  repoName: { fontWeight: 'bold', fontSize: 16 },
  repoDescription: { fontSize: 14, marginVertical: 4 },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  detailsButtonText: { fontSize: 14, fontWeight: 'bold' },
  icon: { marginLeft: 5 },
  noFavoritesText: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginTop: 20 },
});