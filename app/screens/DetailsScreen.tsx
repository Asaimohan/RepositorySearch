import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../store/favoritesSlice';
import type { RootState } from '../store';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeProvider';


type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

export default function DetailsScreen() {
  const route = useRoute<DetailsScreenRouteProp>();
  const { repoId } = route.params;
  const dispatch = useDispatch();
  const { darkMode } = useTheme();

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
      setContributors(response.data.slice(0, 10));
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
    <ScrollView style={[styles.container, darkMode && styles.darkContainer]}>
      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : error ? (
        <Text style={[styles.error, darkMode && styles.darkText]}>{error}</Text>
      ) : repo ? (
        <View>
          <Image source={{ uri: repo.owner.avatar_url }} style={styles.avatar} />
          <Text style={[styles.title, darkMode && styles.darkText]}>{repo.name}</Text>

          <View style={[styles.card, darkMode && styles.darkCard]}>
            <Text style={[styles.description, darkMode && styles.darkText]}>{repo.description || 'No description available'}</Text>
            <Text style={[styles.info, darkMode && styles.darkText]}>⭐ Stars: {repo.stargazers_count}</Text>
            <Text style={[styles.info, darkMode && styles.darkText]}>🍴 Forks: {repo.forks_count}</Text>
            <Text style={[styles.info, darkMode && styles.darkText]}>🖥 Language: {repo.language || 'N/A'}</Text>
            <Text style={[styles.info, darkMode && styles.darkText]}>👤 Owner: {repo.owner.login}</Text>
            <Text style={[styles.info, darkMode && styles.darkText]}>📅 Created: {new Date(repo.created_at).toDateString()}</Text>
            <Text style={[styles.info, darkMode && styles.darkText]}>🔄 Last Updated: {new Date(repo.updated_at).toDateString()}</Text>
            <TouchableOpacity style={styles.heartIcon} onPress={handleToggleFavorite}>
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={40}
                color={isFavorite ? 'red' : darkMode ? 'white' : 'black'}
              />
            </TouchableOpacity>
          </View>

          <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>Top Contributors:</Text>
          {loadingContributors ? (
            <ActivityIndicator size="small" style={styles.loader} />
          ) : (
            <FlatList
              data={contributors}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={[styles.contributorCard, darkMode && styles.darkCard]}>
                  <Image source={{ uri: item.avatar_url }} style={styles.contributorAvatar} />
                  <Text style={[styles.contributorName, darkMode && styles.darkText]}>{item.login}</Text>
                </View>
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          )}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20,backgroundColor:'white' },
  darkContainer: { backgroundColor: '#121212' },
  avatar: { width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginBottom: 16 },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', color: '#333' },
  darkText: { color: '#fff' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, elevation: 4, marginTop: 20 },
  darkCard: { backgroundColor: '#1e1e1e' },
  description: { fontSize: 16, marginBottom: 8, color: '#444', paddingRight: 50, fontWeight: 'bold' },
  info: { fontSize: 16, color: '#555', marginVertical: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginVertical: 15 },
  contributorCard: { backgroundColor: '#fff',borderWidth:2,borderColor: '#C0C0C0', padding: 10, borderRadius: 12, alignItems: 'center', marginRight: 10, width: 130, elevation: 3 },
  contributorAvatar: { width: 70, height: 70, borderRadius: 30, marginBottom: 6 },
  contributorName: { fontSize: 14, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  heartIcon: { position: 'absolute', top: 20, right: 20, zIndex: 1, },
  loader: { marginTop: 20, alignSelf: 'center' },
  error: { color: 'red', textAlign: 'center', marginTop: 10, fontSize: 16 },
});
