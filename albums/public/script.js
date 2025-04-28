// cursor
const customCursor = document.querySelector("[data-cursor-dot]");

window.addEventListener("mousemove", (event) => {
  const x = event.clientX;
  const y = event.clientY;

  customCursor.style.left = `${x}px`;
  customCursor.style.top = `${y}px`;
});

// max year set
const maxYear = new Date().getFullYear();
document.getElementById("releaseYear").setAttribute("max", maxYear);

// Toggle add album
document.getElementById("open_add_album_tab").addEventListener("click", () => {
  toggleFormVisibility("add-album", ["display-album", "listView"]);
});

document.getElementById("close_add_album_tab").addEventListener("click", () => {
  hideForm("add-album");
});

// toggle display album
document.getElementById("open_display_album").addEventListener("click", () => {
  toggleFormVisibility("display-album", ["add-album", "listView"]);
});

document.getElementById("close_display_album_tab").addEventListener("click", () => {
  hideForm("display-album");
});

// toggle list
document.getElementById("open_list_view_tab").addEventListener("click", async () => {
  const listContainer = document.querySelector(".listView");
  clearAlbumCards(listContainer);

  toggleFormVisibility("listView", ["add-album", "display-album"]);

  try {
    const response = await fetch("/albums");
    const albums = await response.json();

    if (!albums || albums.length === 0) {
      alert("No albums found in the database.");
      listContainer.style.display = "none";
      return;
    }

    listContainer.style.display = "flex";
    albums.forEach((album) => addAlbumToListView(album));
  } catch (error) {
    console.error("Error fetching album list:", error);
    alert("Failed to load album list.");
  }
});

document.getElementById("close_list_tab").addEventListener("click", () => {
  hideForm("listView");
});

// save/update
document.getElementById("saveBtn").addEventListener("click", async () => {
  const albumData = getAlbumFormData();

  if (document.getElementById("saveBtn").textContent === "Update album") {
    const albumId = document.getElementById("saveBtn").getAttribute("data-album-id");
    await updateAlbum(albumId, albumData);
  } else {
    await addNewAlbum(albumData);
  }
});

// display album
document.getElementById("submitBtn").addEventListener("click", async () => {
  const albumId = document.getElementById("albumId").value.trim();

  if (!albumId) {
    alert("Please enter an album ID.");
    return;
  }

  try {
    const response = await fetch(`/albums/${albumId}`);
    const album = await response.json();

    if (response.ok) {
      showAlbumDetails(album);
    } else {
      const lastAlbumId = await fetchLastAlbumId();
      alert(lastAlbumId ? `Album not found. Last ID is ${lastAlbumId}.` : "No albums in the database.");
      clearAlbumDetails();
    }
  } catch (error) {
    console.error("Error fetching album:", error);
    alert("Failed to fetch album details.");
    clearAlbumDetails();
  }
});

// Helper functions
function toggleFormVisibility(formToShow, formsToHide) {
  formsToHide.forEach((formClass) => hideForm(formClass));
  const form = document.querySelector(`.${formToShow}`);
  form.style.display = "flex";
  requestAnimationFrame(() => form.classList.add("active"));
}

function hideForm(formClass) {
  const form = document.querySelector(`.${formClass}`);
  form.style.display = "none";
  form.classList.remove("active");
}

function getAlbumFormData() {
  return {
    singer: document.getElementById("singerInput").value.trim(),
    title: document.getElementById("titleInput").value.trim(),
    release_year: document.getElementById("releaseYear").value.trim(),
    song_amount: document.getElementById("songAmount").value.trim(),
  };
}

async function addNewAlbum(data) {
  try {
    const response = await fetch("/albums", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("Album added successfully!");
      resetAlbumForm();
    }
  } catch (error) {
    console.error("Error adding album:", error);
    alert("Failed to add album.");
  }
}

async function updateAlbum(id, data) {
  try {
    const response = await fetch(`/albums/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("Album updated successfully!");
      resetAlbumForm();
    }
  } catch (error) {
    console.error("Error updating album:", error);
    alert("Failed to update album.");
  }
}

function resetAlbumForm() {
  document.getElementById("singerInput").value = "";
  document.getElementById("titleInput").value = "";
  document.getElementById("releaseYear").value = "";
  document.getElementById("songAmount").value = "";
  document.getElementById("saveBtn").textContent = "Save album";
  document.getElementById("saveBtn").removeAttribute("data-album-id");
  document.querySelector(".add-album h2").textContent = "Add album";
}

function showAlbumDetails(album) {
  const albumDisplay = document.getElementById("albumDisplay");
  albumDisplay.innerHTML = `
    <div class="album-card">
      <h3>${album.singer} - ${album.title}</h3>
      <p>Release Year: ${album.release_year}</p>
      <p>Number of Songs: ${album.song_amount}</p>
    </div>
  `;
}

function clearAlbumDetails() {
  document.getElementById("albumDisplay").innerHTML = "";
}

function addAlbumToListView(album) {
  const listView = document.querySelector(".listView");
  const albumCard = document.createElement("div");
  albumCard.classList.add("album-card");

  albumCard.innerHTML = `
    <div class="album-header">
      <h3>${album.singer} - ${album.title}</h3>
      <span>(${album.release_year})</span>
    </div>
    <div class="album-info">
      <p>Songs: ${album.song_amount}</p>
    </div>
  `;

  listView.appendChild(albumCard);
}

async function fetchLastAlbumId() {
  try {
    const response = await fetch("/albums");
    const albums = await response.json();
    return albums.length > 0 ? albums[albums.length - 1].id : null;
  } catch (error) {
    console.error("Error fetching last album ID:", error);
    return null;
  }
}

function clearAlbumCards(container) {
  container.querySelectorAll(".album-card").forEach((card) => card.remove());
}