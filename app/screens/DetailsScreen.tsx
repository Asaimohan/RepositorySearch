import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../store/favoritesSlice';
import type { RootState } from '../store';
import axios from 'axios';

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

export default function DetailsScreen() {
  const route = useRoute<DetailsScreenRouteProp>();
  const { repoId } = route.params;
  const dispatch = useDispatch();
  
  const [repo, setRepo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRepoDetails = async () => {
      try {
        const response = await axios.get(`https://api.github.com/repositories/${repoId}`);
        setRepo(response.data);
      } catch (err) {
        setError('Failed to load repository details.');
      } finally {
        setLoading(false);
      }
    };

    fetchRepoDetails();
  }, [repoId]);

  const favorites = useSelector((state: RootState) => state.favorites.favorites);
  const isFavorite = repo ? favorites.some((r) => r.id === repo.id) : false;

  const handleToggleFavorite = () => {
    if (repo) {
      dispatch(toggleFavorite(repo));
    }
  };

  if (loading) return <ActivityIndicator size="large" style={styles.loader} />;
  if (error) return <Text style={styles.error}>{error}</Text>;
  if (!repo) return <Text style={styles.error}>Repository not found.</Text>;

  return (
    <View style={styles.container}>
      <Image source={{ uri: repo.owner.avatar_url }} style={styles.avatar} />
      <Text style={styles.title}>{repo.name}</Text>
      <Text>{repo.description || 'No description available'}</Text>
      <Text>⭐ Stars: {repo.stargazers_count}</Text>
      <Text>🍴 Forks: {repo.forks_count}</Text>
      <Text>🖥 Language: {repo.language || 'N/A'}</Text>
      <Text>👤 Owner: {repo.owner.login}</Text>
      <Button
        title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        onPress={handleToggleFavorite}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  loader: { marginTop: 20 },
  error: { color: 'red', textAlign: 'center', marginTop: 10 },
});
