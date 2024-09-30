const submitBtn = document.getElementById('submit-btn');
const outputDiv = document.getElementById('output');

submitBtn.addEventListener('click', () => {
  let output = '';
  let num = 10;

  while (num <= 30) {
    output += `${num}: `;
    for (let i = 1; i <= num; i++) {
      if (num % i === 0) {
        output += `${i}, `;
      }
    }
    output = output.slice(0, -2) + '<br>'; // remove trailing comma and space
    num++;
  }

  outputDiv.innerHTML = output;
});