const BASE = "http://localhost:4000/api";
let token = localStorage.getItem("token") || null;

// ===== AUTH =====
async function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const res = await fetch(BASE + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (res.ok) {
    token = data.token;
    localStorage.setItem("token", token);
    window.location.href = "index.html";
  } else {
    alert(data.error || "Login failed");
  }
}

async function register() {
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  const res = await fetch(BASE + "/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (res.ok) {
    token = data.token;
    localStorage.setItem("token", token);
    window.location.href = "index.html";
  } else {
    alert(data.error || "Register failed");
  }
}

function logout() {
  token = null;
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

// ===== MOVIES =====
async function loadMovies() {
  const res = await fetch(BASE + "/movies");
  const movies = await res.json();
  const div = document.getElementById("movies-list");
  if (!div) return;
  div.innerHTML = "";
  movies.forEach((m) => {
    div.innerHTML += `
      <div>
        <span>${m.title} (${m.year}) - ${m.genre}</span>
        <span>
          <button class="action primary" onclick="addToWatchlist(${m.id})">+</button>
          <button class="action" onclick="openEdit(${m.id},'${m.title}','${m.year}','${m.genre}')">Edit</button>
          <button class="action danger" onclick="deleteMovie(${m.id})">Delete</button>
        </span>
      </div>`;
  });
}

async function addMovie() {
  const title = document.getElementById("movie-title").value;
  const year = document.getElementById("movie-year").value;
  const genre = document.getElementById("movie-genre").value;
  const msg = document.getElementById("add-msg");
  if (!token) {
    msg.textContent = "You must login first!";
    msg.style.color = "red";
    return;
  }
  const res = await fetch(BASE + "/movies", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ title, year, genre }),
  });
  if (res.ok) {
    msg.textContent = "Movie added successfully!";
    msg.style.color = "green";
    document.getElementById("movie-title").value = "";
    document.getElementById("movie-year").value = "";
    document.getElementById("movie-genre").value = "";
  } else {
    msg.textContent = "Error adding movie";
    msg.style.color = "red";
  }
}

function openEdit(id, title, year, genre) {
  document.getElementById("edit-id").value = id;
  document.getElementById("edit-title").value = title;
  document.getElementById("edit-year").value = year;
  document.getElementById("edit-genre").value = genre;
  document.getElementById("edit-modal").classList.remove("hidden");
}

function closeEdit() {
  document.getElementById("edit-modal").classList.add("hidden");
}

async function saveMovieEdit() {
  const id = document.getElementById("edit-id").value;
  const title = document.getElementById("edit-title").value;
  const year = document.getElementById("edit-year").value;
  const genre = document.getElementById("edit-genre").value;
  await fetch(BASE + "/movies/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ title, year, genre }),
  });
  closeEdit();
  loadMovies();
}

async function deleteMovie(id) {
  if (!token) return alert("Login first");
  await fetch(BASE + "/movies/" + id, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  });
  loadMovies();
}

// ===== WATCHLIST =====
async function loadWatchlist() {
  if (!token) return;
  const res = await fetch(BASE + "/watchlist", {
    headers: { Authorization: "Bearer " + token },
  });
  const list = await res.json();
  const div = document.getElementById("watchlist-list");
  if (!div) return;
  div.innerHTML = "";
  list.forEach((m) => {
    div.innerHTML += `
      <div>
        <span>${m.title} (${m.year}) - ${m.genre}</span>
        <button class="action danger" onclick="removeFromWatchlist(${m.id})">x</button>
      </div>`;
  });
}

async function addToWatchlist(id) {
  if (!token) return alert("Login first");
  await fetch(BASE + "/watchlist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ movie_id: id }),
  });
  loadWatchlist();
}

async function removeFromWatchlist(id) {
  await fetch(BASE + "/watchlist/" + id, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  });
  loadWatchlist();
}

// ===== LOGIN CHECK =====
function checkLogin() {
  if (token) {
    const warning = document.getElementById("login-warning");
    if (warning) warning.classList.add("hidden");
    const moviesCard = document.getElementById("movies-card");
    const watchlistCard = document.getElementById("watchlist-card");
    if (moviesCard) moviesCard.classList.remove("hidden");
    if (watchlistCard) watchlistCard.classList.remove("hidden");
    loadMovies();
    loadWatchlist();
  } else {
    const warning = document.getElementById("login-warning");
    if (warning) warning.classList.remove("hidden");
    const moviesCard = document.getElementById("movies-card");
    const watchlistCard = document.getElementById("watchlist-card");
    if (moviesCard) moviesCard.classList.add("hidden");
    if (watchlistCard) watchlistCard.classList.add("hidden");
  }
}

async function loadMovies() {
  if (!token) return;
  const res = await fetch(BASE + "/movies", {
    headers: { Authorization: "Bearer " + token },
  });
  const movies = await res.json();
  const div = document.getElementById("movies-list");
  if (!div) return;
  div.innerHTML = "";
  movies.forEach((m) => {
    div.innerHTML += `
      <div>
        <span>${m.title} (${m.year}) - ${m.genre}</span>
        <span>
          <button class="action primary" onclick="addToWatchlist(${m.id})">+</button>
          <button class="action" onclick="openEdit(${m.id},'${m.title}','${m.year}','${m.genre}')">Edit</button>
          <button class="action danger" onclick="deleteMovie(${m.id})">Delete</button>
        </span>
      </div>`;
  });
}

function logout() {
  token = null;
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", checkLogin);
