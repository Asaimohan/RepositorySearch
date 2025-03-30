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
  const [page, setPage] = useState(1); // Track current page
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true); // Track if more results are available

  const fetchResults = async (newSearch = false) => {
    if (loading || (loadingMore && !newSearch)) return;

    try {
      setError('');
      if (newSearch) {
        setLoading(true);
        setPage(1);
        setResults([]);
      } else {
        setLoadingMore(true);
      }

      const response = await axios.get(`https://api.github.com/search/repositories`, {
        params: { q: query, page: newSearch ? 1 : page, per_page: 10 },
      });

      const newResults = response.data.items || [];
      setResults((prev) => (newSearch ? newResults : [...prev, ...newResults]));

      // GitHub API typically provides up to 1000 results, but check if fewer results are returned
      setHasMore(newResults.length > 0);
      if (newSearch) setPage(2);
      else setPage((prev) => prev + 1);
    } catch (err) {
      setError('Failed to fetch repositories. Please check your connection.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSearch = () => fetchResults(true);

  const fetchMoreResults = () => {
    if (hasMore && !loading && !loadingMore) {
      fetchResults(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
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
          <Button title="View Details" onPress={() => navigation.navigate('Details', { repoId: item.id })} />
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
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={renderItem}
        onEndReached={fetchMoreResults} // Fetch more when user scrolls near bottom
        onEndReachedThreshold={0.5} // Trigger when 50% from bottom
        ListFooterComponent={loadingMore ? <ActivityIndicator size="small" style={styles.loader} /> : null}
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
    backgroundColor: '#ddd',
  },
  repoName: { fontWeight: 'bold' },
  repoDescription: { color: '#555' },
  error: { color: 'red', marginTop: 8 },
  loader: { marginTop: 10, alignSelf: 'center' },
});

