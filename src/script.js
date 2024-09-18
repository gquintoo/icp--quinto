const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load images
const mario = new Image();
const background = new Image();
const platformImage = new Image();

const loadImages = () => {
    return Promise.all([
        new Promise((resolve) => {
            mario.onload = resolve;
            mario.onerror = () => console.error('Failed to load mario.png');
            mario.src = 'mario.png';
        }),
        new Promise((resolve) => {
            background.onload = resolve;
            background.onerror = () => console.error('Failed to load background.png');
            background.src = 'background.png';
        }),
        new Promise((resolve) => {
            platformImage.onload = resolve;
            platformImage.onerror = () => console.error('Failed to load platform.png');
            platformImage.src = 'platform.png';
        })
    ]);
};

const groundY = 290; // Ground level
const gravity = 1;
let isJumping = false;
let jumpSpeed = 15;
let marioYVelocity = 0;

// Mario's position and speed
let marioX = 50;
let marioY = groundY;
let marioSpeed = 5;

// Platforms
const platforms = [
    { x: 0, y: 330, width: 1000, height: 10 },
    { x: 475, y: 250, width: 200, height: 10 },
    { x: 550, y: 170, width: 300, height: 10 },
];

// Key press states
let keys = {};

// Event listeners for key presses
window.addEventListener('keydown', function(e) {
    keys[e.key] = true;
});

window.addEventListener('keyup', function(e) {
    keys[e.key] = false;
});

// Draw function
function draw() {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    
    // Draw platforms
    platforms.forEach(platform => {
        ctx.drawImage(platformImage, platform.x, platform.y, platform.width, platform.height);
    });

    ctx.drawImage(mario, marioX, marioY, 50, 50);
}

// Update function
function update() {
    // Handle horizontal movement
    if (keys['ArrowRight']) {
        marioX += marioSpeed;
    }
    if (keys['ArrowLeft']) {
        marioX -= marioSpeed;
    }

    // Handle jumping
    if (keys['ArrowUp'] && !isJumping) {
        isJumping = true;
        marioYVelocity = -jumpSpeed;
    }

    // Apply gravity
    marioY += marioYVelocity;
    marioYVelocity += gravity;

    // Check if Mario is on the ground
    if (marioY >= groundY) {
        marioY = groundY;
        isJumping = false;
        marioYVelocity = 0;
    } else {
        // Check for platform collisions
        let onPlatform = false;
        platforms.forEach(platform => {
            if (
                marioX + 50 > platform.x && // Right edge of Mario
                marioX < platform.x + platform.width && // Left edge of platform
                marioY + 50 >= platform.y && // Bottom edge of Mario
                marioY + 50 <= platform.y + platform.height // Top edge of platform
            ) {
                marioY = platform.y - 50; // Place Mario on top of the platform
                isJumping = false;
                marioYVelocity = 0;
                onPlatform = true;
            }
        });

        // If not on any platform, reset Mario to ground level
        if (!onPlatform) {
            // Apply gravity
            if (marioY < groundY) {
                marioY += gravity;
            }
            if (marioY > groundY) {
                marioY = groundY; // Stop at ground level
            }
        }
    }
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
loadImages().then(gameLoop);
