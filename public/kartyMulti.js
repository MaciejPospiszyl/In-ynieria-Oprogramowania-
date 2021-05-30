// const deckCardsHard = ["kiwi.png", "kiwi.png", "pomarancze.png", "pomarancze.png", "banany.png", "banany.png", "grejfrut.png", "grejfrut.png",
//   "arbuz.png", "arbuz.png", "maliny.png", "maliny.png", "winogrono.png", "winogrono.png", "wisnie.png", "wisnie.png"
//   , "borowki.png", "borowki.png", "gruszka.png", "gruszka.png", "ananas.png", "ananas.png", "limonka.png", "limonka.png"
//   , "sliwka.png", "sliwka.png", "agrest.png", "agrest.png", "porzeczka.png", "porzeczka.png", "brzoskwinie.png", "brzoskwinie.png"
//   , "truskawki.png", "truskawki.png", "winogronoBiale.png", "winogronoBiale.png"];

const deckCardsHard = ["kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png",
  "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png"
  , "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", 
  "kiwi.png", "kiwi.png", "kiwi.png"];

// const deckCardsMed = ["kiwi.png", "kiwi.png", "pomarancze.png", "pomarancze.png", "banany.png", "banany.png", "grejfrut.png", "grejfrut.png",
//   "arbuz.png", "arbuz.png", "maliny.png", "maliny.png", "winogrono.png", "winogrono.png", "wisnie.png", "wisnie.png"
//   , "borowki.png", "borowki.png", "gruszka.png", "gruszka.png", "ananas.png", "ananas.png", "limonka.png", "limonka.png"];



/*const deckCardsMed = ["kiwi.png", "kiwi.png", "pomarancze.png", "pomarancze.png", "banany.png", "banany.png", "grejfrut.png", "grejfrut.png",
    "arbuz.png", "arbuz.png", "maliny.png", "maliny.png", "winogrono.png", "winogrono.png", "wisnie.png", "wisnie.png", "borowki.png", "borowki.png", "gruszka.png", "gruszka.png", "ananas.png", "ananas.png", "limonka.png", "limonka.png"
];*/

const deckCardsMed = ["kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png",
    "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png"
];

/*const deckCardsEz = ["kiwi.png", "kiwi.png", "pomarancze.png", "pomarancze.png", "banany.png", "banany.png", "grejfrut.png", "grejfrut.png",
    "arbuz.png", "arbuz.png", "maliny.png", "maliny.png", "winogrono.png", "winogrono.png", "wisnie.png", "wisnie.png"
];*/

const deckCardsEz = ["kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png",
    "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png",
];

// const deckCardsEz = ["kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png", "kiwi.png"]

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
let seconds = 20;
let timeStart = false;
let user_id = 1;
let mover_id = 0;
let currSocket = null;
let currRoom = null;
let costam = []
let diff;

function changeUM(user, mover, socket, room) {
    user_id = user;
    mover_id = mover;
    currSocket = socket;
    currRoom = room
    seconds = 20;
    if (myTurn(mover_id, user_id)) {
        costam.forEach(e => {
            e.classList.remove("cursor-false")
            e.classList.add("cursor-true")
        })
    } else {
        costam.forEach(e => {
            e.classList.remove("cursor-true")
            e.classList.add("cursor-false")
        })
    }
    stopTime();
    timer();
    timeStart = true;
}


function emitToPlayers(flipper) {
    let data = { flip: flipper, currRoom }
    socket.emit('Flip', data)
}

function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function startGame(SD) {
  console.log('wchodzone jest', SD.length)
    for (let i = 0; i < SD.length; i++) {
        const liTag = document.createElement('LI');
        liTag.classList.add('card');
        liTag.id = i;
        const addImage = document.createElement("IMG");
        liTag.appendChild(addImage);
        addImage.setAttribute("src", "../img/" + SD[i]);
        deck.appendChild(liTag);
        costam.push(liTag)
    }
}

function returnSD(difficulty) {
    diff = difficulty;
    let shuffledDeck;
    if (difficulty === 'Easy') {
        shuffledDeck = shuffle(deckCardsEz);
        return shuffledDeck;
    } else if (difficulty === 'Medium') {
        shuffledDeck = shuffle(deckCardsMed);
        return shuffledDeck;
    } else if (difficulty === 'Hard') {
        shuffledDeck = shuffle(deckCardsHard);
        return shuffledDeck;
    }

}


function removeCard() {
    while (deck.hasChildNodes()) {
        deck.removeChild(deck.firstChild);
    }
}

function timer() {
  let data;
  time = setInterval(function () {
    seconds--;
    if (seconds <= 0) {
      stopTime();
      if (myTurn(user_id, mover_id)) {
        console.log(opened[0])
        if (opened[0]) {
          console.log('jest opened')
          data = { currRoom, card1: opened[0].parentElement.id }
          opened = [];
        }
        else {
          console.log('nie jest opened')
          data = { currRoom, card1: null }
        }
        console.log('emitdata', data)
        socket.emit('playerChange', data);
      }
    }
    timeCounter.innerHTML = "<i class='fa fa-hourglass-start'></i>" + "Timer: " + seconds;
  }, 1000);
}

function stopTime() {
    clearInterval(time);
}


function myTurn(mover_id, user_id) {
    if (!mover_id && !user_id) {
        return false;
    } else if (mover_id == user_id) {
        return true;
    } else {
        return false
    }
}


function compareTwo() {
  if (opened.length === 2) {
    document.body.style.pointerEvents = "none";
  }
  if (opened.length === 2 && opened[0].src === opened[1].src) {
    match();
    let data = { card1: opened[0].parentElement.id, card2: opened[1].parentElement.id, currRoom, points: matched.length + 2 }
    socket.emit("confirmFlip", data)
  } else if (opened.length === 2 && opened[0].src != opened[1].src) {
    noMatch();
    stopTime();
    let data = { card1: opened[0].parentElement.id, card2: opened[1].parentElement.id, currRoom }
    socket.emit("removeFlip", data)
  }
}

function match() {
    setTimeout(function() {
        opened[0].parentElement.classList.add("match");
        opened[1].parentElement.classList.add("match");
        matched.push(...opened);
        document.body.style.pointerEvents = "auto";
        if (winGame()) {
            socket.emit("gameFinished", currRoom)
        }
        opened = [];
    }, 600);
    // movesCounter();
}


function noMatch() {
    setTimeout(function() {
        opened[0].parentElement.classList.remove("flip");
        opened[1].parentElement.classList.remove("flip");
        document.body.style.pointerEvents = "auto";
        opened = [];
    }, 700);
    // movesCounter();
}

function winGame() {
  console.log(diff, document.getElementsByClassName("match").length)
  if (diff === 'Hard') {
    if (document.getElementsByClassName("match").length === 36) {
      return true;
    }
    else {
      return false;
    }
  }
  else if (diff === 'Medium') {
    console.log(diff, "medium")
    if (document.getElementsByClassName("match").length === 24) {
      return true;
    }
    else {
      return false;
    }
  }
  else if (diff === 'Easy') {
    console.log(diff, "easy")
    if (document.getElementsByClassName("match").length === 16) {
      return true;
    }
    else {
      return false;
    }
  }
}

function emitToPlayers(flipper) {
  let data = { flip: flipper, currRoom }
  socket.emit('Flip', data)
}

deck.addEventListener("click", function (evt) {
  if (evt.target.nodeName === "LI" && myTurn(mover_id, user_id)) {
    if (timeStart === false) {
      timeStart = true;
      timer();
    }
    emitToPlayers(evt.target.id)
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