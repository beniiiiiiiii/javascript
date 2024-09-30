let currentTime = new Date();
let currentHours = currentTime.getHours();
let currentMinutes = currentTime.getMinutes();
let currentSeconds = currentTime.getSeconds();

let totalSecondsInADay = 24 * 60 * 60; // 86400
let currentTotalSeconds = (currentHours * 60 * 60) + (currentMinutes * 60) + currentSeconds;
let remainingSeconds = totalSecondsInADay - currentTotalSeconds;

document.getElementById("result").innerHTML = `Remaining seconds: ${remainingSeconds}`;