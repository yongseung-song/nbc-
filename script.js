"use strict";
const resetBtn = document.querySelector(".button-reset");
const submitBtn = document.querySelector(".button-search");
const darkmodeBtn = document.querySelector(".button-darkmode");
const body = document.querySelector("body");
const header = document.querySelector("header");
const footer = document.querySelector("footer");

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YTVlZDU5NmIzNTk4ODZmNjY1MDdmOTgzMjM2NWVmNCIsInN1YiI6IjY1MmY4NGU2ZWE4NGM3MDBjYTEyZGYxZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EIRykaMpZeWLXpjyuX2pzqu0h562vsjwcptRXfSwL0s",
  },
};
// TMDB API에서 데이터 받아오기
async function getMovies() {
  const response = await fetch(
    "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
    options
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));
  // 영화 정보가 담긴 배열을 makeCards 함수의 아규먼트로 전달한다
  // console.log(response.results);
  makeCards(response.results);
}

// 영화 정보의 배열을 순회하며 영화 카드를 만드는 함수
const makeCards = (movies) => {
  // 포스터 이미지 경로를 만들기 위한 url과 포스터 사이즈
  const baseUrl = "http://image.tmdb.org/t/p/";
  const posterSize = "w500";
  movies.forEach((movie) => {
    // 카드를 구성하는 elements를 생성한다
    const cardList = document.querySelector(".card-list");
    const card = document.createElement("article");
    const img = document.createElement("img");
    const div = document.createElement("div");
    const name = document.createElement("h3");
    const contents = document.createElement("p");
    const rating = document.createElement("p");
    // 영화 객체에서 제목, 이미지경로, 내용, 평점 property를 뽑아내 저장한다
    const { title, poster_path, overview, vote_average, id } = movie;
    // 객체에서 뽑아낸 경로를 더해 완성한 이미지 전체 경로
    const url = baseUrl + posterSize + poster_path;
    // console.log(name, poster_path);

    // 생성한 DOM element에 필요한 데이터를 넣어주는 과정
    card.setAttribute("data-id", id);
    card.classList.add("movie-card");
    card.addEventListener("click", onCardClicked);
    img.setAttribute("src", url);
    img.setAttribute("alt", name);
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
  });
};

// 카드 클릭시 ID 를 보여주기 위한 이벤트 핸들러
const onCardClicked = (e) => {
  // event의 currentTarget 프로퍼티를 사용해
  // 자식 요소가 아닌 부모의 "data-id"를 받아올 수 있게 했다
  const id = e.currentTarget.getAttribute("data-id");
  console.log(e.currentTarget);
  alert(`영화 ID: ${id}`);
};

const onSearchClicked = (e) => {
  e.preventDefault();
  const value = document.getElementById("input").value;
  filterMovies(value);
};

// 미구현 사항 : 청불 영화/연도별 영화 필터를 넣을 계획
const filterMovies = (value, option = "title") => {
  console.log(value);
  let cards = Array.from(document.querySelectorAll(".movie-title"));
  let cardsToDel = [];
  let cardsToShow = cards.filter((card) => {
    let title = card.innerHTML;
    let valueToLowerCase = value.toLowerCase();
    if (title.toLowerCase().includes(valueToLowerCase)) {
      // card.closest(".movie-card").classList.add("hidden");
      return card;
    } else cardsToDel.push(card);
  });
  if (cardsToShow.length == 0) {
    alert(`입력하신 '${value}'와 일치하는 영화가 없습니다!`);
    return;
  } else {
    cardsToDel.forEach((card) =>
      card.closest(".movie-card").classList.add("hidden")
    );
    resetBtn.innerText += `${cardsToShow.length}개의 검색 결과 초기화`;
    resetBtn.classList.remove("invisible");
  }
};

const onResetBtnClicked = (e) => {
  e.target.classList.add("invisible");
  let cards = document.querySelectorAll(".movie-card");
  cards.forEach((card) => card.classList.remove("hidden"));
};

const onDarkmodeBtnClicked = (e) => {
  body.classList.toggle("dark-mode");
  header.classList.toggle("dark-mode");
  footer.classList.toggle("dark-mode");
  document.querySelector("#sidebar-right").classList.toggle("dark-mode");
  document.querySelector("#sidebar-left").classList.toggle("dark-mode");
  document
    .querySelectorAll(".movie-card")
    .forEach((card) => card.classList.toggle("dark-mode"));
  document
    .querySelectorAll("p")
    .forEach((p) => p.classList.toggle("dark-mode"));
  // e.target.closest("div").classList.toggle("dark-mode-buttons");
};

submitBtn.addEventListener("click", onSearchClicked);
resetBtn.addEventListener("click", onResetBtnClicked);
darkmodeBtn.addEventListener("click", onDarkmodeBtnClicked);
getMovies();
