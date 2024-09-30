const form = document.querySelector('form');
const resultDiv = document.querySelector('#result');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const player1 = parseInt(document.querySelector('#player1').value);
    const player2 = parseInt(document.querySelector('#player2').value);

    let winner;
    if (player1 === player2) {
        winner = 'The game is a tie.';
    } else if ((player1 === 1 && player2 === 2) || (player1 === 2 && player2 === 3) || (player1 === 3 && player2 === 1)) {
        winner = 'The second player wins.';
    } else {
        winner = 'The first player wins.';
    }

    resultDiv.textContent = winner;
});