import { Movie, TMDBResponse, Genre } from '@/types/movie';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// We'll get this from environment variable, but for demo purposes using a placeholder
const getApiKey = () => {
  // In a real app, this would come from environment variables
  // For now, users need to add their TMDB API key
  return process.env.TMDB_API_KEY || 'your_tmdb_api_key_here';
};

export const tmdbService = {
  getPopularMovies: async (page: number = 1): Promise<TMDBResponse> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${getApiKey()}&page=${page}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch popular movies');
    }
    
    return response.json();
  },

  searchMovies: async (query: string, page: number = 1): Promise<TMDBResponse> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${getApiKey()}&query=${encodeURIComponent(query)}&page=${page}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to search movies');
    }
    
    return response.json();
  },

  getMovieDetails: async (movieId: number): Promise<Movie> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${getApiKey()}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch movie details');
    }
    
    return response.json();
  },

  getMovieGenres: async (): Promise<Genre[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/genre/movie/list?api_key=${getApiKey()}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch genres');
    }
    
    const data = await response.json();
    return data.genres;
  },

  getImageUrl: (path: string | null, size: string = 'w500'): string => {
    if (!path) return '/placeholder.svg';
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
  },

  getBackdropUrl: (path: string | null, size: string = 'w1280'): string => {
    if (!path) return '/placeholder.svg';
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
  },
};