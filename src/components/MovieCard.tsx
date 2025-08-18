import { useState } from 'react';
import { Heart, Star, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Movie } from '@/types/movie';
import { tmdbService } from '@/lib/tmdb';
import { favoritesService } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface MovieCardProps {
  movie: Movie;
  onSelect?: (movie: Movie) => void;
}

export const MovieCard = ({ movie, onSelect }: MovieCardProps) => {
  const [isFavorite, setIsFavorite] = useState(
    favoritesService.isFavorite(movie.id)
  );
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to add movies to favorites',
        variant: 'destructive',
      });
      return;
    }

    if (isFavorite) {
      favoritesService.removeFromFavorites(movie.id);
      setIsFavorite(false);
      toast({
        title: 'Removed from favorites',
        description: `${movie.title} was removed from your favorites`,
      });
    } else {
      favoritesService.addToFavorites(movie);
      setIsFavorite(true);
      toast({
        title: 'Added to favorites',
        description: `${movie.title} was added to your favorites`,
      });
    }
  };

  const releaseYear = movie.release_date 
    ? new Date(movie.release_date).getFullYear()
    : 'TBA';

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:scale-105 cinema-glow bg-gradient-card border-cinema-light/20"
      onClick={() => onSelect?.(movie)}
    >
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-lg">
          {/* Poster Image */}
          <div className="aspect-[2/3] relative">
            <img
              src={tmdbService.getImageUrl(movie.poster_path)}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Favorite Button */}
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/80 hover:bg-background"
                onClick={handleFavoriteClick}
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

            {/* Rating Badge */}
            <Badge 
              variant="secondary" 
              className="absolute top-2 left-2 bg-background/80 text-foreground"
            >
              <Star className="h-3 w-3 mr-1 fill-cinema-gold text-cinema-gold" />
              {movie.vote_average.toFixed(1)}
            </Badge>
          </div>

          {/* Movie Info */}
          <div className="p-4">
            <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {movie.title}
            </h3>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {releaseYear}
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {movie.vote_count} votes
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};