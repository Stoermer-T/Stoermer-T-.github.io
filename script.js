const NUMBER_OF_LETTERS = 15;
const NUMBER_OF_GUESSES_START = 2;

let numberOfCurrentGuess = 0;
let currentGuess = [];
let nextLetter = 0;

let rightGuessString = 'asdfg12345qwert'

let salt = [0x5b, 0x8c, 0x2a, 0x4f, 0x80, 0xaf, 0x25, 0x78, 0xf2, 0x9b, 0x12, 0xbf, 0xc2, 0x6a, 0xe9, 0x5d, 0xdd, 0x4e, 0x95, 0xaa, 0xcf, 0x7a, 0xd6, 0xa9]
let passphrase = ''

console.log(rightGuessString);

function initBoard() {
    let board = document.getElementById("game-board");

    for (let i = 0; i < NUMBER_OF_GUESSES_START; i++) {
        let row = document.createElement("div");
        row.className = "letter-row";

        for (let j = 0; j < NUMBER_OF_LETTERS; j++) {
            let box = document.createElement("div");
            box.className = "letter-box";
            row.appendChild(box);
        }

        board.appendChild(row);
    }
}

function nextGuess() {
    let board = document.getElementById("game-board");

    let row = document.createElement("div");
    row.className = "letter-row";

    for (let j = 0; j < NUMBER_OF_LETTERS; j++) {
        let box = document.createElement("div");
        box.className = "letter-box";
        row.appendChild(box);
    }

    board.appendChild(row);
    numberOfCurrentGuess++;
}

function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor;
            if (oldColor === "green") {
                return;
            }

            if (oldColor === "yellow" && color !== "green") {
                return;
            }

            elem.style.backgroundColor = color;
            break;
        }
    }
}

function deleteLetter() {
    let row = document.getElementsByClassName("letter-row")[numberOfCurrentGuess];
    let box = row.children[nextLetter - 1];
    box.textContent = "";
    box.classList.remove("filled-box");
    currentGuess.pop();
    nextLetter -= 1;
}

function checkGuess() {
    let row = document.getElementsByClassName("letter-row")[numberOfCurrentGuess];
    let guessString = "";
    let rightGuess = Array.from(rightGuessString);

    for (const val of currentGuess) {
        guessString += val;
    }

    if (guessString.length != NUMBER_OF_LETTERS) {
        toastr.error("Not enough letters!");
        return;
    }

    var letterColor = Array(NUMBER_OF_LETTERS).fill("gray");

    //check green
    for (let i = 0; i < NUMBER_OF_LETTERS; i++) {
        if (rightGuess[i] == currentGuess[i]) {
            letterColor[i] = "green";
            rightGuess[i] = "#";
        }
    }

    //check yellow
    //checking guess letters
    for (let i = 0; i < NUMBER_OF_LETTERS; i++) {
        if (letterColor[i] == "green") continue;

        //checking right letters
        for (let j = 0; j < NUMBER_OF_LETTERS; j++) {
            if (rightGuess[j] == currentGuess[i]) {
                letterColor[i] = "yellow";
                rightGuess[j] = "#";
            }
        }
    }

    for (let i = 0; i < NUMBER_OF_LETTERS; i++) {
        let box = row.children[i];
        let delay = 250 * i;
        setTimeout(() => {
            //flip box
            animateCSS(box, "flipInX");
            //shade box
            box.style.backgroundColor = letterColor[i];
            shadeKeyBoard(guessString.charAt(i) + "", letterColor[i]);
        }, delay);
    }

    if (guessString === rightGuessString) {
        toastr.success("You guessed right! Game over!");
        numberOfCurrentGuess = 0;
        return;
    } else {
        currentGuess = [];
        nextLetter = 0;
        nextGuess();
    }
}

function encryptLetter(letter, index) {
    let crypt = new Crypt();
    let salted = letter * salt[index].toString(7);
    return crypt.encrypt(publicRsaKey, salted);
}

function insertLetter(pressedKey) {
    if (nextLetter === NUMBER_OF_LETTERS) {
        return;
    }
    pressedKey = pressedKey.toLowerCase();

    let row = document.getElementsByClassName("letter-row")[numberOfCurrentGuess];
    let box = row.children[nextLetter];
    animateCSS(box, "pulse");
    box.textContent = pressedKey;
    box.classList.add("filled-box");
    currentGuess.push(pressedKey);
    nextLetter += 1;
}

const animateCSS = (element, animation, prefix = "animate__") =>
    // We create a Promise and return it
    new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;
        // const node = document.querySelector(element);
        const node = element;
        node.style.setProperty("--animate-duration", "0.3s");

        node.classList.add(`${prefix}animated`, animationName);

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd(event) {
            event.stopPropagation();
            node.classList.remove(`${prefix}animated`, animationName);
            resolve("Animation ended");
        }

        node.addEventListener("animationend", handleAnimationEnd, { once: true });
    });

document.addEventListener("keyup", (e) => {
    let pressedKey = String(e.key);
    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter();
        return;
    }

    if (pressedKey === "Enter") {
        checkGuess();
        return;
    }

    let found = pressedKey.match(/[a-z0-9]/gi);
    if (!found || found.length > 1) {
        return;
    } else {
        insertLetter(pressedKey);
    }
});

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target;

    if (!target.classList.contains("keyboard-button")) {
        return;
    }
    let key = target.textContent;

    if (key === "Del") {
        key = "Backspace";
    }

    document.dispatchEvent(new KeyboardEvent("keyup", { key: key }));
});

initBoard();
