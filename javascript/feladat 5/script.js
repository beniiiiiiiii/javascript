const inputNumber = document.getElementById('input-number');
const submitBtn = document.getElementById('submit-btn');
const outputDiv = document.getElementById('output');

submitBtn.addEventListener('click', () => {
  const userInput = inputNumber.value;
  let sum = 0;
  let count = 0;

  for (let i = 0; i < userInput.toString().length; i++) {
    let digit = parseInt(userInput.toString()[i]);
    sum += digit;
    count++;
  }

  let average = sum / count;
  outputDiv.innerHTML = `The average of digits is ${average.toFixed(6)}`;
});