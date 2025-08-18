export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: Genre[];
  runtime?: number;
  status?: string;
  tagline?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface TMDBResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  token: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}