const inputString = document.getElementById('input-string');
const submitBtn = document.getElementById('submit-btn');
const outputDiv = document.getElementById('output');

submitBtn.addEventListener('click', () => {
  const userInput = inputString.value;
  let output = '';

  for (let i = 0; i < userInput.length; i++) {
    if (!isNaN(userInput.charCodeAt(i)) || userInput.charCodeAt(i) < 65 || (userInput.charCodeAt(i) > 90 && userInput.charCodeAt(i) < 97) || userInput.charCodeAt(i) > 122) {
      break;
    }
    output += userInput[i] + '<br>';
  }

  outputDiv.innerHTML = output;
});