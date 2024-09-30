const form = document.querySelector('form');
const squareDiv = document.querySelector('#square');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const size = parseInt(document.querySelector('#size').value);
    let square = '';

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (i === 0 || i === size - 1 || j === 0 || j === size - 1) {
                square += '%';
            } else if (i === j || i + j === size - 1) {
                square += '%';
            } else {
                square += ' ';
            }
            if (j < size - 1) {
                square += ' ';
            }
        }
        square += '\n';
    }

    squareDiv.textContent = square;
});