const urlParams = new URLSearchParams(window.location.search);
const title = urlParams.get("title");
const movieDetailsElement = document.getElementById("movieDetails");
const characterListElement = document.getElementById("characterList");

async function fetchMovieData() {
  const movieRes = await fetch(
    `https://swapi.dev/api/films/?search=${encodeURIComponent(title)}`
  );
  const movieData = await movieRes.json();
  return movieData.results[0];
}

async function fetchMovieCharacters(movie) {
  const characterUrls = movie.characters;
  const characterPromises = characterUrls.map((url) =>
    fetch(url).then((response) => response.json())
  );
  return await Promise.all(characterPromises);
}

function linkToCharacter(character) {
  const characterLink = document.createElement("a");
  characterLink.textContent = character.name;
  characterLink.href = `character.html?name=${encodeURIComponent(
    character.name
  )}`;
  return characterLink;
}

async function displayMovieDetails(movie, characters) {
  const movieDetails = document.createElement("div");
  movieDetails.innerHTML = `
        <p><strong>Title: ${movie.title}</strong></p>
        <p>Episode: ${movie.episode_id}</p>
        <p>Director: ${movie.director}</p>
        <p>Release Date: ${movie.release_date}</p>
      `;

  movieDetailsElement.appendChild(movieDetails);

  if (characters.length > 0) {
    for (const character of characters) {
      const characterListItem = document.createElement("span");
      const characterLink = linkToCharacter(character);
      characterListItem.appendChild(characterLink);
      characterListElement.appendChild(characterListItem);
    }
  } else {
    const noCharacters = document.createElement("p");
    noCharacters.textContent =
      "Characters, none found have we, for this movie.";
    characterListElement.appendChild(noCharacters);
  }
}

async function initializePage() {
  const movie = await fetchMovieData();
  const characters = await fetchMovieCharacters(movie);
  displayMovieDetails(movie, characters);
}

function goBack() {
  history.back();
}

initializePage();
