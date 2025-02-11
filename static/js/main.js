document.addEventListener("DOMContentLoaded", function () {
  let game = new Chess();
  let moveHistory = [];
  let currentMove = -1;

  // Initialize chessboard
  const board = Chessboard("board", {
    position: "start",
    pieceTheme: "/static/img/chesspieces/{piece}.svg",
  });

  // Dark mode handling
  const darkModeToggle = document.getElementById("darkModeToggle");
  const icon = darkModeToggle.querySelector("i");

  // Check for saved theme preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
    icon.className = savedTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
  }

  darkModeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    // Toggle icon
    icon.className = newTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
  });

  // Add navigation buttons
  const navigationDiv = document.createElement("div");
  navigationDiv.className = "text-center mt-3";
  navigationDiv.innerHTML = `
        <div class="btn-group">
            <button class="btn btn-outline-secondary" id="startBtn">⟨⟨</button>
            <button class="btn btn-outline-secondary" id="prevBtn">⟨</button>
            <button class="btn btn-outline-secondary" id="nextBtn">⟩</button>
            <button class="btn btn-outline-secondary" id="endBtn">⟩⟩</button>
        </div>
    `;
  document.getElementById("board").parentNode.appendChild(navigationDiv);

  // Navigation button handlers
  document.getElementById("startBtn").addEventListener("click", () => {
    if (moveHistory.length > 0) {
      currentMove = -1;
      game.reset();
      board.position(game.fen());
      updateButtons();
    }
  });

  document.getElementById("prevBtn").addEventListener("click", () => {
    if (currentMove >= 0) {
      currentMove--;
      game.undo();
      board.position(game.fen());
      updateButtons();
    }
  });

  document.getElementById("nextBtn").addEventListener("click", () => {
    if (currentMove < moveHistory.length - 1) {
      currentMove++;
      game.move(moveHistory[currentMove]);
      board.position(game.fen());
      updateButtons();
    }
  });

  document.getElementById("endBtn").addEventListener("click", () => {
    while (currentMove < moveHistory.length - 1) {
      currentMove++;
      game.move(moveHistory[currentMove]);
    }
    board.position(game.fen());
    updateButtons();
  });

  function updateButtons() {
    document.getElementById("startBtn").disabled = currentMove === -1;
    document.getElementById("prevBtn").disabled = currentMove === -1;
    document.getElementById("nextBtn").disabled =
      currentMove === moveHistory.length - 1;
    document.getElementById("endBtn").disabled =
      currentMove === moveHistory.length - 1;
  }

  // Handle form submission
  const form = document.getElementById("pgnForm");
  const convertBtn = document.getElementById("convertBtn");
  const spinner = convertBtn.querySelector(".spinner-border");
  const errorAlert = document.getElementById("errorAlert");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    errorAlert.classList.add("d-none");
    convertBtn.disabled = true;
    spinner.classList.remove("d-none");

    try {
      const formData = new FormData(form);
      const response = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to convert PGN");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "chess_game.gif";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      errorAlert.textContent = error.message;
      errorAlert.classList.remove("d-none");
    } finally {
      convertBtn.disabled = false;
      spinner.classList.add("d-none");
    }
  });

  // Preview PGN when text is pasted
  const pgnText = document.getElementById("pgnText");
  pgnText.addEventListener("input", function () {
    try {
      game.reset();
      moveHistory = [];
      currentMove = -1;

      if (this.value.trim() && game.load_pgn(this.value)) {
        moveHistory = game.history();
        currentMove = moveHistory.length - 1;
        board.position(game.fen());
      }
      updateButtons();
    } catch (e) {
      // Invalid PGN, ignore
      console.log("Invalid PGN:", e);
    }
  });
});
