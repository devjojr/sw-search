const urlParams = new URLSearchParams(window.location.search);
const name = urlParams.get("name");
const characterDetailsElement = document.getElementById("characterDetails");
const movieListElement = document.getElementById("movieList");

async function fetchCharacterData() {
  const characterRes = await fetch(
    `https://swapi.dev/api/people/?search=${encodeURIComponent(name)}`
  );
  const characterData = await characterRes.json();
  return characterData.results[0];
}

async function fetchCharacterMovies(character) {
  const movieUrls = character.films;
  const moviePromises = movieUrls.map((url) =>
    fetch(url).then((response) => response.json())
  );
  return await Promise.all(moviePromises);
}

function linkToMovie(movie) {
  const movieLink = document.createElement("a");
  movieLink.textContent = `Episode ${movie.episode_id}: ${movie.title}`;
  movieLink.href = `movie.html?title=${encodeURIComponent(movie.title)}`;
  return movieLink;
}

async function displayCharacterDetails(character, movies) {
  const characterDetails = document.createElement("div");
  characterDetails.innerHTML = `
        <p><strong>Name: ${character.name}</strong></p>
        <p>Date of Birth: ${character.birth_year}</p>
        <p>Height: ${character.height} cm</p>
        <p>Mass: ${character.mass} kg</p>
        <p>Hair Color: ${character.hair_color}</p>
        <p>Eye Color: ${character.eye_color}</p>
      `;

  characterDetailsElement.appendChild(characterDetails);

  if (movies.length > 0) {
    for (const movie of movies) {
      const movieListItem = document.createElement("p");
      const movieLink = linkToMovie(movie);
      movieListItem.appendChild(movieLink);
      movieListElement.appendChild(movieListItem);
    }
  } else {
    const noMovies = document.createElement("p");
    noMovies.textContent = "Movies, none found have we, for this character.";
    movieListElement.appendChild(noMovies);
  }
}

async function initializePage() {
  const character = await fetchCharacterData();
  const movies = await fetchCharacterMovies(character);
  displayCharacterDetails(character, movies);
}

function goBack() {
  history.back();
}

initializePage();
