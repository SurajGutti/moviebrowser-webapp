import { React, useState, useEffect } from "react";
import Search from "./components/Search";
import movieIcon from "./components/images/movies.png";
import axios from "axios";
import Loader from "./components/Loader";
import MovieCard from "./components/MovieCard";

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

  const fetchMovies = async () => {
    setLoading(true);
    setError("");

    try {
      const endpoint = `${API_URL}/discover/movie?sort_by=popularity.desc`;

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
    } catch (e) {
      console.log(e);
      setError(`Error fetching movies!`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
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
          <Search searchMovie={searchMovie} setSearchMovie={setSearchMovie} />
          <section className="all movies">
            <h2 className="mt-[20px]">All Movies</h2>
            {loading ? (
              <Loader />
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default App;
