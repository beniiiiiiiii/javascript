document.getElementById("calculate").addEventListener("click", function(event) {
    event.preventDefault();
    let score = parseInt(document.getElementById("score").value);
  
    if (score < 0 || score > 100) {
      document.getElementById("result").innerHTML = "Invalid score. Please enter a value between 0 and 100.";
    } else {
      let grade;
      if (score >= 90) {
        grade = "A";
      } else if (score >= 80) {
        grade = "B";
      } else if (score >= 70) {
        grade = "C";
      } else if (score >= 60) {
        grade = "D";
      } else {
        grade = "F";
      }
      document.getElementById("result").innerHTML = `Your grade is: ${grade}`;
    }
  });