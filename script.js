const API_KEY = "721e0c3ccd59556fd34ff8e95ce3faf9";
const API_URL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`;
const POSTER_BASE = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE = "https://image.tmdb.org/t/p/w1280";

const hero = document.getElementById("hero");
const heroTitle = document.getElementById("hero-title");
const heroMeta = document.getElementById("hero-meta");
const heroOverview = document.getElementById("hero-overview");
const movieRow = document.getElementById("movie-row");
const statusEl = document.getElementById("status");
const rowCount = document.getElementById("row-count");
const nav = document.getElementById("nav");

function posterUrl(path) {
  return path ? `${POSTER_BASE}${path}` : "";
}

function backdropUrl(path) {
  return path ? `${BACKDROP_BASE}${path}` : "";
}

function formatMeta(movie) {
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "—";
  const score = Number.isFinite(movie.vote_average)
    ? `${movie.vote_average.toFixed(1)} / 10`
    : "";
  return [year, score].filter(Boolean).join("  ·  ");
}

function showFeatured(movie, card) {
  heroTitle.textContent = movie.title;
  heroMeta.textContent = formatMeta(movie);
  heroOverview.textContent = movie.overview || "No description available.";

  const image = backdropUrl(movie.backdrop_path) || posterUrl(movie.poster_path);
  hero.style.backgroundImage = image
    ? `url("${image}")`
    : "linear-gradient(180deg, #2a2a2a, #141414)";

  document.querySelectorAll(".card.active").forEach((el) => el.classList.remove("active"));
  if (card) card.classList.add("active");
}

function createCard(movie) {
  const button = document.createElement("button");
  button.className = "card";
  button.type = "button";
  button.setAttribute("aria-label", movie.title);

  const poster = document.createElement("div");
  poster.className = "poster";

  if (movie.poster_path) {
    const img = document.createElement("img");
    img.src = posterUrl(movie.poster_path);
    img.alt = `${movie.title} poster`;
    img.loading = "lazy";
    poster.appendChild(img);
  } else {
    const fallback = document.createElement("div");
    fallback.className = "placeholder";
    fallback.textContent = "No poster";
    poster.appendChild(fallback);
  }

  const title = document.createElement("p");
  title.className = "title";
  title.textContent = movie.title;

  button.appendChild(poster);
  button.appendChild(title);
  button.addEventListener("click", () => showFeatured(movie, button));
  return button;
}

function renderMovies(movies) {
  movieRow.replaceChildren();
  movies.forEach((movie) => movieRow.appendChild(createCard(movie)));
  rowCount.textContent = `${movies.length} movies`;
  statusEl.textContent = "";

  if (movies[0]) {
    showFeatured(movies[0], movieRow.querySelector(".card"));
  }
}

async function loadNowPlaying() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`);
    }

    const data = await response.json();
    const movies = Array.isArray(data.results) ? data.results : [];

    if (movies.length === 0) {
      heroTitle.textContent = "No movies found";
      statusEl.textContent = "The theater list is empty right now.";
      return;
    }

    renderMovies(movies);
  } catch (error) {
    heroTitle.textContent = "Couldn’t load movies";
    heroOverview.textContent = "Check your connection and refresh the page.";
    statusEl.textContent = error.message || "Something went wrong.";
    statusEl.classList.add("error");
  }
}

document.getElementById("scroll-prev").addEventListener("click", () => {
  movieRow.scrollBy({ left: -movieRow.clientWidth * 0.8, behavior: "smooth" });
});

document.getElementById("scroll-next").addEventListener("click", () => {
  movieRow.scrollBy({ left: movieRow.clientWidth * 0.8, behavior: "smooth" });
});

window.addEventListener("scroll", () => {
  nav.classList.toggle("solid", window.scrollY > 40);
});

loadNowPlaying();
