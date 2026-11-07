
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

const welcome = document.getElementById("welcomeScreen");
const celebration = document.getElementById("celebrationScreen");

const celebrateButton = document.getElementById("celebrateButton");
const backButton = document.getElementById("backButton");

let rockets = [];
let particles = [];
let lastLaunch = 0;

const colors = [
    "#FFD700",
    "#FF4D6D",
    "#39E6C1",
    "#A879FF",
    "#FF9D32",
    "#FFFFFF",
    "#FF69B4"
];

// Canvas setup
function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);


// Launch a rocket towards a target
function launchRocket(targetX, targetY) {

    const x = Math.random() * window.innerWidth;

    rockets.push({
        x: x,
        y: window.innerHeight + 10,

        targetX: targetX ?? Math.random() * window.innerWidth,
        targetY: targetY ?? window.innerHeight * (0.15 + Math.random() * 0.4),

        color: colors[
            Math.floor(Math.random() * colors.length)
        ],

        trail: []
    });
}


// Create colourful explosion
function explode(x, y, color) {

    const count = 85;

    for (let i = 0; i < count; i++) {

        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1.5;

        particles.push({
            x: x,
            y: y,

            oldX: x,
            oldY: y,

            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,

            life: 1,
            decay: 0.008 + Math.random() * 0.012,

            color: color,
            size: Math.random() * 2.5 + 1
        });
    }
}


// Move rockets
function updateRockets() {

    rockets.forEach((rocket, index) => {

        const dx = rocket.targetX - rocket.x;
        const dy = rocket.targetY - rocket.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 9) {

            explode(
                rocket.x,
                rocket.y,
                rocket.color
            );

            rockets.splice(index, 1);
            return;
        }

        rocket.x += (dx / distance) * 6;
        rocket.y += (dy / distance) * 6;

        rocket.trail.push({
            x: rocket.x,
            y: rocket.y
        });

        if (rocket.trail.length > 10) {
            rocket.trail.shift();
        }
    });
}


// Draw rockets
function drawRockets() {

    rockets.forEach(rocket => {

        ctx.beginPath();

        rocket.trail.forEach((point, index) => {

            if (index === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        });

        ctx.strokeStyle = rocket.color;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 12;
        ctx.shadowColor = rocket.color;

        ctx.stroke();

        ctx.shadowBlur = 0;
    });
}


// Update explosion particles
function updateParticles() {

    particles.forEach((p, index) => {

        p.oldX = p.x;
        p.oldY = p.y;

        p.x += p.vx;
        p.y += p.vy;

        p.vx *= 0.985;
        p.vy *= 0.985;

        p.vy += 0.035;

        p.life -= p.decay;

        if (p.life <= 0) {
            particles.splice(index, 1);
        }
    });
}


// Draw sparkling particles
function drawParticles() {

    particles.forEach(p => {

        ctx.globalAlpha = Math.max(0, p.life);

        ctx.beginPath();

        ctx.moveTo(p.oldX, p.oldY);
        ctx.lineTo(p.x, p.y);

        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size;

        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;

        ctx.stroke();

        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            p.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "#FFF7D1";
        ctx.fill();
    });

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
}


// Main animation
function animate(timestamp) {

    ctx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
    );

    // Automatic fireworks
    if (
        !celebration.hidden &&
        timestamp - lastLaunch > 1200
    ) {
        launchRocket();
        lastLaunch = timestamp;
    }

    updateRockets();
    drawRockets();

    updateParticles();
    drawParticles();

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);


// SCREEN TRANSITION
celebrateButton.addEventListener("click", () => {

    welcome.hidden = true;
    celebration.hidden = false;

    // Initial celebration burst
    for (let i = 0; i < 5; i++) {

        setTimeout(() => {
            launchRocket();
        }, i * 200);
    }
});


// CLICK ANYWHERE TO CREATE FIREWORKS
celebration.addEventListener("click", (event) => {

    if (event.target.closest("button")) {
        return;
    }

    const x = event.clientX;
    const y = event.clientY;

    // Multiple colourful fireworks at click position
    for (let i = 0; i < 3; i++) {

        setTimeout(() => {

            launchRocket(
                x + (Math.random() - 0.5) * 70,
                y + (Math.random() - 0.5) * 70
            );

        }, i * 180);
    }
});


// BACK TO WELCOME
backButton.addEventListener("click", () => {

    celebration.hidden = true;
    welcome.hidden = false;

});

