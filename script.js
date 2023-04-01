const NUMBER_OF_LETTERS = 15;
const NUMBER_OF_GUESSES_START = 2;

// Nice Try HAHAHAHA; salted HMAC SHA-256 makes BRRRRR.
const PUBLIC_KEY =
    "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCXyrk+U3FO2HEXsE+0jXAuWCoZ\n"
  + "XERXGQIBXqQfX73OsSfIgym+2Vet6h3b8kqc0XCKvyHHUUPxubFrGw85oA54BkVA\n"
  + "l5DRAr50H+IGKNkjd3JVDWIHxTfhKM8xhvxNsGIDdnxZ/3DL+AAQ+TLnYW7Qxz11\n"
  + "XUyvTzFFdBv435iixQIDAQAB"

const salt = [0x5b, 0x8c, 0x2a, 0x4f, 0x80, 0xaf, 0x25, 0x78, 0xf2, 0x9b, 0x12, 0xbf, 0xc2, 0x6a, 0xe9, 0x5d, 0xdd, 0x4e, 0x95, 0xaa, 0xcf, 0x7a, 0xd6, 0xa9]
const passphrase =
    [
        "i6LjCDHf9w1oAA0GsCKzWObBqVhIymwKLV5uRA8o72E=",
        "5shGtxV5++K6+9vqt9smcksrQQgUGSX2+utmX52kWKU=",
        "dYey1XMMiO4BisdDafLEMtocX2nul7qEHpN/TaGu4WE=",
        "bRLJnkUtmCuUsibaFczyzdpam7kU7OlWOpzWZ6OBhx4=",
        "mhjEBqH6wFM1r7uVdIpVJLDC5+I8jinJ8s1MHLaXVAQ=",
        "XmxzKLNZKoSmN34HjfH67JaWLeVXOSdstacv+zxIsvI=",
        "biMOKddF9Gi5Su9ImvCMRnDdrVklq39f/bxWvXalzgo=",
        "5shGtxV5++K6+9vqt9smcksrQQgUGSX2+utmX52kWKU=",
        "p3Dnt/iTMiKgEFqYSCcwtlddnmzZ9joJZZhMpkDt0ZQ=",
        "MpPmX0L4BEcZql+Jf5aQJOuYuSqQT99jbQw3xit5xNM=",
        "PHVIOr5SF4crs6eSeCSXPNRAhg04c8F3BbyujuTD7Uc=",
        "wGWPf35h3t6H1b3YB0IBeCkdgY8hPOsWTA1QT7w52+g=",
        "reG3/+pT+SOOMU1TGGD1gqKMkE52b4/SvZEBuUTpN2s=",
        "l1oySXW934FcuAAri/BCDV9L5umroL5uS0WOSNJ4fec=",
        "5HE4QNatmnKzebGFAELw2q6P2gzU4on9tN2JBIOf+yo=",
    ]

let numberOfCurrentGuess = 0;
let currentGuess = [];
let nextLetter = 0;

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

async function checkGuess() {
    if (numberOfCurrentGuess === -1) {
        return;
    }

    let row = document.getElementsByClassName("letter-row")[numberOfCurrentGuess];

    if (currentGuess.length != NUMBER_OF_LETTERS) {
        toastr.error("Du musst halt schon " + NUMBER_OF_LETTERS + " Zeichen eingeben....");
        return;
    }

    var letterColor = Array(NUMBER_OF_LETTERS).fill("gray");
    var tempPhrase = [...passphrase];

    for (let i = 0; i < NUMBER_OF_LETTERS; i++) {
        if (await encryptLetter(currentGuess[i], i) == tempPhrase[i]) {
            letterColor[i] = "green";
            tempPhrase[i] = "G";
        }
    }

    for (let i = 0; i < NUMBER_OF_LETTERS; i++) {
        if (letterColor[i] == "green") continue;

        for (let j = 0; j < NUMBER_OF_LETTERS; j++) {
            if (tempPhrase[j] == await encryptLetter(currentGuess[i], j)) {
                letterColor[i] = "yellow";
                tempPhrase[j] = "Y";
            }
        }
    }

    let colorGuess = [...currentGuess];
    for (let i = 0; i < NUMBER_OF_LETTERS; i++) {
        let box = row.children[i];
        let delay = 250 * i;
        setTimeout(() => {
            animateCSS(box, "flipInX");
            box.style.backgroundColor = letterColor[i];
            shadeKeyBoard(colorGuess[i], letterColor[i]);
        }, delay);
    }

    let solved = true;
    for (let i = 0; i < NUMBER_OF_LETTERS; i++) {
        if (tempPhrase[i] != '#') {
            solved = false;
            break;
        }
    }

    if (solved) {
        if (numberOfCurrentGuess < 2) {
            toastr.error("Nah, offensichtlich gecheatet. Meinst du das merke ich nicht???");
        } else if (numberOfCurrentGuess < 7) {
            toastr.success("" + (numberOfCurrentGuess + 1) + " Versuche. Gerade noch so akzeptabel.");
        } else {
            toastr.success("Was du hast " + (numberOfCurrentGuess + 1) + " Versuche gebraucht? Mein Gott ist das schlecht.");
        }
        numberOfCurrentGuess = -1;
        return;
    } else {
        currentGuess = [];
        nextLetter = 0;
        nextGuess();
    }
}

async function encryptLetter(letter, index) {
    let enc = new TextEncoder("utf-8");
    let salted = letter.charCodeAt(0) * salt[index];
    let alg = { name: "HMAC", hash: "SHA-256" };

    let key = await crypto.subtle.importKey("raw", enc.encode(PUBLIC_KEY), alg, false, ["sign"]);
    let signature = await crypto.subtle.sign(alg.name, key, enc.encode(salted));
    let digest = btoa(String.fromCharCode(...new Uint8Array(signature)));

    return digest;
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
    new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;
        const node = element;
        node.style.setProperty("--animate-duration", "0.3s");

        node.classList.add(`${prefix}animated`, animationName);

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
