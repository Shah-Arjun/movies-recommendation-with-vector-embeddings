
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
// import MovieCard from '../components/Card';
import MoviePoster from '../components/MoviePoster';



function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  
  
  
    // get movie detail
    useEffect(() => {
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/movies/${id}`)
        .then(res => setMovie(res.data.data))
        .catch(console.error);
    }, [id]);



  // get recommended movies
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/movies/recommend/${id}`)
      .then(res => setRecommendations(res.data.data))
      .catch(console.error);
  }, [id]);



  if (!movie) return <p className="text-center mt-10 text-red-500">Movie not found</p>;


  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Movie Detail */}
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <img
          src={movie.Poster}
          alt={movie.Title}
          className="w-full md:w-1/3 max-h-[500px] object-cover rounded-xl shadow-lg"
        />
        <div className="md:flex-1">
          <h1 className="text-3xl font-bold mb-2">{movie.Title}</h1>
          <p className="text-gray-700 mb-2"><span className="font-semibold">Genre:</span> {movie.Genre}</p>
          <p className="text-gray-700">{movie.Plot}</p>
        </div>
      </div>


      {/* Recommendations */}
      {recommendations.length > 0 && (
        <>
          <h2 className="text-3xl font-semibold my-16">Similar Recommended Movies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendations.map((recMovie, i) => (
              recMovie.Poster && <MoviePoster key={recMovie._id} movie={recMovie} index={i + 1} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default MovieDetail;