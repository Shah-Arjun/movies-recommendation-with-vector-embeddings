import { useNavigate } from "react-router-dom";
import ImageWithFallback from "./ImageWithFallback";




function MoviePoster({ index, movie }) {
  const navigate = useNavigate();


  const navigateToMovieDetail = () => {
    navigate(`/movies/${movie._id}`);
  };




  return (
    <div
      className="cursor-pointer transform hover:scale-105 transition-transform duration-200"
      onClick={navigateToMovieDetail}
    >
      <div className="relative">
        <ImageWithFallback
          className="w-full sm:w-64 md:w-72 h-96 object-cover rounded-lg shadow-lg"
          src={movie.Poster}
          alt={movie.Title}
          loading="lazy"
        />

        {/* Score Badge */}
        {movie.score && (
          <div className="absolute bottom-4 right-4 w-14 h-14 flex items-center justify-center bg-indigo-500 bg-opacity-90 p-2 rounded-full font-bold text-black">
            {(movie.score * 100).toFixed(2)}%
          </div>
        )}

        {/* Index over the poster */}
        {index !== undefined && (
          <div className="hidden md:block absolute top-32 -left-10 text-gray-100 text-[9rem] font-extrabold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
            {index}
          </div>
        )}
      </div>

      {/* Title & Genre */}
      <div className="py-2 w-full sm:w-64 md:w-72">
        <p className="text-lg font-semibold line-clamp-1">{movie.Title}</p>
        <p className="text-gray-500 text-sm line-clamp-1">{movie.Genre}</p>
      </div>
    </div>
  );
}



export default MoviePoster;