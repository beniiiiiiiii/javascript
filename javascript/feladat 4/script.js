const inputString = document.getElementById('input-string');
const submitBtn = document.getElementById('submit-btn');
const outputDiv = document.getElementById('output');

submitBtn.addEventListener('click', () => {
  const userInput = inputString.value;
  let output = '';

  for (let i = 0; i < userInput.length; i++) {
    output += userInput[i] + '<br>';
  }

  outputDiv.innerHTML = output;
});