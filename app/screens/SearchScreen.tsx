import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Image, StyleSheet, ActivityIndicator, Text, Alert, SafeAreaView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../navigation/AppNavigator';
import Header from '../components/Header';
import { Ionicons } from '@expo/vector-icons';

type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Search'>;

export default function SearchScreen() {
  const navigation = useNavigation<SearchScreenNavigationProp>();
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
      <View style={styles.itemContainer}>
        {owner.avatar_url ? (
          <Image source={{ uri: owner.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.repoName}>{item.name}</Text>
          <Text style={styles.repoDescription}>{item.description || 'No description available'}</Text>
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
    <LinearGradient
      colors={["#8f87f1", "#c68efd", "#e2a8f5", "#fed2e2"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Header />


        <View style={styles.searchcontainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Search repositories..."
            placeholderTextColor="#888"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}

          />
        </View>
        
        {loading && <ActivityIndicator size="large" style={styles.loader} />}

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Button title="Try Again" onPress={handleSearch} />
          </View>
        ) : null}

        <FlatList
          data={results}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={renderItem}
          onEndReached={fetchMoreResults}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loadingMore ? <ActivityIndicator size="small" style={styles.loader} /> : null}
        />

<TouchableOpacity onPress={() => navigation.navigate('Favorites')} style={styles.buttonContainer}>
  <LinearGradient
    colors={[ 'white',"#2980B9","#6DD5FA"]} 
    start={{ x: 1, y: 1 }}
    end={{ x: 0, y: 0 }}
    style={styles.gradientButton}
  >
    <Text style={styles.buttonText}>Go to Favorites</Text>
  </LinearGradient>
</TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, padding: 16 },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  searchcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 10,
    
    marginVertical: 10,
  },
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
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  itemContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 10,
    borderRadius: 8,
    height: 120, 
    overflow: 'hidden',
  
  },
  avatar: { width: 50, height: 50, marginRight: 8, borderRadius: 25 },
  avatarPlaceholder: {
    width: 70,
    height: 60,
    marginRight: 8,
    borderRadius: 25,
    backgroundColor: '#ddd',
  },
  repoName: { fontWeight: 'bold', color: '#333', },
  repoDescription: { color: '#555',flexShrink: 1, marginBottom:5
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
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  favoritesButtonText: {
    color: '#FFF', 
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: { color: 'red', marginBottom: 8 },
  loader: { marginTop: 10, alignSelf: 'center' },
});

