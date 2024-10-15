//feladat 1
function digitsAverage(number) {
    const digits = number.toString();
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
        sum += parseInt(digits[i], 10);
    }

    const average = sum / digits.length;
    
    return average;
}

//feladat 2
function factorial(number) {
    if (number === 0 || number === 1) {
      return 1;
    }
    else {
      let result = 1;
      for (let i = 2; i <= number; i++) {
        result *= i;
      }
      return result;
    }
  }

//feladat 3
function divisors(number) {
    let  divisors = [];
    for (let i = 1; i <= number; i++) {
        if (number % i === 0) {
            divisors.push(i);
        }
    }
    
    return divisors;
}

//feladat 4

function fizzbuzz(number) {
    let outcome = "";
    if (number%3 === 0){
        outcome = "fizz";
    }
    else if (number%5 === 0){
        outcome = "buzz";
    }
    else if (number%3  === 0 && number%5 === 0){
        outcome = "fizzbuzz";
    }
    else if(number%3 != 0 || number%5 != 0){
        outcome = number;
    }

    return outcome
}