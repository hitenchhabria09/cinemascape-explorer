import { User, AuthState, Movie } from '@/types/movie';

const AUTH_STORAGE_KEY = 'movie_explorer_auth';

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - in real app, this would be an API call
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const user: User = {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0],
      token: `mock_token_${Date.now()}`,
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  register: async (email: string, password: string, name: string): Promise<User> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const user: User = {
      id: Date.now().toString(),
      email,
      name,
      token: `mock_token_${Date.now()}`,
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  getCurrentUser: (): User | null => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    return !!authService.getCurrentUser();
  },
};

export const favoritesService = {
  FAVORITES_KEY: 'movie_explorer_favorites',

  getFavorites: (): Movie[] => {
    try {
      const stored = localStorage.getItem(favoritesService.FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  addToFavorites: (movie: Movie): void => {
    const favorites = favoritesService.getFavorites();
    const isAlreadyFavorite = favorites.some(fav => fav.id === movie.id);
    
    if (!isAlreadyFavorite) {
      favorites.push(movie);
      localStorage.setItem(favoritesService.FAVORITES_KEY, JSON.stringify(favorites));
    }
  },

  removeFromFavorites: (movieId: number): void => {
    const favorites = favoritesService.getFavorites();
    const updatedFavorites = favorites.filter(fav => fav.id !== movieId);
    localStorage.setItem(favoritesService.FAVORITES_KEY, JSON.stringify(updatedFavorites));
  },

  isFavorite: (movieId: number): boolean => {
    const favorites = favoritesService.getFavorites();
    return favorites.some(fav => fav.id === movieId);
  },
};