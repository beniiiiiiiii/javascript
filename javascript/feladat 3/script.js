const form = document.querySelector('form');
const yearInput = document.querySelector('#year');
const resultPara = document.querySelector('#result');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const year = parseInt(yearInput.value);
    if (isLeapYear(year)) {
        resultPara.textContent = `${year} is a leap year!`;
    } else {
        resultPara.textContent = `${year} is not a leap year.`;
    }
});

function isLeapYear(year) {
    if (year % 4 === 0) {
        if (year % 100 === 0) {
            if (year % 400 === 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    } else {
        return false;
    }
}