# VIBETRIS Tutorial for Kids

Welcome! This tutorial will help you understand how we built VIBETRIS using HTML, CSS, and JavaScript. Let's explore the cool techniques used in this game!

## Table of Contents

1. [HTML Structure](#html-structure)
2. [CSS Styling](#css-styling)
3. [JavaScript Game Logic](#javascript-game-logic)
4. [Canvas Drawing](#canvas-drawing)
5. [Audio with Web Audio API](#audio-with-web-audio-api)
6. [Touch Controls](#touch-controls)

---

## HTML Structure

### What is HTML?

HTML (HyperText Markup Language) is like the skeleton of a webpage. It defines what elements are on the page.

### The Basic Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>VIBETRIS</title>
    <!-- Styles go here -->
</head>
<body>
    <!-- Content goes here -->
</body>
</html>
```

**Key parts:**
- `<!DOCTYPE html>` - Tells the browser this is an HTML5 document
- `<head>` - Contains information about the page (title, styles)
- `<body>` - Contains everything you see on the page

### Important Elements in VIBETRIS

#### 1. Canvas Element
```html
<canvas id="tetrisCanvas"></canvas>
```
The `<canvas>` is like a blank drawing board where we draw the game using JavaScript!

#### 2. Divs for Screens
```html
<div id="splash">
    <!-- Splash screen content -->
</div>

<div id="game-over">
    <!-- Game over screen content -->
</div>
```
`<div>` elements are containers that group related content together.

#### 3. Buttons
```html
<button class="splash-btn" onclick="startGame()">PLAY</button>
```
Buttons let users interact with the game. The `onclick` tells JavaScript what to do when clicked.

---

## CSS Styling

### What is CSS?

CSS (Cascading Style Sheets) makes things look pretty! It controls colors, sizes, positions, and animations.

### Cool CSS Techniques in VIBETRIS

#### 1. CRT Screen Effect (Retro Look)
```css
body::after {
    content: " ";
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%);
    background-size: 100% 2px;
}
```
This creates scanlines like old TV screens!

#### 2. Animations
```css
@keyframes floatingLogo {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.logo-vibetris {
    animation: floatingLogo 3s ease-in-out infinite;
}
```
This makes the logo float up and down smoothly!

#### 3. Flexbox for Layout
```css
#splash {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
```
Flexbox helps center things easily - no more guessing with margins!

#### 4. Responsive Design (Mobile vs Desktop)
```css
@media (min-width: 1024px) {
    #mobile-controls {
        display: none !important;
    }
}
```
Media queries let us show/hide elements based on screen size.

#### 5. Cool Button Effects
```css
.game-btn:active {
    background: rgba(0, 173, 239, 0.3);
    transform: scale(0.95);
    box-shadow: 0 0 10px rgba(0, 173, 239, 0.5);
}
```
When you press a button, it shrinks and glows!

---

## JavaScript Game Logic

### What is JavaScript?

JavaScript makes web pages interactive! It's the "brain" that controls everything.

### Core Game Concepts

#### 1. Variables
```javascript
let SCORE = 0;
let LEVEL = 1;
let isGameRunning = false;
```
Variables store information we need to remember.

#### 2. Arrays
```javascript
let tetrisBoard = Array.from({ length: rows }, () => Array(cols).fill(0));
```
Think of arrays like a grid of boxes. Each box can hold a value (0 = empty, or a piece color).

#### 3. Objects
```javascript
const piece = {
    shape: [[1, 1], [1, 1]],
    color: "#FFE135",
    x: 5,
    y: 0
};
```
Objects group related information together (like a piece's shape, color, and position).

#### 4. Functions
```javascript
function startGame() {
    // Reset everything
    SCORE = 0;
    LEVEL = 1;
    isGameRunning = true;
}
```
Functions are like recipes - they perform specific tasks when called.

#### 5. The Game Loop
```javascript
function update(time = 0) {
    drawBoard();

    if(isGameRunning) {
        dropCounter += deltaTime;
        if (dropCounter > dropSpeed) {
            currentPiece.y++;
            dropCounter = 0;
        }
    }

    requestAnimationFrame(update);
}
```
The game loop runs continuously, updating and drawing everything many times per second!

---

## Canvas Drawing

### What is Canvas?

Canvas is an HTML element where we can draw shapes, colors, and images using JavaScript.

### Basic Canvas Operations

#### 1. Getting the Context
```javascript
const canvas = document.getElementById("tetrisCanvas");
const ctx = canvas.getContext("2d");
```
The context (`ctx`) is like your paintbrush!

#### 2. Drawing a Rectangle
```javascript
ctx.fillStyle = "#FFE135";  // Yellow color
ctx.fillRect(x, y, width, height);
```

#### 3. Drawing with Glow Effects
```javascript
ctx.shadowBlur = 15;
ctx.shadowColor = "#FFD700";
ctx.fillRect(px, py, size, size);
```
This makes blocks glow!

#### 4. Clearing the Canvas
```javascript
ctx.clearRect(0, 0, canvas.width, canvas.height);
```
Erase everything to redraw the next frame.

### Drawing the Tetris Board

```javascript
function drawBoard() {
    // Clear everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    for (let i = 0; i <= cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * boxSize, 0);
        ctx.lineTo(i * boxSize, canvas.height);
        ctx.stroke();
    }

    // Draw placed pieces
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (tetrisBoard[y][x]) {
                drawBlock(x, y, tetrisBoard[y][x].color);
            }
        }
    }
}
```

---

## Audio with Web Audio API

### What is Web Audio API?

Instead of playing MP3 files, we can **create sounds from scratch** using code! It's like being a musician and an engineer at the same time.

### Creating Sounds

#### 1. Initialize Audio Context
```javascript
audioCtx = new AudioContext();
```
This is like turning on your music studio.

#### 2. Creating an Oscillator (Sound Wave)
```javascript
const osc = audioCtx.createOscillator();
osc.type = 'triangle';  // Wave shape
osc.frequency.value = 440;  // Note A (440 Hz)
```

#### 3. Controlling Volume
```javascript
const gain = audioCtx.createGain();
gain.gain.value = 0.5;  // 50% volume
```

#### 4. Playing a Note
```javascript
function playNote(freq, duration, startTime) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
}
```

### Musical Notes as Frequencies

```javascript
const frequencies = {
    'A4': 440.00,
    'B4': 493.88,
    'C5': 523.25,
    'D5': 587.33,
    'E5': 659.25
};
```

Each note has a specific frequency (vibrations per second)!

---

## Touch Controls

### Why Touch Controls?

Mobile devices don't have keyboards, so we need touch-based controls!

### Detecting Touch Events

#### 1. Touch Start
```javascript
button.addEventListener("touchstart", (e) => {
    e.preventDefault();  // Stop default behavior
    move(-1);  // Move left
});
```

#### 2. Touch End
```javascript
button.addEventListener("touchend", (e) => {
    // Stop action
});
```

#### 3. Swipe Detection
```javascript
canvas.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].pageX;
    touchStartY = e.changedTouches[0].pageY;
});

canvas.addEventListener('touchend', function(e) {
    let diffX = e.changedTouches[0].pageX - touchStartX;
    let diffY = e.changedTouches[0].pageY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0) move(1);  // Right
        else move(-1);  // Left
    }
});
```

### Preventing Default Behavior

```javascript
{ passive: false }  // Allow preventDefault()
e.preventDefault();  // Stop scrolling/zooming
```

On mobile, touches normally scroll the page. We prevent this so touches control the game instead!

---

## Advanced Techniques

### 1. LocalStorage (Saving High Score)

```javascript
// Save
localStorage.setItem('tetris_highscore', HIGHSCORE);

// Load
let HIGHSCORE = localStorage.getItem('tetris_highscore') || 0;
```

LocalStorage lets us save data in the browser, even after closing the page!

### 2. Particle System (Explosions)

```javascript
function spawnExplosion(x, y, color) {
    for (let i = 0; i < 8; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 8,  // Random velocity
            vy: (Math.random() - 0.5) * 8,
            life: 1.0,
            color: color
        });
    }
}
```

Each particle has position, velocity, and life. We update them every frame!

### 3. Collision Detection

```javascript
function collision(piece, board) {
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x]) {
                let boardX = piece.x + x;
                let boardY = piece.y + y;

                // Check bounds and overlap
                if (boardX < 0 || boardX >= cols ||
                    boardY >= rows || board[boardY][boardX]) {
                    return true;
                }
            }
        }
    }
    return false;
}
```

We check every block of the piece against the board!

### 4. Rotating Pieces

```javascript
function rotatePiece(piece) {
    const rows = piece.shape.length;
    const cols = piece.shape[0].length;
    let newShape = [];

    for (let x = 0; x < cols; x++) {
        newShape[x] = [];
        for (let y = 0; y < rows; y++) {
            newShape[x][rows - y - 1] = piece.shape[y][x];
        }
    }
    return newShape;
}
```

This is matrix rotation - turning the shape 90 degrees!

---

## Challenges for You!

Now that you understand the basics, try these modifications:

### Easy
1. Change the game colors to your favorite colors
2. Modify the CRT effect intensity
3. Change the level-up speed multiplier

### Medium
1. Add a "PAUSE" button
2. Create a new Tetris piece shape
3. Add a combo counter for multiple line clears

### Hard
1. Add a "HOLD" feature (save a piece for later)
2. Create power-ups that appear randomly
3. Add different background music tracks

---

## Key Takeaways

1. **HTML** creates the structure (elements)
2. **CSS** makes it look beautiful (colors, animations, layout)
3. **JavaScript** makes it interactive (game logic, controls)
4. **Canvas** lets us draw graphics
5. **Web Audio API** creates sounds programmatically
6. **Touch Events** make it work on mobile devices

## Keep Learning!

- Experiment with the code
- Break things (that's how we learn!)
- Ask questions
- Build your own game

Remember: Every expert was once a beginner. Have fun coding! 🚀

---

Made with ❤️ by the [LH.FAMILY](https://lh.family) team
