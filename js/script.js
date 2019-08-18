// variables
const searchForm = document.getElementById("searchForm");
const moviesWrapper = document.querySelector(".movies tbody");
const searchText = document.querySelector("#searchText");
const buttonNext = document.querySelector("#buttonNext");
let counter = 1;
// Event listeners
searchForm.addEventListener("submit", apiSearch);

// Functions

function apiSearch(event) {
  event.preventDefault();
  const server = `https://cors-anywhere.herokuapp.com/https://api.deezer.com/search?q=${
    searchText.value
  }`;
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
      moviesWrapper.innerHTML = "Упс что-то пошло не так!";
      console.log("error:" + reason.status);
    });
}

function renderMusic(obj) {
  console.log(obj);
  let output = "";
  counter = 1;

  obj.data.forEach(function(sound) {
    output += `
      <tr class="sound" data-id="${sound.id}">
        <th scope="col">${counter++}</th>
        <td scope="col">
          <a href="#" class="img-wrapper">
            <img src="${sound.album.cover_small}"/>        
          </a>
        </td>
        <td scope="col">
          <a href="#" class="sound__title">${sound.title_short}</a>
        </td>
        <td scope="col">
          <span>${sound.artist.name}</span>
        </td>
        <td>
          <span class="rank">${sound.rank}</span>
        </td>
        <td>${sound.album.title}</td>
        <td scope="col">
          <audio controls src="${sound.preview}"></audio>
        </td>
      </tr>
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
    const li = document.createElement("tr");
    li.className = "sound";
    li.dataset.id = sound.id;
    li.innerHTML = `
      <th scope="col">${counter++}</th>
      <td scope="col">
        <a href="#" class="img-wrapper">
          <img src="${sound.album.cover_small}"/>        
        </a>
      </td>
      <td scope="col">
        <a href="#" class="sound__title">${sound.title_short}</a>
      </td>
      <td scope="col">
        <span>${sound.artist.name}</span>
      </td>
      <td>
        <span class="rank">${sound.rank}</span>
      </td>
      <td>${sound.album.title}</td>
      <td scope="col">
        <audio controls src="${sound.preview}"></audio>
      </td>
    `;
    moviesWrapper.append(li);
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
        moviesWrapper.innerHTML = "Упс что-то пошло не так!";
        console.log("error:" + reason.status);
      });
  });
}
