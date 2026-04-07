
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from '../components/Card';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query.length < 3) return;
    const timeout = setTimeout(() => {
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/movies/search?query=${query}`)
        .then(res => setResults(res.data.data))
        .catch(console.error);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);


  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <input
        type="text"
        placeholder="Search for movies..."
        className="w-full p-3 border border-gray-300 rounded-lg"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      {
        results.length === 0 && <p className="text-center mt-10">Loading...</p> 
      }
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {results.map(movie => <MovieCard key={movie._id} movie={movie} />)}
      </div>
    </div>
  );
}

export default Search;