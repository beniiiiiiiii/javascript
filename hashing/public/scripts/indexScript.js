// Login form validáció (login.html)
document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username && password) {
      alert("Sikeres bejelentkezés!");
    } else {
      alert("Kérlek, töltsd ki az összes mezőt!");
    }
  });

// Posztok betöltése (posts.html)
window.onload = function () {
  const postsContainer = document.getElementById("posts");
  const posts = [
    "Első poszt tartalom.",
    "Második poszt tartalom.",
    "Harmadik poszt tartalom.",
  ];

  if (posts.length > 0) {
    postsContainer.innerHTML = posts.map((post) => `<p>${post}</p>`).join("");
  } else {
    postsContainer.innerHTML = "<p>Jelenleg nincs elérhető poszt.</p>";
  }
};
