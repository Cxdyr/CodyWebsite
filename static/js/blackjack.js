let dealerSum = 0;
let yourSum = 0;

let dealerAceCount = 0;
let yourAceCount = 0;

let hidden;
let deck;

let canHit = true;

window.onload = function() {
    buildDeck();
    shuffleDeck();

    document.getElementById("place-bet").addEventListener("click", function() {
        const betAmount = parseInt(document.getElementById("bet-amount").value);
        if (betAmount > userCoins) {
            alert("You don't have enough coins to place this bet.");
        } else {
            startGame();
            document.getElementById("bet-section").style.display = "none";
            document.getElementById("game-section").style.display = "block";
        }
    });

    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
    document.getElementById("play-again").addEventListener("click", function() {
        window.location.reload();
    });
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]);
        }
    }
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);

    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = cardImageBaseUrl + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = cardImageBaseUrl + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }

    document.getElementById("hit").disabled = false;
    document.getElementById("stay").disabled = false;
}

function hit() {
    if (!canHit) {
        return;
    }

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = cardImageBaseUrl + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);

    if (reduceAce(yourSum, yourAceCount) > 21) {
        canHit = false;
    }
}

function stay() {
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;
    document.getElementById("hidden").src = cardImageBaseUrl + hidden + ".png";

    let message = "";
    let betAmount = parseInt(document.getElementById("bet-amount").value);
    let winnings = 0;

    if (yourSum > 21) {
        message = "You Lose!";
        winnings = -betAmount;
    } else if (dealerSum > 21 || yourSum > dealerSum) {
        message = "You Win!";
        winnings = betAmount;
    } else if (yourSum == dealerSum) {
        message = "Tie!";
    } else {
        message = "You Lose!";
        winnings = -betAmount;
    }

    updateCoins(winnings);

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;

    document.getElementById("game-section").style.display = "none";
    document.getElementById("play-again").style.display = "block";
}

function getValue(card) {
    let data = card.split("-");
    let value = data[0];

    if (isNaN(value)) {
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}

function updateCoins(winnings) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/update-coins", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({ winnings: winnings }));
}
