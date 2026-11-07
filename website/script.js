
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

let particles = [];

function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

// Create fireworks
function createFirework() {

    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight * 0.55;

    const colors = [
        "#FFD700",
        "#FF9D32",
        "#FF4D6D",
        "#FFF2B2"
    ];

    const color = colors[
        Math.floor(Math.random() * colors.length)
    ];

    for (let i = 0; i < 35; i++) {

        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1;

        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
            color: color
        });
    }
}

// Draw animation
function animate() {

    ctx.clearRect(
        0, 0,
        window.innerWidth,
        window.innerHeight
    );

    particles.forEach((p) => {

        p.x += p.vx;
        p.y += p.vy;

        p.vy += 0.035;
        p.life -= 0.012;

        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
    });

    particles = particles.filter(p => p.life > 0);

    ctx.globalAlpha = 1;

    requestAnimationFrame(animate);
}

// Fireworks continuously
setInterval(createFirework, 850);

animate();

// Button celebration
function celebrate() {
    for (let i = 0; i < 4; i++) {
        createFirework();
    }
}
