const NUMBER_OF_LETTERS = 15;
const NUMBER_OF_GUESSES_START = 2;

const PUBLIC_KEY =
    "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCXyrk+U3FO2HEXsE+0jXAuWCoZ\n"
  + "XERXGQIBXqQfX73OsSfIgym+2Vet6h3b8kqc0XCKvyHHUUPxubFrGw85oA54BkVA\n"
  + "l5DRAr50H+IGKNkjd3JVDWIHxTfhKM8xhvxNsGIDdnxZ/3DL+AAQ+TLnYW7Qxz11\n"
  + "XUyvTzFFdBv435iixQIDAQAB"

let numberOfCurrentGuess = 0;
let currentGuess = [];
let nextLetter = 0;

//let rightGuessString = 'asdfg12345qwert'

const salt = [0x5b, 0x8c, 0x2a, 0x4f, 0x80, 0xaf, 0x25, 0x78, 0xf2, 0x9b, 0x12, 0xbf, 0xc2, 0x6a, 0xe9, 0x5d, 0xdd, 0x4e, 0x95, 0xaa, 0xcf, 0x7a, 0xd6, 0xa9]
let passphrase =
    [
        "Fb5lLUngQqLrcBD2nmwDru0Chao9YPmEPJL2wilZsOsqzrvxZpHg81gndQvqXWq7fiNNRqo80yqUxYzZafuguiaRtQ4BESzb3atz3HD2oDQ7IIlokG8UmOOvQRpCqQb0bc7D2oEJ1SHC2ixpfiq/52Km57sZ/5M2Mh5UQQ0ebXE=",
        "HY+hE38Dt2YaB7KBu4VjUvLZrdzfXy/bp8m0RqeZZjieCwHi/BkdwKGCzPf3VJ4vUgGky8ZCZOtl3SjU2L+16k8NIm6ZYtZ3+HUm8qu0Xd+CcsSMiVvHihMyb1exA4e6KeaGWUn05Zbh8x5PNTw8YTI8PEWWWQdCUZLIugLmHr8=",
        "KmNxxf6sCPwcYRDvM3PIff/diRhzXB+fVQW2kG8mY7VZ16dMTBGySdXO6kLInAvdpslW2ZxJLtbf9h4Vr4TflZX5TnVtnvJawcTlgXRdwBUA0zT1auSHDOlvF8LGvccyqWv/sIfVds0pIPUEVsOl+uCXP8gaijg7R6tMEiKdasY=",
        "bTWyIiQMl850tSrJoA66i0ulU9plgyH1TbVKTpKw1ldizBOJqalGx5hNd7n6+7jQObELP7YknyBwuBRIBB6Kdy/JzKzIf+OJcdmE4LLl4bTT4ymDW9XWJNfbDa5k4Vru0EbzuCt49YAjZoSE3j3TK4ZL7Ns0Y0PWjFaevma4lkM=",
        "dRA9uWMPEb2Bz6XLOyntU7qnXAMVv+bBsABz8d1EGFt5cZKPzFIepwBJ64Usfx6kM8PKHgSaUrlK282uPzZ9REXhos+m+LYrDkfb4Ui4fcucffdQ6DMeuHfjvDmGSi11W/QbSGqbD925z31VGIxNgdgy3KAE3vF7vgK6xErISFw=",
        "GfLvdfqYcF2hxICo/Qrsbnr0wRQHSBWeB5vyBdBEjblDJllOzkF+Tkdi3qLX7FoFXPkmFQZOG+cjbr6F85zV0X+kRgRXFLjZsjmYNxWWHNdLCwNfGA7ibM/kZEGMaLOyt5O32ci0QUL6VQzjBcgwY/vRh1WBaUwk2rOK0HICh3U=",
        "AZyJhuJaqRGAj/xAkfSfFIfUfp/wj7d2l+HAvQ/loSkfsCIFOD83fm4ORwcgcYx0TxYLXm5Ipd3DcNLxsod0DrvGzz9XBaVykSmkUkPbMHRseyxpsA+zO2XZZYl8ddILB1hzJ5nYzXGt0awQy1YUb9oZ3riO70cCBclWq0j7QsU=",
        "eVHczh15qZvxOwTLyi9rKfl+2VtpFAD915tH18oyRvK0cpYqU1SFFy3LOreBw8ybUzxXx0pwz4kn/7hUooKprjks6+0oyYANWvuBwn9FK4oRMU8fA35Y5Dz9oCsyUCbM0owkBH5uGhO6ZT3LHkbyEDLC3mF189cxblBhb37RjEY=",
        "JIgrDYZwo2u/C45GZzh6/OwXob1Gizcp4F1CDX4qOWoR0tckkvdPyAfwOmDydY6THouoPl23tEcQq8CZ6TCnF49aeuYlE7fl58B4ufxi9GsSACGa1P88uodExDhJEHXGAidkhHegOR7+s+uxrIPL3MwKIum2+WnI0HlsF2mdzNU=",
        "B1RlUGcceeIxNjYhYWnxKdPfnraB4lUBes3hHK7q/4FOYRokFE65VuWSiO2UK2Ntrn2p997GBRbQbH/KNGStWla2p9CaahOuyVamPSOQUApZlQ775I3bovZQZ2qlwQgsoCKfke3tqLM/V+3a/XmIo5EkkJWrt6HKmL6E8ZpxHz8=",
        "hi8z6i9svv3SmDXjx/V/ktqu1ka/FKaMmjJcT65VJVhkcAZFIKRjEPog7Q9g8VOuZpycSDEgHYaH29Wvl0+obTvPtGB7jvqFphH62iowO5qMnhFxns5dY9Z2tlUe2XkA6OWy7YlMrBJW973yArJwcQIlUKys7U751unSwM/1lCQ=",
        "FVzLmtWpuFJxSqkRE8MMFq7OPK0b2DDj9eDd/ADg97EeEZ2czxMZl8Q9GBjSEoOQs3v7uj7+VctJSkIaT3JoRmrcypr7+mPNB/77SLkpgsJWG7KWnyBLloDgJgNcdpAO1DrTW61GaOFG4kY5LWNSfFmeZSXbrZA9ilm9cevsSZ8=",
        "fcmLCjx9jlf0AAaYjdTLWE+9n+2NhTEj9xttmsSf4E5eC1NNXYlw042XBXh9yqETBwL7zhXd/TVGdU2uhlSx5wFjCBOsvXP55tClisNTfA+z5dHmcvgni6zAdJ8PF4VcPEN9XDYZSezwjTFux8QanF1r9FVYFIeeflTl1a4YY6I=",
        "GmDTWvg3qx2WKx8DMNyFiYTfvVXk28jVX7E8yiZYn+SQrl+wsv8ogfMkXWPuDmCpEh9GrCoBkQY0Sy/w49f4KVOGS0zIbGoDYAllyWHQv/GIBaS4MCwBawsi/Vcp24FhSISwFlqoB3ts0MRZJ39NZf6fqNp2XDpL+oTfloUUJDg=",
        "W1X57i9MYWzg1R2Jw2ZEYM1cGFj1FxJ/Rm9eJIi6WPxclJ8G6DFxKkIp5m9/V9l8j2and4ACxJV/4lVPalOm6kb+NBfO8f6c1jeAZPGFn7QKn99ZVcn/rbP6U6iGnspKiSza9Z7u0+8g6QEMhz0WIQg6GrZPS7bFj0wVZpsJpS4=",
    ]


//console.log(rightGuessString);

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
    let row = document.getElementsByClassName("letter-row")[numberOfCurrentGuess];

    if (currentGuess.length != NUMBER_OF_LETTERS) {
        toastr.error("Not enough letters!");
        return;
    }

    var letterColor = Array(NUMBER_OF_LETTERS).fill("gray");

    //check green
    for (let i = 0; i < NUMBER_OF_LETTERS; i++) {
        if ( await encryptLetter(currentGuess[i], i) == passphrase[i]) {
            letterColor[i] = "green";
            passphrase[i] = "#";
        }
    }

    //check yellow
    //checking guess letters
    for (let i = 0; i < NUMBER_OF_LETTERS; i++) {
        if (letterColor[i] == "green") continue;

        //checking right letters
        for (let j = 0; j < NUMBER_OF_LETTERS; j++) {
            if (passphrase[j] == await encryptLetter(currentGuess[i], i)) {
                letterColor[i] = "yellow";
                passphrase[j] = "#";
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
            shadeKeyBoard(currentGuess[i], letterColor[i]);
        }, delay);
    }

    if (false /*guessString === rightGuessString*/) {
        toastr.success("You guessed right! Game over!");
        numberOfCurrentGuess = 0;
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
