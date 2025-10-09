document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          alert("Sikeres bejelentkezés!");
          window.location.href = "posts.html";
        } else {
          alert(data.message || "Bejelentkezés sikertelen.");
        }
      })
      .catch((error) => {
        console.error("Hiba a bejelentkezés során:", error);
        alert("Szerverhiba.");
      });
  });
