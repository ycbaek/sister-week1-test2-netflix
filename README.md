# Now Playing

A simple movie site that lists films currently in theaters. The layout follows a Netflix-style dark page: a large featured banner and a sideways row of posters with titles.

Movie data comes from [The Movie Database (TMDB)](https://www.themoviedb.org/) now-playing endpoint:

`https://api.themoviedb.org/3/movie/now_playing`

## What you see

- A banner for the first movie, with its backdrop, title, year, score, and short description
- A **Now Playing** row of posters and titles
- Clicking a poster moves that movie into the banner

## Files

| File | Role |
| --- | --- |
| `index.html` | Page structure |
| `style.css` | Layout and Netflix-style styling |
| `script.js` | Loads the TMDB list and draws the movies |

The API key is stored in `script.js`.

## Run it locally

Open a terminal in this folder and start a local server:

```bash
python3 -m http.server 8765
```

Then open [http://127.0.0.1:8765/](http://127.0.0.1:8765/) in a browser.

Use a local server instead of opening `index.html` directly, so the browser can request the movie API.
