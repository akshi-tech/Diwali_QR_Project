
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

let rockets = [];
let particles = [];
let lastLaunch = 0;

// Golden Diwali colour palette
const colors = [
    "#FFD700",
    "#FFB347",
    "#FFF0A5",
    "#FF8C42",
    "#FF5E78",
    "#FFFFFF"
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

// Launch a rocket
function launchRocket() {

    const x = Math.random() * window.innerWidth;

    const targetY =
        window.innerHeight * (0.15 + Math.random() * 0.4);

    rockets.push({
        x: x,
        y: window.innerHeight + 10,
        targetY: targetY,
        speed: 4 + Math.random() * 2,
        color: colors[
            Math.floor(Math.random() * colors.length)
        ],
        trail: []
    });
}

// Create explosion
function explode(x, y, color) {

    const count = 75;

    for (let i = 0; i < count; i++) {

        const angle =
            (Math.PI * 2 * i) / count;

        const speed = 1.5 + Math.random() * 4;

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

// Update rockets
function updateRockets() {

    rockets.forEach((rocket, index) => {

        rocket.y -= rocket.speed;

        rocket.trail.push({
            x: rocket.x,
            y: rocket.y
        });

        if (rocket.trail.length > 8) {
            rocket.trail.shift();
        }

        // Rocket reaches its destination
        if (rocket.y <= rocket.targetY) {

            explode(
                rocket.x,
                rocket.y,
                rocket.color
            );

            rockets.splice(index, 1);
        }
    });
}

// Draw rockets
function drawRockets() {

    rockets.forEach(rocket => {

        ctx.beginPath();

        ctx.moveTo(rocket.x, rocket.y);

        ctx.lineTo(
            rocket.x,
            rocket.y + 15
        );

        ctx.strokeStyle = rocket.color;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
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

// Draw glowing particles
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

// Main animation loop
function animate(timestamp) {

    ctx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
    );

    // Automatically launch rockets
    if (timestamp - lastLaunch > 1100) {
        launchRocket();
        lastLaunch = timestamp;
    }

    updateRockets();
    drawRockets();

    updateParticles();
    drawParticles();

    requestAnimationFrame(animate);
}

// Start fireworks
requestAnimationFrame(animate);

// Button celebration
function celebrate() {

    // Launch multiple fireworks together
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            launchRocket();
        }, i * 180);
    }
}
