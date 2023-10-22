"use strict";
const body = document.querySelector("body");
const header = document.querySelector("header");
const footer = document.querySelector("footer");
const submitBtn = document.querySelector(".button-search");
const darkmodeBtn = document.querySelector(".button-darkmode");
const resetBtn = document.querySelector(".button-reset");
const filterBtn = document.querySelector(".button-filter");
const moreBtn = document.querySelector(".button-more-item");

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YTVlZDU5NmIzNTk4ODZmNjY1MDdmOTgzMjM2NWVmNCIsInN1YiI6IjY1MmY4NGU2ZWE4NGM3MDBjYTEyZGYxZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EIRykaMpZeWLXpjyuX2pzqu0h562vsjwcptRXfSwL0s",
  },
};
let page = 1;
let filter;
let genres = [];
let value;
let totalPages;
let prevFiltered;
// TMDB API에서 Top Rated Movies 데이터 받아오기
const getMovie = (page = 1) => {
  const url = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}`;
  fetch(url, options)
    .then((response) => response.json())
    .then((data) => makeCards(data))
    .catch((error) => console.log(error));
};

const getGenre = async () => {
  fetch("https://api.themoviedb.org/3/genre/movie/list?language=en", options)
    .then((response) => response.json())
    .then((data) => makeGenre(data.genres))
    .catch((err) => console.error(err));
};

// 영화 정보의 배열을 순회하며 영화 카드를 만드는 함수
const makeCards = (movies) => {
  // 포스터 이미지 경로를 만들기 위한 url과 포스터 사이즈
  const baseUrl = "http://image.tmdb.org/t/p/";
  const posterSize = "w500";
  totalPages = movies["total_pages"];
  movies.results.forEach((movie) => {
    // 카드를 구성하는 elements를 생성한다
    const cardList = document.querySelector(".card-list");
    const card = document.createElement("article");
    const img = document.createElement("img");
    const div = document.createElement("div");
    const name = document.createElement("h3");
    const contents = document.createElement("p");
    const rating = document.createElement("p");
    // 영화 객체에서 제목, 이미지경로, 내용, 평점 property를 뽑아내 저장한다
    const { title, poster_path, overview, vote_average, id, genre_ids } = movie;
    // 객체에서 뽑아낸 경로를 더해 완성한 이미지 전체 경로
    const url = baseUrl + posterSize + poster_path;
    // console.log(name, poster_path);

    // 생성한 DOM element에 필요한 데이터를 넣어주는 과정

    card.setAttribute("data-id", id);
    card.setAttribute("data-genres", genre_ids.join());
    card.classList.add("movie-card");
    card.addEventListener("click", onCardClicked);
    img.setAttribute("src", url);
    img.setAttribute("alt", title);
    div.classList.add("movie-card-content");
    name.innerText = title;
    name.classList.add("movie-title");
    contents.innerText = overview;
    contents.classList.add("movie-overview");
    rating.innerText = `rating: ${vote_average}`;
    rating.classList.add("movie-rating");
    div.appendChild(name);
    div.appendChild(contents);
    div.appendChild(rating);
    card.appendChild(img);
    card.appendChild(div);
    cardList.appendChild(card);

    checkPage();
  });
  filterMovies(filter, value, genres);
};

const makeGenre = (genres) => {
  const genreBox = document.querySelector("fieldset");
  genres.forEach((genre, idx) => {
    const li = document.createElement("li");
    const input = document.createElement("input");
    const label = document.createElement("label");
    input.classList.add("checkbox");
    label.classList.add("label-checkbox");
    li.classList.add("genre-item");
    input.setAttribute("type", "checkbox");
    input.setAttribute("name", "genre");
    const { id, name } = genre;
    input.setAttribute("id", name);
    input.setAttribute("data-genres", id);
    input.setAttribute("value", name);
    label.setAttribute("for", name);
    label.innerText = name;
    li.appendChild(input);
    li.appendChild(label);
    genreBox.children[0].appendChild(li);
    input.addEventListener("click", onGenreItemClicked);
  });
};

// Event Handler callback functions

// 카드 클릭시 ID 를 보여주기 위한 이벤트 핸들러
const onCardClicked = (e) => {
  // event의 currentTarget 프로퍼티를 사용해
  // 자식 요소가 아닌 부모의 "data-id"를 받아올 수 있게 했다
  const id = e.currentTarget.getAttribute("data-id");
  alert(`영화 ID: ${id}`);
};

const onMoreBtnClicked = (e) => {
  getMovie(++page);
};

const onSearchClicked = (e) => {
  e.preventDefault();
  if (filter === "genre") {
    removeGenres();
    closeGenreBox();
    prevFiltered = [];
  }
  filter = "title";
  const input = document.getElementById("input");
  value = input.value;
  filterMovies(filter, value);
  input.value = "";
};

const onResetBtnClicked = (e) => {
  // e.target.classList.add("invisible");
  filter = "";
  resetBtn.innerText = "검색 결과 초기화";
  removeGenres();
  closeGenreBox();
  // genres = [];
  showAllCards();
};

const onDarkmodeBtnClicked = (e) => {
  document.querySelector("body").classList.toggle("dark-mode");
  header.classList.toggle("dark-mode");
  footer.classList.toggle("dark-mode");
  document.querySelector("#sidebar-right").classList.toggle("dark-mode");
  document.querySelector("#sidebar-left").classList.toggle("dark-mode");
  // filterBtn.classList.toggle("dark-mode");
  document.querySelectorAll("main .button").forEach((btn) => {
    btn.classList.toggle("dark-mode-buttons");
  });
  document.querySelector("fieldset").classList.toggle("dark-mode-buttons");
  document.querySelectorAll("ul label").forEach((btn) => {
    btn.classList.toggle("dark-mode-buttons");
  });
  document
    .querySelectorAll(".movie-card")
    .forEach((card) => card.classList.toggle("dark-mode"));
  document
    .querySelectorAll("p")
    .forEach((p) => p.classList.toggle("dark-mode"));
  // e.target.closest("div").classList.toggle("dark-mode-buttons");
};

const onGenreItemClicked = (e) => {
  if ((filter = "title")) {
    prevFiltered = [];
  }
  filter = "genre";
  let genre = e.currentTarget.getAttribute("data-genres");
  // console.log(genre);
  if (genres.includes(genre)) {
    let idx = genres.indexOf(genre);
    genres.splice(idx, 1);
  } else {
    genres.push(genre);
  }
  // console.log(genres);
  if (genres.length) {
    filterMovies(filter, "", genres);
  } else {
    resetBtn.innerText = "검색 결과 초기화";
    showAllCards();
  }
};

const onFilterBtnClicked = (e) => {
  document.querySelector("fieldset").classList.toggle("hidden");
};

const checkPage = () => {
  if (page === totalPages) moreBtn.classList.toggle("invisible");
};

function showAllCards() {
  let cards = document.querySelectorAll(".movie-card");
  cards.forEach((card) => card.classList.remove("hidden"));
}

const removeGenres = () => {
  const genreItems = document.querySelectorAll("ul input:checked");
  // console.log(genreItems);
  genreItems.forEach((genreItem) => genreItem.click());
};

const closeGenreBox = () => {
  document.querySelector("fieldset").classList.add("hidden");
};

// 미구현 사항 : 청불 영화/연도별 영화 필터를 넣을 계획
const filterMovies = (filter, value = "", genres = []) => {
  showAllCards(); // 카드리스트 표시 초기화
  resetBtn.innerText = "검색 결과 초기화"; // 검색결과 텍스트 초기화
  if (filter === "title") {
    let cards = Array.from(document.querySelectorAll(".movie-title"));
    filterByTitle(cards, value);
  } else if (filter === "genre") {
    let cards = Array.from(document.querySelectorAll("article"));
    filterByGenre(cards, genres);
  }
};

const filterByTitle = (cards, value) => {
  let cardsToDel = [];
  let cardsToShow = cards.filter((card) => {
    let title = card.innerHTML;
    let valueToLowerCase = value.toLowerCase();
    if (title.toLowerCase().includes(valueToLowerCase)) {
      // card.closest(".movie-card").classList.add("hidden");
      return card;
    } else cardsToDel.push(card);
  });
  let stringifiedFilterResult = cardsToShow.map((card) => {
    return card.closest("article").getAttribute("data-id");
  });

  if (value === "") {
    alert("검색어를 입력해 주십시오.");
    return;
  } else if (String(prevFiltered) === String(stringifiedFilterResult)) {
    getMovie(++page);
  } else {
    prevFiltered = stringifiedFilterResult;
    cardsToDel.forEach((card) =>
      card.closest(".movie-card").classList.toggle("hidden")
    );
    resetBtn.innerText = `'${value}' 에 대한 ${cardsToShow.length}개의 검색 결과 초기화`;
  }
};

const filterByGenre = (cards, genres) => {
  let cardsToDel = [];
  let cardsToShow = cards.filter((card) => {
    let genresFromMovieCard = card.getAttribute("data-genres").split(",");
    if (genresFromMovieCard.filter((genre) => genres.includes(genre)).length) {
      return card;
    } else cardsToDel.push(card);
    // action, drama => action,
  });
  let stringifiedFilterResult = cardsToShow.map((card) => {
    return card.getAttribute("data-id");
  });

  if (String(prevFiltered) === String(stringifiedFilterResult)) {
    getMovie(++page);
  } else {
    prevFiltered = stringifiedFilterResult;
    cardsToDel.forEach((card) => {
      card.classList.toggle("hidden");
    });
    resetBtn.innerText = `${genres.length}가지 장르에 대한 ${cardsToShow.length}개의 검색 결과 초기화`;
  }
};

submitBtn.addEventListener("click", onSearchClicked);
resetBtn.addEventListener("click", onResetBtnClicked);
darkmodeBtn.addEventListener("click", onDarkmodeBtnClicked);
moreBtn.addEventListener("click", onMoreBtnClicked);
filterBtn.addEventListener("click", onFilterBtnClicked);

getMovie(1);
getGenre();
