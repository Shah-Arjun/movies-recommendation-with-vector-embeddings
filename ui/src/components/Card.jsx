import { useNavigate } from 'react-router-dom';



function MovieCard({ movie }) {
  const navigate = useNavigate();

  // Navigate to detail page on click
  const navigateToMovieDetail = () => {
    navigate(`/movies/${movie._id}`);
  };

  return (
    <div
      className="cursor-pointer border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
      onClick={navigateToMovieDetail}
    >

      {/* Poster Image */}
      {movie.Poster ? (
        <img
          src={movie.Poster}
          alt={movie.Title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
          No Image
        </div>
      )}

      {/* Movie Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{movie.Title}</h3>
        {movie.Genre && <p className="text-gray-600 mb-2">{movie.Genre}</p>}
        {/* Optional plot preview */}
        {movie.plot && <p className="text-gray-500 text-sm">{movie.plot.slice(0, 100)}...</p>}
      </div>
    </div>
  );
}



export default MovieCard;