import { useEffect, useState } from 'react';
import { X, Heart, Star, Calendar, Clock, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Movie } from '@/types/movie';
import { tmdbService } from '@/lib/tmdb';
import { favoritesService } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface MovieModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MovieModal = ({ movie, isOpen, onClose }: MovieModalProps) => {
  const [movieDetails, setMovieDetails] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (movie && isOpen) {
      setIsFavorite(favoritesService.isFavorite(movie.id));
      loadMovieDetails();
    }
  }, [movie, isOpen]);

  const loadMovieDetails = async () => {
    if (!movie) return;
    
    setLoading(true);
    try {
      const details = await tmdbService.getMovieDetails(movie.id);
      setMovieDetails(details);
    } catch (error) {
      console.error('Failed to load movie details:', error);
      setMovieDetails(movie); // Fallback to basic movie data
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to add movies to favorites',
        variant: 'destructive',
      });
      return;
    }

    if (!movieDetails) return;

    if (isFavorite) {
      favoritesService.removeFromFavorites(movieDetails.id);
      setIsFavorite(false);
      toast({
        title: 'Removed from favorites',
        description: `${movieDetails.title} was removed from your favorites`,
      });
    } else {
      favoritesService.addToFavorites(movieDetails);
      setIsFavorite(true);
      toast({
        title: 'Added to favorites',
        description: `${movieDetails.title} was added to your favorites`,
      });
    }
  };

  if (!movieDetails) return null;

  const releaseYear = movieDetails.release_date 
    ? new Date(movieDetails.release_date).getFullYear()
    : 'TBA';

  const runtime = movieDetails.runtime ? `${movieDetails.runtime} min` : 'Unknown';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <div className="relative">
          {/* Backdrop Image */}
          <div className="relative h-64 md:h-80">
            <img
              src={tmdbService.getBackdropUrl(movieDetails.backdrop_path)}
              alt={movieDetails.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-overlay" />
            
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-background/80 hover:bg-background"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Poster */}
              <div className="flex-shrink-0">
                <img
                  src={tmdbService.getImageUrl(movieDetails.poster_path, 'w342')}
                  alt={movieDetails.title}
                  className="w-48 h-72 object-cover rounded-lg cinema-glow"
                />
              </div>

              {/* Movie Details */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{movieDetails.title}</h2>
                    {movieDetails.tagline && (
                      <p className="text-muted-foreground italic mb-4">
                        "{movieDetails.tagline}"
                      </p>
                    )}
                  </div>

                  {isAuthenticated && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleFavoriteClick}
                      className="ml-4"
                    >
                      <Heart 
                        className={`h-4 w-4 ${
                          isFavorite 
                            ? 'fill-primary text-primary' 
                            : 'text-foreground'
                        }`} 
                      />
                    </Button>
                  )}
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap gap-4 mb-4">
                  <Badge variant="secondary" className="gap-1">
                    <Star className="h-3 w-3 fill-cinema-gold text-cinema-gold" />
                    {movieDetails.vote_average.toFixed(1)} ({movieDetails.vote_count} votes)
                  </Badge>
                  
                  <Badge variant="outline" className="gap-1">
                    <Calendar className="h-3 w-3" />
                    {releaseYear}
                  </Badge>
                  
                  <Badge variant="outline" className="gap-1">
                    <Clock className="h-3 w-3" />
                    {runtime}
                  </Badge>

                  {movieDetails.status && (
                    <Badge variant="outline">
                      {movieDetails.status}
                    </Badge>
                  )}
                </div>

                {/* Genres */}
                {movieDetails.genres && movieDetails.genres.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {movieDetails.genres.map((genre) => (
                        <Badge key={genre.id} variant="secondary">
                          {genre.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Overview */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Overview</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {movieDetails.overview || 'No overview available.'}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button className="gap-2">
                    <Play className="h-4 w-4" />
                    Watch Trailer
                  </Button>
                  <Button variant="outline">
                    More Info
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};