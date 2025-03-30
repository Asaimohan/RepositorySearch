import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export type Repository = {
  id: number;
  name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  stargazers_count: number;
  forks_count: number;
  language: string | null;
};

interface RepositoryItemProps {
  repository: Repository;
  onPress: () => void;
}

const RepositoryItem: React.FC<RepositoryItemProps> = ({ repository, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: repository.owner.avatar_url }} style={styles.avatar} />
      <View style={styles.content}>
        <Text style={styles.name}>{repository.name}</Text>
        {repository.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {repository.description}
          </Text>
        ) : (
          <Text style={styles.description}>No description provided.</Text>
        )}
        <View style={styles.stats}>
          <Text style={styles.stat}>Stars: {repository.stargazers_count}</Text>
          <Text style={styles.stat}>Forks: {repository.forks_count}</Text>
        </View>
        <Text style={styles.language}>
          Language: {repository.language || 'N/A'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default RepositoryItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    color: '#555',
    marginBottom: 4,
  },
  stats: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  stat: {
    marginRight: 12,
    color: '#333',
  },
  language: {
    fontStyle: 'italic',
    color: '#888',
  },
});

