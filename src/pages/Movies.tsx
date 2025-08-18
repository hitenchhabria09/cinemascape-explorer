import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MovieCard } from '@/components/MovieCard';
import { MovieModal } from '@/components/MovieModal';
import { Movie, TMDBResponse } from '@/types/movie';
import { tmdbService } from '@/lib/tmdb';

interface MoviesProps {
  searchQuery?: string;
}

export const Movies = ({ searchQuery }: MoviesProps) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '200px',
  });

  useEffect(() => {
    // Reset when search query changes
    setMovies([]);
    setPage(1);
    setHasNextPage(true);
    setError(null);
    loadMovies(1, searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (inView && hasNextPage && !loading && page > 1) {
      loadMovies(page, searchQuery);
    }
  }, [inView, hasNextPage, loading, page, searchQuery]);

  const loadMovies = async (pageNum: number, query?: string) => {
    setLoading(true);
    setError(null);

    try {
      let response: TMDBResponse;
      
      if (query && query.trim()) {
        response = await tmdbService.searchMovies(query.trim(), pageNum);
      } else {
        response = await tmdbService.getPopularMovies(pageNum);
      }

      if (pageNum === 1) {
        setMovies(response.results);
      } else {
        setMovies(prev => [...prev, ...response.results]);
      }

      setHasNextPage(pageNum < response.total_pages);
      setPage(pageNum + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const retryLoad = () => {
    setError(null);
    loadMovies(1, searchQuery);
  };

  if (error && movies.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button onClick={retryLoad} variant="outline" size="sm">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Popular Movies'}
        </h1>
        {movies.length > 0 && (
          <p className="text-muted-foreground">
            {searchQuery ? `Found ${movies.length} movies` : `Showing ${movies.length} popular movies`}
          </p>
        )}
      </div>

      {/* Movies Grid */}
      {movies.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onSelect={handleMovieSelect}
              />
            ))}
          </div>

          {/* Infinite scroll trigger */}
          {hasNextPage && (
            <div ref={ref} className="flex justify-center py-8">
              {loading && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading more movies...
                </div>
              )}
            </div>
          )}

          {!hasNextPage && movies.length > 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No more movies to load
            </div>
          )}
        </>
      ) : (
        !loading && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">
              {searchQuery ? 'No movies found' : 'No movies available'}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery 
                ? 'Try searching with different keywords' 
                : 'Please try again later'
              }
            </p>
          </div>
        )
      )}

      {/* Initial loading */}
      {loading && movies.length === 0 && (
        <div className="flex justify-center py-16">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            Loading movies...
          </div>
        </div>
      )}

      {/* Movie Modal */}
      <MovieModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};