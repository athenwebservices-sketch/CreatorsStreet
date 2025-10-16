import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const MoviesContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 20px;
`;

const MoviesTitle = styled.h1`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
`;

const SearchBar = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 500px;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 25px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const MoviesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`;

const MovieCard = styled.div`
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const MoviePoster = styled.div`
  width: 100%;
  height: 350px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: white;
  position: relative;
`;

const MovieRating = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: #ffd700;
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
  font-weight: bold;
`;

const MovieInfo = styled.div`
  padding: 1.5rem;
`;

const MovieTitle = styled.h3`
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
`;

const MovieGenre = styled.p`
  color: #667eea;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const MovieDescription = styled.p`
  color: #7f8c8d;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 1rem;
`;

const MovieButton = styled.button`
  width: 100%;
  padding: 0.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: #5a67d8;
  }
`;

const FilterButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: ${props => props.active ? '#667eea' : 'white'};
  color: ${props => props.active ? 'white' : '#2c3e50'};
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? '#5a67d8' : '#f8f9fa'};
  }
`;

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');

  useEffect(() => {
    // Mock movie data
    const mockMovies = [
      { id: 1, title: 'Action Adventure', genre: 'Action', rating: 8.5, description: 'An exciting action-packed adventure', icon: '🎬' },
      { id: 2, title: 'Comedy Night', genre: 'Comedy', rating: 7.8, description: 'A hilarious comedy that will make you laugh', icon: '😂' },
      { id: 3, title: 'Drama Story', genre: 'Drama', rating: 9.2, description: 'A compelling dramatic story', icon: '🎭' },
      { id: 4, title: 'Horror Movie', genre: 'Horror', rating: 6.5, description: 'A spine-chilling horror experience', icon: '👻' },
      { id: 5, title: 'Romantic Tale', genre: 'Romance', rating: 8.0, description: 'A beautiful love story', icon: '💕' },
      { id: 6, title: 'Sci-Fi Epic', genre: 'Sci-Fi', rating: 8.8, description: 'An epic science fiction adventure', icon: '🚀' },
      { id: 7, title: 'Thriller Mystery', genre: 'Thriller', rating: 7.5, description: 'A suspenseful thriller', icon: '🔍' },
      { id: 8, title: 'Family Fun', genre: 'Family', rating: 8.3, description: 'Great entertainment for the whole family', icon: '👨‍👩‍👧‍👦' },
    ];
    setMovies(mockMovies);
  }, []);

  const genres = ['all', 'Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Family'];

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movie.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || movie.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const handleMovieClick = (movie) => {
    alert(`Selected: ${movie.title}\n\nThis would typically open a movie detail page or play the movie.`);
  };

  return (
    <MoviesContainer>
      <MoviesTitle>Movie Collection</MoviesTitle>
      
      <SearchBar>
        <SearchInput
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchBar>

      <FilterButtons>
        {genres.map(genre => (
          <FilterButton
            key={genre}
            active={selectedGenre === genre}
            onClick={() => setSelectedGenre(genre)}
          >
            {genre}
          </FilterButton>
        ))}
      </FilterButtons>

      <MoviesGrid>
        {filteredMovies.map(movie => (
          <MovieCard key={movie.id}>
            <MoviePoster>
              {movie.icon}
              <MovieRating>⭐ {movie.rating}</MovieRating>
            </MoviePoster>
            <MovieInfo>
              <MovieTitle>{movie.title}</MovieTitle>
              <MovieGenre>{movie.genre}</MovieGenre>
              <MovieDescription>{movie.description}</MovieDescription>
              <MovieButton onClick={() => handleMovieClick(movie)}>
                Watch Now
              </MovieButton>
            </MovieInfo>
          </MovieCard>
        ))}
      </MoviesGrid>
    </MoviesContainer>
  );
};

export default Movies;