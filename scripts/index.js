function handleKeyPress(event) {
  if (event.key === "Enter") {
    search();
  }
}

async function search() {
  const searchValue = document.getElementById("searchInput").value;
  if (searchValue.trim() === "") {
    alert("Enter a valid search term, you must, young Padawan.");
    return;
  }

  const characterRes = await fetch(
    `https://swapi.dev/api/people/?search=${encodeURIComponent(searchValue)}`
  );
  const characterData = await characterRes.json();

  const movieRes = await fetch(
    `https://swapi.dev/api/films/?search=${encodeURIComponent(searchValue)}`
  );
  const movieData = await movieRes.json();

  displayTheResults(characterData.results, movieData.results);
}

function linkToCharacter(character) {
  const characterLink = document.createElement("a");
  characterLink.textContent = character.name;
  characterLink.href = `pages/character.html?name=${encodeURIComponent(
    character.name
  )}`;
  return characterLink;
}

function linkToMovie(movie) {
  const movieLink = document.createElement("a");
  movieLink.textContent = `Episode ${movie.episode_id}: ${movie.title}`;
  movieLink.href = `pages/movie.html?title=${encodeURIComponent(movie.title)}`;
  return movieLink;
}

async function displayTheResults(characters, movies) {
  const resultsSection = document.getElementById("resultsSection");
  resultsSection.innerHTML = "";

  if (characters.length > 0) {
    for (const character of characters) {
      const resultItem = document.createElement("div");
      const characterLink = linkToCharacter(character);
      resultItem.appendChild(characterLink);
      resultsSection.appendChild(resultItem);
    }
  }

  if (movies.length > 0) {
    for (const movie of movies) {
      const resultItem = document.createElement("div");
      const movieLink = linkToMovie(movie);
      resultItem.appendChild(movieLink);
      resultsSection.appendChild(resultItem);
    }
  }

  if (characters.length === 0 && movies.length === 0) {
    const noResultsFound = document.createElement("p");
    noResultsFound.textContent = "Results, none found have we.";
    resultsSection.appendChild(noResultsFound);
  }
}

async function initializePage() {
  document
    .getElementById("searchInput")
    .addEventListener("keypress", handleKeyPress);
  document.getElementById("searchButton").addEventListener("click", search);
}

initializePage();
