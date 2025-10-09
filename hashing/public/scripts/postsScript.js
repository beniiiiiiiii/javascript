window.onload = function () {
  const postsContainer = document.getElementById("posts");
  const token = localStorage.getItem("token");

  fetch("http://localhost:3000/api/posts", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Nem sikerült a posztokat lekérni.");
      }
      return response.json();
    })
    .then((posts) => {
      if (posts.length > 0) {
        postsContainer.innerHTML = posts
          .map(
            (post) => `
                <div class="post">
                    <h3>${post.title}</h3>
                    <p>${post.content}</p>
                </div>
            `
          )
          .join("");
      } else {
        postsContainer.innerHTML = "<p>Nincs megjeleníthető poszt.</p>";
      }
    })
    .catch((error) => {
      console.error("Hiba a posztok lekérésekor:", error);
      postsContainer.innerHTML =
        "<p>Hiba történt a posztok betöltése során.</p>";
    });
};
