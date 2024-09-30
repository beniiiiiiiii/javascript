const generateButton = document.querySelector('#generate');
const outputDiv = document.querySelector('#output');

generateButton.addEventListener('click', () => {
    let output = '';
    let skipCount = 1;
    let skipNumber = 3;
    let currentNumber = 1;

    while (currentNumber <= 100) {
        if (currentNumber === skipNumber) {
            skipNumber += 3 * skipCount;
            skipCount++;
            currentNumber++;
        } else {
            output += currentNumber + ', ';
            currentNumber++;
        }
    }

    output = output.slice(0, -2); // remove trailing comma and space
    outputDiv.textContent = output;
});