import { useState, useEffect } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MovieCard } from '@/components/MovieCard';
import { MovieModal } from '@/components/MovieModal';
import { Movie } from '@/types/movie';
import { favoritesService } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';

export const Favorites = () => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    }
  }, [isAuthenticated]);

  const loadFavorites = () => {
    const favoriteMovies = favoritesService.getFavorites();
    setFavorites(favoriteMovies);
  };

  const clearAllFavorites = () => {
    favorites.forEach(movie => {
      favoritesService.removeFromFavorites(movie.id);
    });
    setFavorites([]);
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    // Refresh favorites in case the movie was removed from modal
    loadFavorites();
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-3xl font-bold mb-2">Sign In Required</h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to view your favorite movies
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            My Favorites
          </h1>
          <p className="text-muted-foreground">
            {favorites.length > 0 
              ? `You have ${favorites.length} favorite movie${favorites.length === 1 ? '' : 's'}`
              : 'You haven\'t added any favorites yet'
            }
          </p>
        </div>

        {favorites.length > 0 && (
          <Button
            variant="outline"
            onClick={clearAllFavorites}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      {/* Favorites Grid */}
      {favorites.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {favorites.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelect={handleMovieSelect}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
          <p className="text-muted-foreground mb-6">
            Start exploring movies and add them to your favorites!
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Explore Movies
          </Button>
        </div>
      )}

      {/* Movie Modal */}
      <MovieModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
};