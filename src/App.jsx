import { React, useState, useEffect } from "react";
import { useDebounce } from "react-use";
import Search from "./components/Search";
import movieIcon from "./components/images/movies.png";
import axios from "axios";
import Loader from "./components/Loader";
import MovieCard from "./components/MovieCard";
import { getTrendingMovies, updateSearchCount } from "./appwrite";

const API_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: { accept: "application/json", Authorization: `Bearer ${API_KEY}` },
};

const App = () => {
  const [searchMovie, setSearchMovie] = useState("");
  const [error, setError] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedSearchMovie, setDebouncedSearchMovie] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);

  useDebounce(() => setDebouncedSearchMovie(searchMovie), 500, [searchMovie]);

  const fetchMovies = async (query = "") => {
    setLoading(true);
    setError("");

    try {
      const endpoint = query
        ? `${API_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await axios.get(endpoint, API_OPTIONS);

      if (response.status != 200) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.data;
      console.log(data);
      if (data.response === "False") {
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (e) {
      console.log(e);
      setError(`Error fetching movies!`);
    } finally {
      setLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchMovie);
  }, [debouncedSearchMovie]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <>
      <main>
        <div className="pattern" />
        <div className="wrapper">
          <header>
            <img src={movieIcon} alt="Movei Icon" />
            <h1>
              Find <span className="text-gradient"> Movies</span> You'll Enjoy
              here!
            </h1>
          </header>
          {trendingMovies.length > 0 && (
            <section className="trending">
              <h2>Trending Movies</h2>
              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.$id}>
                    <p>{index + 1}</p>
                    <img src={movie.poster_url} alt={movie.title} />
                  </li>
                ))}
              </ul>
            </section>
          )}
          <Search searchMovie={searchMovie} setSearchMovie={setSearchMovie} />
          <section className="all movies">
            <h2>All Movies</h2>
            {loading ? (
              <Loader />
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <ul>
                <li>
                  {movieList.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </li>
              </ul>
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default App;
