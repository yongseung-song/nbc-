"use strict";

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
    "https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1",
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
    const title = document.createElement("h3");
    const contents = document.createElement("p");
    const rating = document.createElement("p");
    // 영화 객체에서 제목, 이미지경로, 내용, 평점 property를 뽑아내 저장한다
    const { name, poster_path, overview, vote_average, id } = movie;
    // 객체에서 뽑아낸 경로를 더해 완성한 이미지 전체 경로
    const url = baseUrl + posterSize + poster_path;
    // console.log(name, poster_path);

    // 생성한 DOM element에 필요한 데이터를 넣어주는 과정
    card.setAttribute("data-id", id);
    card.classList.add("movie-card");
    img.setAttribute("src", url);
    img.setAttribute("alt", name);
    div.classList.add("movie-card-content");
    title.innerText = name;
    title.classList.add("movie-title");
    contents.innerText = overview;
    contents.classList.add("movie-overview");
    rating.innerText = `rating: ${vote_average}`;
    rating.classList.add("movie-rating");
    div.appendChild(title);
    div.appendChild(contents);
    div.appendChild(rating);
    card.appendChild(img);
    card.appendChild(div);
    cardList.appendChild(card);
  });
};
getMovies();
