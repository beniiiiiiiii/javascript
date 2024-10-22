const numbers = [2, 13, 3, 7, 17, 5, 11, 19, 9];
const names = ['Eva', 'Adel', 'Cedric', 'Dior', 'Frank', 'Bob'];
const fruits = ['pineapple', 'kiwi', 'banana', 'pear', 'cherry'];

function sortByLength(array) {
    return array.sort((a, b) => a.length - b.length);
}

function sortByLengthAsc(array) {
    return array.sort((a, b) => a.length - b.length || a.localeCompare(b));
}

function sortFrom15(array) {
    return array.sort((a, b) => Math.abs(a - 15) - Math.abs(b - 15));
}

function addAsterisk(array) {
    return array.map(item => `*${item}*`);
}

function between5And15(array) {
    return array.filter(num => num >= 5 && num <= 15);
}

function isAllOdd(array) {
    return array.every(num => num % 2 !== 0);
}

function hasEven(array) {
    return array.some(num => num % 2 === 0);
}

function sigma(array) {
    return array.reduce((product, num) => product * num, 1);
}

console.log(sortByLength(names)); 
console.log(sortByLengthAsc(fruits)); 
console.log(sortFrom15(numbers)); 
console.log(addAsterisk(names)); 
console.log(between5And15(numbers)); 
console.log(isAllOdd(numbers)); 
console.log(hasEven(numbers)); 
console.log(sigma(numbers)); 