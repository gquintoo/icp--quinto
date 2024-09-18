const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load images
const mario = new Image();
mario.src = 'mario.png';

const background = new Image();
background.src = 'background.png';

const platformImage = new Image();
platformImage.src = 'platform.png'; // Add a platform image

const groundY = 350;
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
    
    { x: 250, y: 300, width: 100, height: 10 },
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
    if (isJumping) {
        marioY += marioYVelocity;
        marioYVelocity += gravity;

        // Check for ground collision
        if (marioY >= groundY) {
            marioY = groundY;
            isJumping = false;
            marioYVelocity = 0;
        } else {
            // Check for platform collisions
            platforms.forEach(platform => {
                if (marioX + 50 > platform.x && marioX < platform.x + platform.width &&
                    marioY + 50 > platform.y && marioY + 50 < platform.y + platform.height) {
                    marioY = platform.y - 50; // Place Mario on top of the platform
                    isJumping = false;
                    marioYVelocity = 0;
                }
            });
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
background.onload = function() {
    gameLoop();
};
