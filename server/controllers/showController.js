import axios from "axios";
import Movie from "../models/MOvie.js";
import Show from "../models/Show.js";

// ✅ Get Now Playing Movies from TMDB
export const getNowPlayingMovies = async (req, res) => {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
            headers: {
                Authorization: `Bearer ${process.env.TMDB_API_KEY}`
            }
        });

        const movies = response.data.results;
        res.json({ success: true, movies });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// ✅ Add New Show
export const addShow = async (req, res) => {
  try {
    const { movieId, showsInput, showPrice } = req.body;
    console.log("📩 Payload received:", req.body);

    let movie = await Movie.findById(movieId);
    if (!movie) {
      const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
        }),
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
        })
      ]);

      const movieApiData = movieDetailsResponse.data;
      const movieCreditsData = movieCreditsResponse.data;

      const movieDetails = {
        _id: movieId,
        title: movieApiData.title,
        overview: movieApiData.overview,
        poster_path: movieApiData.poster_path,
        backdrop_path: movieApiData.backdrop_path,
        genres: movieApiData.genres,
        casts: movieCreditsData.cast,
        release_date: movieApiData.release_date,
        original_language: movieApiData.original_language,
        tagline: movieApiData.tagline || "",
        vote_average: movieApiData.vote_average,
        runtime: movieApiData.runtime
      };

      movie = await Movie.create(movieDetails);
    }

    const showsToCreate = [];
    showsInput.forEach(show => {
      const showDate = show.date;
      show.time.forEach(time => {
        const dateTimeString = `${showDate}T${time}`;
        console.log("🕒 Final DateTime:", dateTimeString);
        showsToCreate.push({
          movie: movieId,
          showDateTime: new Date(dateTimeString),
          showPrice,
          occupiedSeats: {}
        });
      });
    });

    console.log("🧾 Prepared shows:", showsToCreate);

    if (showsToCreate.length > 0) {
      const inserted = await Show.insertMany(showsToCreate);
      console.log("🎉 Shows Inserted:", inserted);
    }

    res.json({ success: true, message: "Shows added successfully" });

  } catch (error) {
    console.error("❌ Error inserting shows:", error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get All Shows (Only Future + Unique Movies)
// ✅ Modified getShows
export const getShows = async (req, res) => {
    try {
        const now = new Date();

       const shows = await Show.find().populate('movie').sort({ showDateTime: 1 });

        const uniqueShows = [];
        const movieIds = new Set();

        for (const show of shows) {
            const movieId = show.movie._id.toString();
            if (!movieIds.has(movieId)) {
                uniqueShows.push(show);
                movieIds.add(movieId);
            }
        }

        console.log("Filtered Future Shows:", shows.length); // 🧪 Debug

        res.json({ success: true, shows: uniqueShows });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};


// ✅ Get All Upcoming Shows for a Specific Movie
export const getShow = async (req, res) => {
    try {
        const { movieId } = req.params;

        const shows = await Show.find({
            movie: movieId,
            showDateTime: { $gte: new Date() }
        });

        const movie = await Movie.findById(movieId);
        const dateTime = {};

        shows.forEach((show) => {
            const date = show.showDateTime.toISOString().split('T')[0];
            if (!dateTime[date]) {
                dateTime[date] = [];
            }
            dateTime[date].push({ time: show.showDateTime, showId: show._id });
        });

        res.json({ success: true,  show:{ movie, showTimes: dateTime }});
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};
