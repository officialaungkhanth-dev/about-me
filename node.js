var swiper = new Swiper(".mySwiper", {
    cssMode: true,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    pagination: {
        el: ".swiper-pagination",
    },
    mousewheel: true,
    keyboard: true,
});

const yesBtn = document.getElementById("yesBtn")
const noBtn = document.getElementById("noBtn");
const lab = document.getElementById("lab02");
const valentineContent = document.getElementById("valentineContent")
const successMsg = document.getElementById("successMsg")

const labCanvas = document.getElementById("labCanvas");
const labConfetti = confetti.create(labCanvas, {
    resize: true,
    useWorker: true
});

yesBtn.addEventListener("click", () => {
    // 1. Hide the question & buttons wrapper
    valentineContent.classList.add("hidden");

    // 2. Reveal the success message
    successMsg.classList.remove("hidden");

    // 3. Fire the spark / burst effect
    labConfetti({
        particleCount: 90,
        spread: 135,
        startVelocity: 30,
        ticks: 150,
        origin: { x: 0.5, y: 0.5 }, // Fires from the center of the lab box
        colors: ['#ffe17b', '#ffd166', '#ffffff', '#ffcad4']
    });
});

function moveNoBtn(e) {
    // Prevent standard click/tap action on touch devices
    if (e) e.preventDefault();

    // Get Lab 01's container box
    const labBox = noBtn.closest(".lab-box");

    // Switch to absolute positioning inside lab-box
    noBtn.style.position = "absolute";

    const boxRect = labBox.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    // Available space inside lab-box with padding buffer
    const padding = 12;
    const maxX = boxRect.width - btnRect.width - (padding * 2);
    const maxY = boxRect.height - btnRect.height - (padding * 2);

    // Pick a new random location inside the card
    const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
    const randomY = Math.max(padding, Math.floor(Math.random() * maxY));

    noBtn.style.left = randomX + "px";
    noBtn.style.top = randomY + "px";
}

noBtn.addEventListener("mouseenter", moveNoBtn);

// Touch events for mobile
noBtn.addEventListener("touchstart", moveNoBtn, { passive: false });
noBtn.addEventListener("click", moveNoBtn);

noBtn.addEventListener("mouseenter", () => {
    const labBox = lab.querySelector(".lab-box");

    // Switch to absolute positioning inside lab-box
    noBtn.style.position = "absolute";

    const boxRect = labBox.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    // Available space inside lab-box (with 12px padding buffer)
    const padding = 12;
    const maxX = boxRect.width - btnRect.width - (padding * 2);
    const maxY = boxRect.height - btnRect.height - (padding * 2);

    // Pick a new random location every hover
    const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
    const randomY = Math.max(padding, Math.floor(Math.random() * maxY));

    noBtn.style.left = randomX + "px";
    noBtn.style.top = randomY + "px";
});

const explodeBtn = document.getElementById("explodeBtn");
const lab2Initial = document.getElementById("lab2Initial");
const lab2Sentence = document.getElementById("lab2Sentence");
const lab2Box = document.getElementById("lab2Box");

let letters = [];
let isExploded = false;

// Color palette for bouncing letters
const labCard = lab2Box.closest(".lab");
const letterColors = ['#FF0000', '#FFE17B'];

explodeBtn.addEventListener("click", () => {
    const text = lab2Sentence.innerText;

    // 1. Hide original sentence & button
    lab2Initial.classList.add("hidden");

    // 2. Get box bounds
    const cardRect = labCard.getBoundingClientRect();
    const boxRect = lab2Box.getBoundingClientRect();

    const centerX = cardRect.width / 2;
    const centerY = cardRect.height / 2;

    // 3. Convert text string into individual letter nodes
    letters = Array.from(text).map((char) => {
        const span = document.createElement("span");
        span.className = "exploding-letter";
        span.textContent = char === " " ? "\u00A0" : char; // Non-breaking space for spaces
        lab.appendChild(span);

        // Random speed & angle explosion
        const speed = 6 + Math.random() * 10;
        const angle = Math.random() * Math.PI * 2;

        return {
            element: span,
            x: centerX,
            y: centerY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            colorIndex: Math.floor(Math.random() * letterColors.length)
        };
    });

    // 4. Start bounce animation loop
    if (!isExploded) {
        isExploded = true;
        requestAnimationFrame(animateLetters);
    }
});

function animateLetters() {
    const cardRect = lab.getBoundingClientRect();

    letters.forEach((item) => {
        const charRect = item.element.getBoundingClientRect();
        const maxX = cardRect.width - charRect.width;
        const maxY = cardRect.height - charRect.height;

        // Update position
        item.x += item.vx;
        item.y += item.vy;

        let bounced = false;

        // Wall collisions
        if (item.x >= maxX) {
            item.x = maxX;
            item.vx = -item.vx;
            bounced = true;
        } else if (item.x <= 0) {
            item.x = 0;
            item.vx = -item.vx;
            bounced = true;
        }

        if (item.y >= maxY) {
            item.y = maxY;
            item.vy = -item.vy;
            bounced = true;
        } else if (item.y <= 0) {
            item.y = 0;
            item.vy = -item.vy;
            bounced = true;
        }

        // Change color on bounce
        if (bounced) {
            item.colorIndex = (item.colorIndex + 1) % letterColors.length;
            item.element.style.color = letterColors[item.colorIndex];
        }

        // Apply new coordinates
        item.element.style.left = item.x + "px";
        item.element.style.top = item.y + "px";
    });

    requestAnimationFrame(animateLetters);
}