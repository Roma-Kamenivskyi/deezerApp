// variables
const searchForm = document.getElementById("searchForm");
const moviesWrapper = document.querySelector(".movies");
const searchText = document.querySelector("#searchText");
const buttonNext = document.querySelector("#buttonNext");
// Event listeners
searchForm.addEventListener("submit", apiSearch);

// Functions

function apiSearch(event) {
  const server = `https://cors-anywhere.herokuapp.com/https://api.deezer.com/search?q=${
    searchText.value
  }`;
  event.preventDefault();
  fetch(server)
    .then(value => {
      if (value.status !== 200) {
        return Promise.reject(new Error("Ошибка"));
      }
      return value.json();
    })
    .then(function(obj) {
      renderMusic(obj);
    })
    .catch(reason => {
      movie.innerHTML = "Упс что-то пошло не так!";
      console.log("error:" + reason.status);
    });
}

function renderMusic(obj) {
  console.log(obj);
  let output = "";

  obj.data.forEach(function(sound) {
    output += `
      <div class="col-md-6 mb-3 sound-item" data-id="${sound.id}">
        <div class="img-wrapper">
          <img class="mb-3" src="${sound.album.cover_medium}"/>        
        </div>
        <div class="sound__inner">
          <h4>${sound.title_short}</h4>
          <div class="artist-description">
            <span>Artist: ${sound.artist.name}</span>
            <span class="rank">Rank: ${sound.rank}</span>
          </div>
          <audio controls src="${sound.preview}"></audio>
        </div>
      </div>
    `;
  });
  moviesWrapper.innerHTML = output;

  if (obj.next) {
    buttonNext.style.display = "block";
    loadMore(obj);
  } else {
    buttonNext.style.display = "none";
  }
}

function renderNext(obj) {
  obj.data.forEach(function(sound) {
    const div = document.createElement("div");
    div.className = "col-md-6 mb-3 sound-item";
    div.dataset.id = sound.id;
    div.innerHTML = `
      <div class="img-wrapper">
        <img class="mb-3" src="${sound.album.cover_medium}"/>        
      </div>
      <div class="sound__inner">
        <h4>${sound.title_short}</h4>
        <div class="artist-description">
          <span>Artist: ${sound.artist.name}</span>
          <span class="rank">Rank: ${sound.rank}</span>
        </div>
        <audio controls src="${sound.preview}"></audio>
      </div>
    `;
    moviesWrapper.append(div);
  });

  if (obj.next) {
    buttonNext.style.display = "block";
    loadMore(obj);
  } else {
    buttonNext.style.display = "none";
  }
}

function loadMore(obj) {
  const server = `https://cors-anywhere.herokuapp.com/${obj.next}`;
  buttonNext.addEventListener("click", () => {
    fetch(server)
      .then(value => {
        if (value.status !== 200) {
          return Promise.reject(new Error("Ошибка"));
        }
        return value.json();
      })
      .then(function(obj) {
        renderNext(obj);
      })
      .catch(reason => {
        movie.innerHTML = "Упс что-то пошло не так!";
        console.log("error:" + reason.status);
      });
  });
}
