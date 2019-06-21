var listOfCards = ["fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-bolt", "fa fa-cube", "fa fa-leaf", "fa fa-bicycle", "fa fa-bomb"];
var numOfMoves = 0;
var matches = 0;
var card1 = null;
var card2 = null;
var listMatch = [];
var seed = 1;
var deck = document.querySelector('.deck');
var startTime;
var modal = document.getElementById("myModal");
let starsList = document.querySelectorAll(".stars li");
/**
 * start game
 */
newGame();
function newGame() {
    resetGame();
    modal.style.display = "none";
    
    let listOfAllCards = shuffle(listOfCards.concat(listOfCards));
    createCards(listOfAllCards);
    /* Register the deck to the click event */
    deck.addEventListener('click', openCard);
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

/*
 * Create a list that holds all of your cards
 */
function createCards(listOfAllCards) {
    for (var card of listOfAllCards) {
        var i = document.createElement("i");
        i.setAttribute('class', card);
    
        var li = document.createElement('li');
        li.appendChild(i);
        li.setAttribute('class', 'card');
        deck.appendChild(li);
    }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function resetGame() {
    numOfMoves = 0;
    matches = 0;
    listMatch = [];
    startTime = 0;
    resetCards();
    while (deck.firstChild) {
        deck.removeChild(deck.firstChild);
    }
    // reset star rating
    for (var i= 0; i < starsList.length; i++){
        starsList[i].style.visibility = "visible";
    }

    // reset move count text
    document.querySelector('.moves').innerText = 0;
}

function resetCards() {
    card1 = null;
    card2 = null;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

 // Function to open card
function openCard(event) {
    if (untouchedCard(event.target.classList)) {
        event.target.classList.toggle('open');
        event.target.classList.toggle('show');

        setCards(event.target);
    }
}

// check if card has already been opened or matched 
function untouchedCard(cardClassList) {
    return cardClassList.contains('card') &&
    !cardClassList.contains('match') && 
    (!card1 || !card2)
}

function setCards(card) {
    if (card1) {
        card2 = card;
    } else {
        if (numOfMoves === 0) {
            startTime = new Date();
        }
        card1 = card;
    };
    
    if (card2) {
        twoCardsOpened();
    }
}

// if two cards have been selected, display and perform appropriate task 
function twoCardsOpened() {
    setTimeout(()=> {
        if (cardsMatch()) {
            card1.classList.toggle('match');
            card2.classList.toggle('match');
            matches++
        } else {
            card1.classList.toggle('open');
            card1.classList.toggle('show');
            card2.classList.toggle('open');
            card2.classList.toggle('show');
        } 
        
        numOfMoves++;
        document.querySelector('.moves').innerText = numOfMoves;
        setNumStars();
        resetCards();
        checkIfGameComplete();
    }, 500);
    
}

// decrement star image as num of moves increase
function setNumStars() {
    if (numOfMoves > 8 && numOfMoves < 12){
        for( i= 0; i < 3; i++){
            if(i > 1){
                starsList[i].style.visibility = "collapse";
            }
        }
    }
    else if (numOfMoves > 13){
        for( i= 0; i < 3; i++){
            if(i > 0){
                starsList[i].style.visibility = "collapse";
            }
        }
    }
}

function checkIfGameComplete() {
    if (matches === listOfCards.length) {
        deck.removeEventListener('click', openCard);
        showModal();
    }
}

function showModal() {
    let elapsedTime = timeTaken();
    visibleStars = Array.prototype.slice.call(starsList).filter((star) => star.style.visibility === 'visible');
    document.getElementById("stats").innerHTML = `With ${numOfMoves} Moves and ${visibleStars.length} Stars `;
    document.getElementById("elapsedTime").innerHTML = `It took ${elapsedTime} seconds`;
    modal.style.display = "block";
}

function timeTaken() {
    let endTime = new Date();
    let timeDiff = endTime - startTime; //in ms

    // strip the ms
    timeDiff /= 1000;
  
    // get seconds 
    return seconds = Math.round(timeDiff);
  }

function cardsMatch() {
    return (card1.firstChild.className === card2.firstChild.className ? true : false);
}