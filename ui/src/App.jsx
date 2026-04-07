import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import './App.css'
import MoviesList from './Pages/movieList/MovieList';
import MovieDetail from './pages/MovieDetail';
import Search from './components/Search';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MoviesList />} />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </Router>
  )
}


export default App