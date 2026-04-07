import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MoviePoster from '../../components/MoviePoster';



const MoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);



  // Fetch all movies on mount
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/movies`);
        setMovies(res.data?.data || []);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);



  // Handle search input change
  const onInputChange = (e) => setSearch(e.target.value);



  // Handle 'Enter' key for search
  const handleKeyDown = async (e) => {
    if (e.key === 'Enter' && search.trim() !== '') {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/movies/search?query=${search}`
        );
        setMovies(res.data?.data || []);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    }
  };



  return (
    <div className="p-6 font-sans">
      {/* Heading */}
      <h1 className="text-6xl font-bold text-center mb-6">🎬 Movies Recommender</h1>

      {/* Search Input */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search Movies..."
          value={search}
          onChange={onInputChange}
          onKeyDown={handleKeyDown}
          className="border border-gray-300 rounded-l px-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Movies Grid */}
      {loading ? (
        <p className="text-center text-gray-500 mt-10">Loading...</p>
      ) : movies.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No movies found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) =>
            movie.Poster ? <MoviePoster key={movie._id} movie={movie} /> : null
          )}
        </div>
      )}
    </div>
  );
};



export default MoviesList;