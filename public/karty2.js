const deckCards = ["kiwi.png","kiwi.png","pomarancze.png","pomarancze.png","banany.png","banany.png","grejfrut.png","grejfrut.png",
"arbuz.png","arbuz.png","maliny.png","maliny.png","winogrono.png","winogrono.png","wisnie.png","wisnie.png"
,"borowki.png","borowki.png","gruszka.png","gruszka.png","ananas.png","ananas.png","limonka.png","limonka.png"]; 

const deck = document.querySelector(".deck");
let opened = [];
let matched = [];
const reset = document.querySelector(".reset-btn");
const playAgain = document.querySelector(".play-again-btn");
const movesCount = document.querySelector(".moves-counter");
let moves = 0;
const timeCounter = document.querySelector(".timer");
let time;
let minutes = 0;
let seconds = 0;
let timeStart = false;

function sendData(data){
  console.log(data)
  fetch("/auth/saveScore", {
    method: "POST", 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:');
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

function shuffle(array) {
 let currentIndex = array.length, temporaryValue, randomIndex;

 while (currentIndex !== 0) {
     randomIndex = Math.floor(Math.random() * currentIndex);
     currentIndex -= 1;
     temporaryValue = array[currentIndex];
     array[currentIndex] = array[randomIndex];
     array[randomIndex] = temporaryValue;
 }
 return array;
}

function startGame() {
 const shuffledDeck = shuffle(deckCards); 
 for (let i = 0; i < shuffledDeck.length; i++) {
   const liTag = document.createElement('LI');
   liTag.classList.add('card');
   const addImage = document.createElement("IMG");
   liTag.appendChild(addImage);
   addImage.setAttribute("src", "img/" + shuffledDeck[i]);
   deck.appendChild(liTag);
 }
}

startGame();

function removeCard() {
 while (deck.hasChildNodes()) {
   deck.removeChild(deck.firstChild);
 }
}

function timer() {
 time = setInterval(function() {
   seconds++;
     if (seconds === 60) {
       minutes++;
       seconds = 0;
     }
     if(minutes < 10 && seconds < 10 )
     {
      timeCounter.innerHTML = "<i class='fa fa-hourglass-start'></i>" + " Timer: 0" + minutes + ":0"+ seconds;
     }
     else if(minutes > 9 && seconds < 10)
       timeCounter.innerHTML = "<i class='fa fa-hourglass-start'></i>" + " Timer:  " + minutes + ":0"+ seconds;
     else if(minutes > 9 && seconds > 9)
      timeCounter.innerHTML = "<i class='fa fa-hourglass-start'></i>" + " Timer:  " + minutes + ":"+ seconds;
     else if(minutes < 9 && seconds > 9)
      timeCounter.innerHTML = "<i class='fa fa-hourglass-start'></i>" + " Timer:  0" + minutes + ":"+ seconds;
 }, 1000);
}

function stopTime() {
 clearInterval(time);
}

function resetEverything() {
 stopTime();
 timeStart = false;
 seconds = 0;
 minutes = 0;
 timeCounter.innerHTML = "<i class='fa fa-hourglass-start'></i>" + " Timer: 00:00";
 moves = 0;
 movesCount.innerHTML = 0;
 matched = [];
 opened = [];
 removeCard();
 startGame();
}

function movesCounter() {
 movesCount.innerHTML ++;
 moves ++;
}


function compareTwo() {
 if (opened.length === 2) {
     document.body.style.pointerEvents = "none";
 }
 if (opened.length === 2 && opened[0].src === opened[1].src) {
   match();
 } else if (opened.length === 2 && opened[0].src != opened[1].src) {
   noMatch();
 }
}

function match() {
 setTimeout(function() {
   opened[0].parentElement.classList.add("match");
   opened[1].parentElement.classList.add("match");
   matched.push(...opened);
   document.body.style.pointerEvents = "auto";
   winGame();
   opened = [];
 }, 600);
 movesCounter();
}

function noMatch() {
 setTimeout(function() {
   opened[0].parentElement.classList.remove("flip");
   opened[1].parentElement.classList.remove("flip");
   document.body.style.pointerEvents = "auto";
   opened = [];
 }, 700);
 movesCounter();
}

function winGame() {
 if (matched.length === 24) {
   stopTime();
   var scTime = seconds + (minutes * 60);
   const data = {scTime, moves, difficulty: 'medium'};
   sendData(data);
 }
}

deck.addEventListener("click", function(evt) {
 if (evt.target.nodeName === "LI") {
   console.log(evt.target.nodeName + " Was clicked");
   if (timeStart === false) {
     timeStart = true; 
     timer();
   }
   flipCard();
 }

 function flipCard() {
   evt.target.classList.add("flip");
   addToOpened();
 }
  
 function addToOpened() {
   if (opened.length === 0 || opened.length === 1) {
     opened.push(evt.target.firstElementChild);
   }
   compareTwo();
 }
});

reset.addEventListener('click', resetEverything);

