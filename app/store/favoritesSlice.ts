import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Repo {
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
}

interface FavoritesState {
  favorites: Repo[];
}

const initialState: FavoritesState = {
  favorites: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<Repo>) => {
      const existing = state.favorites.find((repo) => repo.id === action.payload.id);
      if (existing) {
        // remove if already favorited
        state.favorites = state.favorites.filter((repo) => repo.id !== action.payload.id);
      } else {
        // add if not favorited
        state.favorites.push(action.payload);
      }
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;

