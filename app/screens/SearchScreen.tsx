import React, { useState } from 'react';
import {
  View, TextInput, Button, FlatList, Image, StyleSheet, ActivityIndicator,
  Text, Alert, TouchableOpacity
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../navigation/AppNavigator';
import Header from '../components/Header';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeProvider';

type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Search'>;

export default function SearchScreen() {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const { darkMode, toggleTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

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
      setHasMore(newResults.length > 0);
      if (newSearch) setPage(2);
      else setPage((prev) => prev + 1);
    } catch (err: any) {
      console.error("API Error:", err);

      if (err.response) {
        setError(`GitHub API Error: ${err.response.data.message || 'Something went wrong'}`);
      } else if (err.request) {
        setError('Network error: Unable to connect to GitHub. Please check your internet connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSearch = () => {
    if (!query.trim()) {
      Alert.alert('Input Required', 'Please enter a search term.');
      setResults([]);
      setHasMore(true);
      return;
    }
    fetchResults(true);
  };

  const fetchMoreResults = () => {
    if (hasMore && !loading && !loadingMore) {
      fetchResults(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const owner = item.owner || { avatar_url: '', login: 'Unknown' };

    return (
      <View style={[styles.itemContainer, darkMode && styles.itemContainerDark]}>
        {owner.avatar_url ? (
          <Image source={{ uri: owner.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}
        <View style={{ flex: 1 }}>
          <Text style={[styles.repoName, darkMode && styles.repoNameDark]}>{item.name}</Text>
          <Text style={[styles.repoDescription, darkMode && styles.repoDescriptionDark]}>
            {item.description || 'No description available'}
          </Text>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => navigation.navigate('Details', { repoId: item.id })}
          >
            <Text style={styles.detailsButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, darkMode && styles.containerDark]}>
      <LinearGradient
        colors={darkMode ? ['#2a2a2a', '#1e1e1e'] : ['#8f87f1', '#c68efd', '#e2a8f5', '#fed2e2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Header />

      </LinearGradient>

      <TouchableOpacity onPress={toggleTheme} style={styles.toggleButton}>
        <MaterialIcons name={darkMode ? 'dark-mode' : 'light-mode'} size={28} color={darkMode ? '#fff' : '#333'} />
      </TouchableOpacity>


      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.icon} />
        <TextInput
          style={[styles.input, darkMode && styles.inputDark]}
          placeholder="Search repositories..."
          placeholderTextColor={darkMode ? '#aaa' : '#888'}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={() => navigation.navigate('Favorites')} style={styles.buttonContainer}>
          <FontAwesome name="heart" size={30} color="#E63946" />
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" style={styles.loader} />}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Try Again" onPress={handleSearch} />
        </View>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={renderItem}
        onEndReached={fetchMoreResults}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <ActivityIndicator size="small" style={styles.loader} /> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({

  containerDark: { backgroundColor: '#121212' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderWidth: 1.5,
    borderColor: '#C0C0C0',
  },
  input: { flex: 1, fontSize: 16, color: '#333' },
  inputDark: { color: '#fff', backgroundColor: '#333' },
  toggleButton: {
    marginTop: -70,
    alignItems: 'center',
    alignSelf: 'flex-end',

    padding: 10,
    borderRadius: 20,

  },
  toggleText: { marginLeft: 8, fontSize: 16, color: '#333' },
  toggleTextDark: { color: 'black' },
  itemContainer: { flexDirection: 'row', padding: 10, borderRadius: 8, backgroundColor: '#fff' },
  itemContainerDark: { backgroundColor: '#1e1e1e' },
  repoName: { fontWeight: 'bold', color: '#333' },
  repoNameDark: { color: '#fff' },
  repoDescription: { color: '#555' },
  repoDescriptionDark: { color: '#ccc' },
  loader: { marginTop: 10, alignSelf: 'center' },
  gradient: {
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    overflow: 'hidden',
    height: 215,


    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,


    elevation: 6,
  },

  container: { flex: 1, padding: 16 },


  detailsButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  detailsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  icon: {
    marginRight: 8,
  },

  avatar: { width: 50, height: 50, marginRight: 8, borderRadius: 25 },
  avatarPlaceholder: {
    width: 70,
    height: 60,
    marginRight: 8,
    borderRadius: 25,
    backgroundColor: '#ddd',
  },

  errorContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    borderRadius: 8,
    alignItems: 'center',
  },
  favoritesButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 10,
  },
  gradientButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },

  favoritesButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: { color: 'red', marginBottom: 8 },

});

