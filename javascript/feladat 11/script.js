const form = document.querySelector('form');
const resultDiv = document.querySelector('#result');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const number = parseInt(document.querySelector('#number').value);
    let factorial = 1;

    for (let i = 1; i <= number; i++) {
        factorial *= i;
    }

    resultDiv.textContent = `${number} factorial is ${factorial}.`;
});