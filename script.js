// Select all chess pieces
const pieces = document.querySelectorAll('.chess-piece');

// Function to get a random value between min and max
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// Initialize pieces
pieces.forEach(piece => {
    // Randomize initial position (top-left or bottom-right)
    const startFromTopLeft = Math.random() > 0.5;
    piece.style.left = startFromTopLeft ? `${random(5, 20)}%` : `${random(80, 95)}%`;
    piece.style.top = startFromTopLeft ? `${random(5, 20)}%` : `${random(80, 95)}%`;

    // Set random size
    const size = random(40, 80);
    piece.style.width = `${size}px`;
    piece.style.height = `${size}px`;

    // Assign random velocity
    let vx = random(-0.5, 0.5);
    let vy = random(-0.5, 0.5);

    // Ensure velocity is not zero
    while (Math.abs(vx) < 0.1 && Math.abs(vy) < 0.1) {
        vx = random(-0.5, 0.5);
        vy = random(-0.5, 0.5);
    }

    piece.dataset.vx = vx;
    piece.dataset.vy = vy;
});

// Animate pieces
function animatePieces() {
    pieces.forEach(piece => {
        let x = parseFloat(piece.style.left);
        let y = parseFloat(piece.style.top);
        let vx = parseFloat(piece.dataset.vx);
        let vy = parseFloat(piece.dataset.vy);

        // Update position
        x += vx;
        y += vy;

        // Check for wall collisions
        if (x <= 0 || x >= 95) vx = -vx; // Reverse X direction
        if (y <= 0 || y >= 95) vy = -vy; // Reverse Y direction

        // Update position and velocity
        piece.style.left = `${x}%`;
        piece.style.top = `${y}%`;
        piece.dataset.vx = vx;
        piece.dataset.vy = vy;

        // Handle collisions with other pieces
        pieces.forEach(otherPiece => {
            if (piece !== otherPiece) {
                const rect1 = piece.getBoundingClientRect();
                const rect2 = otherPiece.getBoundingClientRect();

                if (
                    rect1.left < rect2.right &&
                    rect1.right > rect2.left &&
                    rect1.top < rect2.bottom &&
                    rect1.bottom > rect2.top
                ) {
                    // Swap velocities on collision
                    [piece.dataset.vx, otherPiece.dataset.vx] = [otherPiece.dataset.vx, piece.dataset.vx];
                    [piece.dataset.vy, otherPiece.dataset.vy] = [otherPiece.dataset.vy, piece.dataset.vy];

                    // Add a smooth scaling effect
                    piece.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        piece.style.transform = 'scale(1)';
                    }, 300);
                }
            }
        });
    });

    // Request next frame
    requestAnimationFrame(animatePieces);
}

// Start animation
animatePieces();
