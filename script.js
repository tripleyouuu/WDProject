const images = [
    "https://i.pinimg.com/474x/5e/f2/c1/5ef2c10774641311099b780fb1ccec90.jpg",
    "https://i.pinimg.com/736x/3e/32/68/3e3268cd6b066c94de9992627e7f6c82.jpg",
    "https://i.pinimg.com/736x/40/1b/3a/401b3af13ef6f935d065731a49beaf2e.jpg",
    "https://i.pinimg.com/736x/db/f4/b0/dbf4b0d5c4b045cb4975705434bbd6fd.jpg",
    "https://i.pinimg.com/474x/4f/51/e5/4f51e5976ab36c7f6c6eed1d6a89f717.jpg",
    "https://i.pinimg.com/474x/28/a5/c0/28a5c03ceca122d99e98255a50a97092.jpg"
];
  
const cardImages = [...images, ...images];
const gameGrid = document.getElementById("game-grid");
const stopwatch = document.getElementById("stopwatch");
const restartButton = document.getElementById("restart");
const instructionsButton = document.getElementById("instructions");
const howToPlayModal = document.getElementById("instructions-box");
const closeButton = document.getElementById("close");

let flippedCards = [];
let matchedCards = 0;
let startTime = null;
let timerInterval = null;

/* How to play modal */
function showInstructions() {
    howToPlayModal.setAttribute("style","display:flex");
}
function hideInstructions() {
    howToPlayModal.setAttribute("style","display:none");
}
instructionsButton.addEventListener('click',showInstructions);
closeButton.addEventListener('click',hideInstructions);

/* Shuffle Array */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/* Start Stopwatch */
function startStopwatch() {
  startTime = new Date().getTime();
  timerInterval = setInterval(() => {
    const elapsedTime = Math.floor((new Date().getTime() - startTime) / 1000);
    const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, "0");
    const seconds = String(elapsedTime % 60).padStart(2, "0");
    stopwatch.textContent = `${minutes}:${seconds}`;
  }, 1000);
}

/* Stop Stopwatch */
function stopStopwatch() {
  clearInterval(timerInterval);
}

/* Create Cards */
function createCards() {
  const shuffledImages = shuffleArray(cardImages);
  shuffledImages.forEach((image) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-image", image);
    card.innerHTML = `
      <div class="card-front"></div>
      <div class="card-back" style="background-image: url('${image}')"></div>
    `;
    gameGrid.appendChild(card);

    // Add click event listener for flipping the card
    card.addEventListener("click", () => handleCardClick(card));
  });
}

/* Handle Card Click */
function handleCardClick(card) {
  if (card.classList.contains("flipped") || flippedCards.length === 2) {
    return; // Prevent flipping more than two cards at a time
  }

  card.classList.add("flipped");
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    checkForMatch();
  }

  // Start stopwatch on the first click
  if (!startTime) {
    startStopwatch();
  }
}

/* Check for Match */
function checkForMatch() {
  const [card1, card2] = flippedCards;

  if (card1.dataset.image === card2.dataset.image) {
    // Match found
    flippedCards = [];
    matchedCards += 2;

    if (matchedCards === cardImages.length) {
      stopStopwatch();
      alert(`Congratulations! You completed the game in ${stopwatch.textContent}.`);
    }
  } else {
    // No match - flip cards back after a short delay
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      flippedCards = [];
    }, 1000);
  }
}

/* Reset Game */
function resetGame() {
  gameGrid.innerHTML = ""; // Clear the grid
  stopwatch.textContent = "00:00"; // Reset stopwatch display
  stopStopwatch(); // Clear any existing stopwatch interval
  startTime = null; // Reset timer start time
  flippedCards = []; // Clear flipped cards
  matchedCards = 0; // Reset matched cards count
  createCards(); // Recreate the cards
}

/* Initialize Game */
restartButton.addEventListener("click", resetGame);
resetGame();
