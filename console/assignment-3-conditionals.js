// Assignment 3: Conditional Logic Implementation

const score = Number(prompt("Enter your test score (0-100):", "85"));

if (isNaN(score) || score < 0 || score > 100) {
  console.log("Invalid score. Please enter a number between 0 and 100.");
} else {
  let grade;

  // switch decides the letter grade (score / 10 gives us the tens digit)
  switch (Math.floor(score / 10)) {
    case 10:
    case 9:
      grade = "A";
      break;
    case 8:
      grade = "B";
      break;
    case 7:
      grade = "C";
      break;
    case 6:
    case 5:
      grade = "D";
      break;
    default:
      grade = "F";
  }

  // ternary operator decides pass or fail (pass mark is 50)
  const status = score >= 50 ? "Passed" : "Failed";

  console.log("Score: " + score);
  console.log("Grade: " + grade);
  console.log("Status: " + status);
}
