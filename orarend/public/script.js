document.addEventListener("DOMContentLoaded", async () => {
  const currentPath = window.location.pathname;

  if (currentPath.includes("/edit-class")) {
    const classId = window.location.pathname.split("/").pop();

    if (!classId) {
      alert("Class ID is missing!");
      return;
    }

    try {
      const response = await fetch(`/classes/${classId}`);
      const classData = await response.json();

      if (response.ok) {
        document.getElementById("class-name").value = classData.class_name;
        document.getElementById("teacher-name").value = classData.teacher;
        document.getElementById("room-number").value = classData.room;
      } else {
        alert("Class not found.");
      }
    } catch (err) {
      console.error("Failed to fetch class data:", err);
    }
  }

  if (currentPath === "/" || currentPath === "/index.html") {
    try {
      const response = await fetch("/classes");
      const allClasses = await response.json();

      const buttons = document.querySelectorAll(".class-button");

      buttons.forEach((button) => {
        const day = button.dataset.day;
        const period = button.dataset.period;

        const classMatch = allClasses.find(
          (cls) => cls.day === day && cls.period == period
        );

        if (!classMatch) {
          button.addEventListener("click", () => {
            window.location.href = `/add-class?day=${day}&period=${period}`;
          });
        } else {
          const classDiv = document.createElement("div");
          classDiv.className = "class-info";
          classDiv.innerHTML = `
            <strong>${classMatch.class_name}</strong><br>
            ${classMatch.teacher} - Room ${classMatch.room}
            <div class="buttons" style="display: none;">
              <button class="edit-btn" data-id="${classMatch.id}">Edit</button>
              <button class="delete-btn" data-id="${classMatch.id}">Delete</button>
            </div>
          `;

          classDiv.addEventListener("mouseenter", () => {
            classDiv.querySelector(".buttons").style.display = "block";
          });

          classDiv.addEventListener("mouseleave", () => {
            classDiv.querySelector(".buttons").style.display = "none";
          });

          classDiv
            .querySelector(".delete-btn")
            .addEventListener("click", async () => {
              if (confirm("Are you sure you want to delete this class?")) {
                await fetch(`/classes/${classMatch.id}`, { method: "DELETE" });
                const newBtn = document.createElement("button");
                newBtn.className = "class-button";
                newBtn.dataset.day = day;
                newBtn.dataset.period = period;
                newBtn.textContent = "+";
                newBtn.onclick = () => addClass(newBtn);
                classDiv.replaceWith(newBtn);
              }
            });

          classDiv.querySelector(".edit-btn").addEventListener("click", () => {
            window.location.href = `/edit-class/${classMatch.id}`;
          });

          button.replaceWith(classDiv);
        }
      });
    } catch (error) {
      console.error("Failed to load classes:", error);
    }
  }

  if (currentPath.includes("/edit-class")) {
    const classId = window.location.pathname.split("/").pop();

    if (!classId) {
      alert("Class ID is missing!");
      return;
    }

    try {
      const response = await fetch(`/classes/${classId}`);
      const classData = await response.json();

      if (response.ok) {
        currentDay = classData.day;
        currentPeriod = classData.period;

        document.getElementById("class-name").value = classData.class_name;
        document.getElementById("teacher-name").value = classData.teacher;
        document.getElementById("room-number").value = classData.room;
      } else {
        alert("Class not found.");
      }
    } catch (err) {
      console.error("Failed to fetch class data:", err);
    }
  }
});

function addClass(button) {
  const day = button.getAttribute("data-day");
  const period = button.getAttribute("data-period");

  const redirectUrl = `http://localhost:3000/add-class?day=${day}&period=${period}`;

  window.location.href = redirectUrl;
}

async function addClassToDB() {
  const urlParams = new URLSearchParams(window.location.search);
  const day = urlParams.get("day");
  const period = urlParams.get("period");

  const class_name = document.getElementById("class-name").value.trim();
  const teacher = document.getElementById("teacher-name").value.trim();
  const room = document.getElementById("room-number").value.trim();

  const data = {
    day,
    period,
    class_name,
    teacher,
    room,
  };

  if (!day || !period) {
    alert("Missing day or period.");
    return;
  }

  try {
    const response = await fetch("/classes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("Server response:", result);

    if (response.ok) {
      alert("Class added successfully!");

      document.getElementById("class-name").value = "";
      document.getElementById("teacher-name").value = "";
      document.getElementById("room-number").value = "";

      window.location.href = "/";
    }
  } catch (err) {
    console.error("Error:", err);
    alert("There was an error adding the class.");
  }
}

//-------------------------------------edit---------------------------------------------------------------------//
let currentDay, currentPeriod = null;

async function editClassInDB() {
  const urlParams = new URLSearchParams(window.location.search);
  const classId = window.location.pathname.split("/").pop();

  const class_name = document.getElementById("class-name").value.trim();
  const teacher = document.getElementById("teacher-name").value.trim();
  const room = document.getElementById("room-number").value.trim();

  const data = {
    day: currentDay,
    period: parseInt(currentPeriod, 10),
    class_name,
    teacher,
    room,
  };

  console.log("Submitting to server:", data);

  try {
    const response = await fetch(`/classes/${classId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log(response);

    const result = await response.json();
    if (response.ok) {
      alert("Class updated successfully!");
      window.location.href = "/";
    } else {
      alert(result.message || "There was an error updating the class.");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("There was an error updating the class.");
  }
}