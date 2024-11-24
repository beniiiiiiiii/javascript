let currentPlayer = 'X';  // Kezdő játékos (X)
let gameBoard = ['', '', '', '', '', '', '', '', ''];  // A játéktábla
let isGameOver = false;
let gameMode = '';  // player-vs-player vagy player-vs-computer

// Inicializálás vagy új játék indítása
function startGame(mode = 'player-vs-player') {
    gameMode = mode;
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    isGameOver = false;
    document.getElementById('result').textContent = '';
    document.getElementById('resetBtn').style.display = 'none';
    renderBoard();
}

// Játéktábla kirajzolása
function renderBoard() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    gameBoard.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.textContent = cell;
        cellElement.addEventListener('click', () => handleClick(index));
        grid.appendChild(cellElement);
    });
}

// A játékos kattintása
function handleClick(index) {
    if (isGameOver || gameBoard[index] !== '') return;

    gameBoard[index] = currentPlayer;
    renderBoard();
    
    // Ellenőrizzük, hogy van-e győztes
    if (checkWinner()) {
        document.getElementById('result').textContent = `${currentPlayer} játékos nyert!`;
        isGameOver = true;
        document.getElementById('resetBtn').style.display = 'block';
        return;
    }

    // Ellenőrizzük, hogy döntetlen-e
    if (gameBoard.every(cell => cell !== '')) {
        document.getElementById('result').textContent = 'A játék döntetlen.';
        isGameOver = true;
        document.getElementById('resetBtn').style.display = 'block';
        return;
    }

    // Következő játékos
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    
    // Ha számítógép játékmód van és a következő lépés a gépé
    if (gameMode === 'player-vs-computer' && currentPlayer === 'O') {
        computerMove();
    }
}

// Számítógép lépése (véletlenszerű)
function computerMove() {
    if (isGameOver) return;

    let availableCells = gameBoard.map((cell, index) => cell === '' ? index : null).filter(cell => cell !== null);
    let randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    gameBoard[randomIndex] = 'O';
    renderBoard();

    if (checkWinner()) {
        document.getElementById('result').textContent = `O játékos nyert!`;
        isGameOver = true;
        document.getElementById('resetBtn').style.display = 'block';
    } else if (gameBoard.every(cell => cell !== '')) {
        document.getElementById('result').textContent = 'A játék döntetlen.';
        isGameOver = true;
        document.getElementById('resetBtn').style.display = 'block';
    } else {
        currentPlayer = 'X';
    }
}

// Nyertes ellenőrzés
function checkWinner() {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
    });
}
