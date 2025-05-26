const desktopEmojis = [
    "😹",
    "😝",
    "👻",
    "😃",
    "😈",
    "💀",
    "😇",
    "💩",
];
const mobileEmojis = [
    "😹",
    "😝",
    "😈",
    "💀",
]
const isMobile = window.innerWidth <= 600;
const emojis = isMobile ? mobileEmojis : desktopEmojis;
const cardsArray = [...emojis, ...emojis]; 

let firstCard = null;
let lockBoard = false;

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function createCard(emoji) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
        <div class="front">${emoji}</div>
        <div class="back">❔</div>
    `;
    card.dataset.emoji = emoji;

    card.addEventListener("click", () => {
        if (lockBoard || card.classList.contains("flip")) return;

        card.classList.add("flip");

        if (!firstCard) {
            firstCard = card;
        } else {
            if (firstCard.dataset.emoji === card.dataset.emoji) {
                // Match
                firstCard = null;

                // Verifica vitória
                checkWin();
            } else {
                lockBoard = true;
                setTimeout(() => {
                    card.classList.remove("flip");
                    firstCard.classList.remove("flip");
                    firstCard = null;
                    lockBoard = false;
                }, 1000);
            }
        }
    });

    return card;
}

function checkWin() {
    const flippedCards = document.querySelectorAll('.card.flip');
    if (flippedCards.length === cardsArray.length) {
        setTimeout(() => {
            triggerVictory();
        }, 300);
    }
}

function triggerVictory() {
    const audio = document.getElementById("winSound");
    audio.play();

    // Estoura confetes por 1 segundo
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}

function startGame() {
    const gameBoard = document.querySelector(".game");
    shuffle(cardsArray).forEach(emoji => {
        const card = createCard(emoji);
        gameBoard.appendChild(card);
    });
}

startGame();