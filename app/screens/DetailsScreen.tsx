import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../store/favoritesSlice';
import type { RootState } from '../store';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

export default function DetailsScreen() {
  const route = useRoute<DetailsScreenRouteProp>();
  const { repoId } = route.params;
  const dispatch = useDispatch();
  
  const [repo, setRepo] = useState<any>(null);
  const [contributors, setContributors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingContributors, setLoadingContributors] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchRepoDetails = async () => {
      try {
        const response = await axios.get(`https://api.github.com/repositories/${repoId}`);
        setRepo(response.data);

        // Fetch contributors
        fetchContributors(response.data.owner.login, response.data.name);
      } catch (err) {
        setError('Failed to load repository details.');
      } finally {
        setLoading(false);
      }
    };

    fetchRepoDetails();
  }, [repoId]);

  const fetchContributors = async (owner: string, repoName: string) => {
    try {
      const response = await axios.get(`https://api.github.com/repos/${owner}/${repoName}/contributors`);
      setContributors(response.data.slice(0, 5)); // Get top 5 contributors
    } catch (err) {
      console.error('Error fetching contributors:', err);
    } finally {
      setLoadingContributors(false);
    }
  };

  const favorites = useSelector((state: RootState) => state.favorites.favorites);
  const isFavorite = repo ? favorites.some((r) => r.id === repo.id) : false;

  const handleToggleFavorite = () => {
    if (repo) {
      dispatch(toggleFavorite(repo));
    }
  };

  return (
    <LinearGradient
      colors={["#8f87f1", "#c68efd", "#e2a8f5", "#fed2e2"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" style={styles.loader} />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : !repo ? (
          <Text style={styles.error}>Repository not found.</Text>
        ) : (
          <>
            <Image source={{ uri: repo.owner.avatar_url }} style={styles.avatar} />
            <Text style={styles.title}>{repo.name}</Text>
            <Text style={styles.description}>{repo.description || 'No description available'}</Text>
            <Text style={styles.info}>⭐ Stars: {repo.stargazers_count}</Text>
            <Text style={styles.info}>🍴 Forks: {repo.forks_count}</Text>
            <Text style={styles.info}>🖥 Language: {repo.language || 'N/A'}</Text>
            <Text style={styles.info}>👤 Owner: {repo.owner.login}</Text>
            <Text style={styles.info}>📅 Created: {new Date(repo.created_at).toDateString()}</Text>
            <Text style={styles.info}>🔄 Last Updated: {new Date(repo.updated_at).toDateString()}</Text>

           

            {/* Contributors Section */}
            <Text style={styles.sectionTitle}>Top Contributors:</Text>
            {loadingContributors ? (
              <ActivityIndicator size="small" style={styles.loader} />
            ) : contributors.length > 0 ? (
              <FlatList
                data={contributors}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.contributor}>
                    <Image source={{ uri: item.avatar_url }} style={styles.contributorAvatar} />
                    <Text style={styles.contributorName}>{item.login}</Text>
                    
                  </View>
                  
                )}
              />
            ) : (
              <Text style={styles.info}>No contributors found.</Text>
            )}
          </>
        )}
         
      </View>
      <TouchableOpacity 
  style={[styles.button, isFavorite ? styles.removeButton : styles.addButton]} 
  onPress={handleToggleFavorite}
>
  <Text style={styles.buttonText}>
    {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
  </Text>
</TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  
  container: { flex: 1, padding: 20,gap:10  },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 16,alignSelf:'center'},
  title: { fontSize: 27, fontWeight: 'bold', marginBottom: 8, color: '#fff' },
  description: { fontSize: 16, marginBottom: 8, color: '#f8f8f8', fontWeight:'bold' },
  info: { fontSize: 16, color: '#fff', marginVertical: 4 },
  loader: { marginTop: 20 },
  error: { color: 'red', textAlign: 'center', marginTop: 10, fontSize: 16 },

  button: {
    paddingVertical: 12,
   
    borderRadius: 10, // Rounded corners
    alignItems: 'center',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#007AFF', // Blue color for "Add to Favorites"
  },
  removeButton: {
    backgroundColor: '#FF3B30', // Red color for "Remove from Favorites"
  },
  buttonText: {
    color: '#FFF', // White text
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginTop: 20 },
  contributor: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    width: '90%',
  },
  contributorAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  contributorName: { fontSize: 16, color: '#fff' },
  
});
