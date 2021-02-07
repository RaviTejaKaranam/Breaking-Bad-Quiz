// Declarations          
const REQUEST_URL = "https://www.breakingbadapi.com/api/character/random";
const image = document.querySelector(".image-container img");
let nameOfTheCharacter = "";
let timeLimit = 121;
let totalNumberOfChances = 5;
let concealedName = [];
let numberOfGuesses = 5;
const button = document.querySelector(".btn");
let interval;
let count;
let wrongGuesses = [];
const outerContainer = document.querySelector(".outer-container");
const messageDiv = document.createElement("div");
const chanceCount = document.querySelector(".chance-count");
const numberOfChances = document.createElement("p");
const instructions = document.querySelector(".instructions");
const startQuiz = document.getElementById("start-quiz");
const heading = document.querySelector(".heading")

// Starting the quiz 
startQuiz.addEventListener("click", () => {
  document.body.style.zIndex = "5";
  instructions.style.display = "none";
  heading.style.opacity = 1;
  outerContainer.style.opacity = 1;

  getCharacter()
});

// Function to get a character 
async function getCharacter() {
  let response;
  let data;
  try {
    response = await fetch(REQUEST_URL);
    data = await response.json();
  } catch (err) {
    alert(err);
  }
  let imageUrl = data[0].img;
  nameOfTheCharacter = data[0].name;
  image.src = imageUrl;
  image.style.filter = "blur(30px)";
  getPuzzle(nameOfTheCharacter, imageUrl);
}

// Reset function 
button.addEventListener("click", () => {
  nameOfTheCharacter = "";
  timeLimit = 121;
  totalNumberOfChances = 5;
  concealedName = [];
  numberOfGuesses = 5;
  clearInterval(interval);
  count = 0;
  wrongGuesses = [];
  messageDiv.innerHTML = "";
  numberOfChances.classList.add("chances");
  numberOfChances.innerHTML = numberOfGuesses;
  numberOfChances.classList.remove("red");
  chanceCount.appendChild(numberOfChances);
  getCharacter();
});

//Creating the puzzle 
function getPuzzle(characterName, characterImage) {
  image.src = characterImage;
  image.classList.add("character");
  nameOfTheCharacter = characterName.toLowerCase().split("");
  nameOfTheCharacter.forEach((letter) => {
    if (letter === " ") {
      concealedName.push(" ");
    } else {
      concealedName.push("*");
    }
  });
  renderTime();
  render(concealedName);
}

// Rendering the puzzle 
function render(concealedName) {
  const wordContainer = document.querySelector(".word-container");
  wordContainer.innerHTML = "";
  concealedName.forEach((letter) => {
    let span = document.createElement("span");
    span.classList.add("letter");
    if (letter === " ") {
      span.textContent = " ";
      span.classList.add("space");
    } else if (letter === "*") {
      span.textContent = " ";
    } else {
      span.textContent = letter;
    }
    wordContainer.appendChild(span);
  });
}

const timer = document.querySelector(".timer");
const timeEl = document.createElement("span");
// Rendering Time 
function renderTime() {
  timeEl.classList.add("time-display");
  interval = setInterval(function () {
    if (timeLimit === 0 || numberOfGuesses === 0) {
      timeLimit++;
      clearInterval(interval);
      displayAnswer();
    }
    if (timeLimit <= 30) {
      timeEl.classList.add("red");
    }
    if (numberOfGuesses <= 3) {
      numberOfChances.classList.add("red");
    }
    timeLimit--;
    timeEl.innerHTML = timeLimit;
    timer.appendChild(timeEl);
  }, 1000);
}
// Rendering Image 
function renderImage(concealedName) {
  let lengthOfName = nameOfTheCharacter.length;
  count = 0;
  let concealedNameString = concealedName.join("");
  // console.log(concealedNameString);
  for (let i = 0; i < concealedNameString.length; i++) {
    if (concealedNameString[i] === "*") {
    } else {
      count++;
      if (count === lengthOfName) {
        clearInterval(interval);
        congratsMessage();
        break;
      }
    }
  }
  // Decreasing blur on correct guesses 
  let percentage = Math.floor((count / lengthOfName) * 100);
  let blurDecrease = 30 - Math.floor((percentage * 30) / 100);
  image.style.filter = `blur(${blurDecrease}px)`;
}

numberOfChances.classList.add("chances");
numberOfChances.innerHTML = numberOfGuesses;
chanceCount.appendChild(numberOfChances);
// Taking input based on time and number of guesses left  
window.addEventListener("keypress", (e) => {
  if (
    timeLimit > 0 &&
    numberOfGuesses > 0 &&
    count !== nameOfTheCharacter.length
  ) {
    let pressedKey = e.key;
    if (
      !nameOfTheCharacter.includes(pressedKey) &&
      !wrongGuesses.includes(pressedKey)
    ) {
      numberOfGuesses--;
      numberOfChances.innerHTML = "";
      numberOfChances.innerHTML = numberOfGuesses;
      chanceCount.appendChild(numberOfChances);
      wrongGuesses.push(pressedKey);
    }
    for (let i = 0; i < nameOfTheCharacter.length; i++) {
      if (nameOfTheCharacter[i] === pressedKey) {
        concealedName[i] = pressedKey;
      }
    }
    render(concealedName);
    renderImage(concealedName);
  }
});
// If the user fails to answer 
function displayAnswer() {
  messageDiv.classList.add("message");
  messageDiv.innerHTML = `Well tried!!! The answer is ${nameOfTheCharacter
    .join("")
    .toUpperCase()}`;
  image.style.filter = `blur(0px)`;
  outerContainer.appendChild(messageDiv);
}
// if the user answers the puzzle 
function congratsMessage() {
  numberOfChances.classList.remove("red");
  timeEl.classList.remove("red");
  messageDiv.classList.add("message");
  messageDiv.innerHTML = `Congratulations!! You got it right 🎉🎉`;
  outerContainer.appendChild(messageDiv);
}
