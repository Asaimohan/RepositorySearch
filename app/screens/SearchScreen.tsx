import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Search'>;

export default function SearchScreen() {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setError('');
      setLoading(true);
      const response = await axios.get(`https://api.github.com/search/repositories?q=${query}`);
      setResults(response.data.items || []); // Ensure results default to an empty array
    } catch (err: any) {
      setError('Failed to fetch repositories. Please check your connection.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    // Ensure owner exists before accessing properties
    const owner = item.owner || { avatar_url: '', login: 'Unknown' };

    return (
      <View style={styles.itemContainer}>
        {owner.avatar_url ? (
          <Image source={{ uri: owner.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.repoName}>{item.name}</Text>
          <Text style={styles.repoDescription}>{item.description || 'No description available'}</Text>
          <Button
            title="View Details"
            onPress={() => navigation.navigate('Details', { repoId: item.id })}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GitHub Explorer</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for repositories..."
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
      />
      <Button title="Search" onPress={handleSearch} />
      {loading && <ActivityIndicator size="large" style={styles.loader} />}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()} // Fallback in case of missing id
        renderItem={renderItem}
      />
      <Button title="Go to Favorites" onPress={() => navigation.navigate('Favorites')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  itemContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'center',
  },
  avatar: { width: 50, height: 50, marginRight: 8, borderRadius: 25 },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    marginRight: 8,
    borderRadius: 25,
    backgroundColor: '#ddd', // Placeholder when no avatar exists
  },
  repoName: { fontWeight: 'bold' },
  repoDescription: { color: '#555' },
  error: { color: 'red', marginTop: 8 },
  loader: { marginTop: 10 },
});
