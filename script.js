// Hozz létre egy js fájlt, mely megoldaj a az alábbi feladatokat.
// Mindegyik feladatot függvénnyel old meg!

// 1. getOtosLotteryNumbers - Ötöslottó számokat generál le véletlenszerűen, melyeket egy tömbben ad vissza.
const getOtosLotteryNumbers = () => {
  let numbers = [];
  while (numbers.length < 5) {
    let number = Math.floor(Math.random() * 90) + 1;
    if (!numbers.includes(number)) {
      numbers.push(number);
    }
  }
  return numbers;
};

// 2. getSortedtLotteryNumbers - paraméterrként kapott tömböt növekvő sorrendbe rendezi, a rendezett tömböt visszaadja
const getSortedtLotteryNumbers = (numbers) => {
  return numbers.sort((a, b) => a - b);
};

// 3. getNumberOfHits - két paramétert kap, egy tömböt lottószámokkal és egy tömböt a tippekkel. Visszaadja, hogy a tippekből ány egyezett meg a lottószámokkal
const getNumberOfHits = (lotteryNumbers, tips) => {
  let hits = 0;
  tips.forEach((tip) => {
    if (lotteryNumbers.includes(tip)) {
      hits++;
    }
  });
  return hits;
};

// 4. getMonthlyLotteryArrayNumbers - négy hét lottószámait adja vissza egy tömbben, mely a heti lottószámok tömbjét tartalmazza (meghívja a getOtosLotteryNumbers függvényt)
const getMonthlyLotteryArrayNumbers = () => {
  let monthlyLotteryNumbers = [];
  for (let i = 0; i < 4; i++) {
    monthlyLotteryNumbers.push(getOtosLotteryNumbers());
  }
  return monthlyLotteryNumbers;
};

// 5. getMonthlyLotteryArrayNumbers - paraméterként kapja a négy hét lottószámainak tömbjét és visszaadja, hogy a hónapban mely számokat húzták ki. A viszatérő listában, minden szám csak egyszer szerepelhet.
const getMonthlyLotteryNumbers = (monthlyLotteryNumbers) => {
  let numbers = [];
  monthlyLotteryNumbers.forEach((week) => {
    week.forEach((number) => {
      if (!numbers.includes(number)) {
        numbers.push(number);
      }
    });
  });
  return numbers;
};

// 6. monthlyStatistics - paranéterként kapha a havi lottószámok tömbjét. Egy tömböt ad vissza, melynek elemei tömbök, melyben az első elem a lottószám, a második eleme, hogy a hónapban a számot hányszor húzták ki.

const monthlyStatistics = (monthlyLotteryNumbers) => {
  let numbers = getMonthlyLotteryNumbers(monthlyLotteryNumbers);
  let statistics = [];
  numbers.forEach((number) => {
    let count = 0;
    monthlyLotteryNumbers.forEach((week) => {
      if (week.includes(number)) {
        count++;
      }
    });
    statistics.push([number, count]);
  });
  return statistics;
};
