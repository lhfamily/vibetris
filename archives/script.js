let SCORE = 0;
let HIGHSCORE = localStorage.getItem('tetris_highscore') ? parseInt(localStorage.getItem('tetris_highscore')) : 0;

const PIECES = [
	{
		shape: [
			[1, 1],
			[1, 1]
		],
		color: "yellow"
	},
	{
		shape: [[1, 1, 1, 1]],
		color: "cyan"
	},
	{
		shape: [
			[0, 1, 0],
			[1, 1, 1]
		],
		color: "purple"
	},
	{
		shape: [
			[1, 1, 0],
			[0, 1, 1]
		],
		color: "green"
	},
	{
		shape: [
			[0, 1, 1],
			[1, 1, 0]
		],
		color: "red"
	},
	{
		shape: [
			[1, 0, 0],
			[1, 1, 1]
		],
		color: "blue"
	},
	{
		shape: [
			[0, 0, 1],
			[1, 1, 1]
		],
		color: "orange"
	}
];

const canvas = document.getElementById("tetrisCanvas");
const ctx = canvas.getContext("2d");
const boxSize = 30;
const rows = 20;
const cols = 10;
const dropSpeed = 420;

let particles = [];
let tetrisBoard = Array.from({ length: rows }, () => Array(cols).fill(0));
let currentPiece = randomPiece();
currentPiece.x = Math.floor(cols / 2) - 1; // Position initiale
currentPiece.y = 0; // Position initiale

function updateScore() {
	document.getElementById("score").innerHTML = "Score: " + SCORE;
	if (SCORE > HIGHSCORE) {
		HIGHSCORE = SCORE;
		localStorage.setItem('tetris_highscore', HIGHSCORE);
	}
	document.getElementById("timer").innerHTML = "High: " + HIGHSCORE;
}

function createParticles(y) {
	let particleCount = 30; // Nombre de particules
	for (let i = 0; i < particleCount; i++) {
		particles.push({
			x: Math.random() * canvas.width,
			y: y * boxSize,
			speedX: Math.random() * 5 - 2.5,
			speedY: Math.random() * 5 - 2.5,
			size: Math.random() * 5 + 1,
			color: "red"
		});
	}
}

function drawAndUpdateParticles() {
	for (let i = 0; i < particles.length; i++) {
		let particle = particles[i];
		ctx.fillStyle = particle.color;
		ctx.fillRect(particle.x, particle.y, particle.size, particle.size);

		particle.x += particle.speedX;
		particle.y += particle.speedY;
		particle.size -= 0.1;

		if (particle.size <= 0) {
			particles.splice(i, 1);
			i--;
		}
	}
}

function particleLoop() {
	drawAndUpdateParticles();
	requestAnimationFrame(particleLoop);
}

function randomPiece() {
	const randomIndex = Math.floor(Math.random() * PIECES.length);
	return Object.assign({}, PIECES[randomIndex]);
}

function drawBoard() {
	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < cols; x++) {
			ctx.fillStyle = tetrisBoard[y][x] ? "#00445d" : "black";
			ctx.fillRect(x * boxSize, y * boxSize, boxSize, boxSize);
			ctx.strokeRect(x * boxSize, y * boxSize, boxSize, boxSize);
		}
	}
}

function drawPiece(piece) {
	for (let y = 0; y < piece.shape.length; y++) {
		for (let x = 0; x < piece.shape[y].length; x++) {
			if (piece.shape[y][x]) {
				ctx.fillStyle = piece.color;
				ctx.fillRect(
					(piece.x + x) * boxSize,
					(piece.y + y) * boxSize,
					boxSize,
					boxSize
				);
			}
		}
	}
}

function isGameOver(board) {
	return board[0].some((cell) => cell !== 0);
}

function collision(piece, board) {
	for (let y = 0; y < piece.shape.length; y++) {
		for (let x = 0; x < piece.shape[y].length; x++) {
			if (piece.shape[y][x]) {
				let boardX = piece.x + x;
				let boardY = piece.y + y;
				if (
					boardY >= rows ||
					boardX >= cols ||
					boardX < 0 ||
					board[boardY][boardX]
				) {
					return true;
				}
			}
		}
	}
	return false;
}

function addPieceToBoard(piece, board) {
	for (let y = 0; y < piece.shape.length; y++) {
		for (let x = 0; x < piece.shape[y].length; x++) {
			if (piece.shape[y][x]) {
				board[piece.y + y][piece.x + x] = piece.color;
			}
		}
	}
}

function rotatePiece(piece) {
	const rows = piece.shape.length;
	const cols = piece.shape[0].length;
	const newShape = [];

	// Initialise le nouveau tableau 2D
	for (let x = 0; x < cols; x++) {
		newShape[x] = [];
	}

	// Remplis le nouveau tableau en le tournant de 90 degrés
	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < cols; x++) {
			newShape[x][rows - y - 1] = piece.shape[y][x];
		}
	}

	return newShape;
}

function removeLines(board) {
	let nblines = 0;
	for (let y = 0; y < board.length; y++) {
		if (board[y].every((value) => value !== 0)) {
			nblines++;
			// Retire la ligne
			board.splice(y, 1);

			// Ajoute une nouvelle ligne vide au sommet
			board.unshift(new Array(board[0].length).fill(0));
		}
	}
	if (nblines > 0) {
		SCORE += Math.pow(10, nblines);
		document.getElementById("score").innerHTML = "Score : " + SCORE;
	}
}

function gameLoop() {
	let newPiece = Object.assign({}, currentPiece);
	newPiece.y += 1;

	if (isGameOver(tetrisBoard)) {
		// Afficher un message "Game Over"
		console.log("Game Over");

		// Reset
		particles = [];
		tetrisBoard = Array.from({ length: rows }, () => Array(cols).fill(0));
		currentPiece = randomPiece();
		currentPiece.x = Math.floor(cols / 2) - 1; // Position initiale
		currentPiece.y = 0; // Position initiale
		SCORE = 0;
		updateScore();

		// Dessiner le plateau initial
		drawBoard();

		// Relancer la boucle du jeu
		gameLoop();

		return;
	}

	if (collision(newPiece, tetrisBoard)) {
		SCORE += 1;
		updateScore();
		addPieceToBoard(currentPiece, tetrisBoard);
		currentPiece = randomPiece();
		currentPiece.x = Math.floor(cols / 2) - 1;
		currentPiece.y = 0;
	} else {
		currentPiece.y += 1;
	}

	drawBoard();
	drawPiece(currentPiece);
	removeLines(tetrisBoard);

	setTimeout(gameLoop, dropSpeed);
}

document.addEventListener("keydown", function (event) {
	let newPiece = Object.assign({}, currentPiece);

	if (event.keyCode === 37 || event.key === "q") {
		// Flèche gauche
		newPiece.x -= 1;
		if (!collision(newPiece, tetrisBoard)) {
			currentPiece.x -= 1;
		}
	}

	if (event.keyCode === 39 || event.key === "d") {
		// Flèche droite
		newPiece.x += 1;
		if (!collision(newPiece, tetrisBoard)) {
			currentPiece.x += 1;
		}
	}

	if (event.keyCode === 40 || event.key === "s") {
		// Flèche bas
		newPiece.y += 1;
		if (!collision(newPiece, tetrisBoard)) {
			currentPiece.y += 1;
			SCORE += 1;
			updateScore();
		}
	}

	if (event.keyCode === 38 || event.key === "z") {
		// Flèche du haut
		newPiece.shape = rotatePiece(newPiece);
		if (!collision(newPiece, tetrisBoard)) {
			currentPiece.shape = newPiece.shape;
		}
	}

	drawBoard();
	drawAndUpdateParticles();
	drawPiece(currentPiece);
});

// Dessiner le plateau initial
drawBoard();

// Lancer la boucle du jeu
particleLoop();
gameLoop();

// On ajoute le mobile !!
let startX = 0;
let startY = 0;

function handleTouchStart(event) {
	startX = event.touches[0].clientX;
	startY = event.touches[0].clientY;
}

function handleTouchMove(event) {
	let x = event.touches[0].clientX;
	let y = event.touches[0].clientY;

	let deltaX = x - startX;
	let deltaY = y - startY;

	if (Math.abs(deltaX) > Math.abs(deltaY)) {
		// Swipe horizontal
		if (deltaX > 0) {
			// Swipe vers la droite
			newPiece.x += 1;
			if (!collision(newPiece, tetrisBoard)) {
				currentPiece.x += 1;
			}
		} else {
			// Swipe vers la gauche
			newPiece.x -= 1;
			if (!collision(newPiece, tetrisBoard)) {
				currentPiece.x -= 1;
			}
		}
	} else {
		// Swipe vertical
		if (deltaY > 0) {
			// Swipe vers le bas
			newPiece.y += 1;
			if (!collision(newPiece, tetrisBoard)) {
				currentPiece.y += 1;
			}
		} else {
			// Swipe vers le haut
			newPiece.shape = rotatePiece(newPiece);
			if (!collision(newPiece, tetrisBoard)) {
				currentPiece.shape = newPiece.shape;
			}
		}
	}

	// Réinitialise les valeurs de départ
	startX = x;
	startY = y;
}

// Ajoutez des écouteurs d'événements pour les événements tactiles
// document.addEventListener("touchstart", handleTouchStart, false);
// document.addEventListener("touchmove", handleTouchMove, false);

const backgroundTiles = {
	backgroundDisplay: document.getElementById("background"),
	pixelTiming: 30,
	maxPixels: 100,
	pixels: [],

	run() {
		// this.generatePixels(100);
		setInterval(() => {
			this.createPixel(this);
		}, this.pixelTiming);
	},
	createPixel(whereis) {
		const pixel = document.createElement("div");
		pixel.className = "pixel";
		pixel.style.left = Math.random() * window.innerWidth + "px";
		pixel.style.top = Math.random() * window.innerHeight + "px";
		pixel.style.animationDuration = Math.random() * 2 + 1 + "s";

		if (whereis.backgroundDisplay) {
			whereis.backgroundDisplay.appendChild(pixel);
			whereis.pixels.push(pixel);

			if (whereis.pixels.length > whereis.maxPixels) {
				whereis.backgroundDisplay.removeChild(whereis.pixels.shift());
			}
		} else {
			console.log("No more pixel");
		}
	},
	generatePixels(numPixels) {
		for (let i = 0; i < this.maxPixels; i++) {
			this.createPixel(this);
		}
	}
};

// Add mobile button controls
function setupMobileControls() {
  const leftBtn = document.getElementById("left-btn");
  const rightBtn = document.getElementById("right-btn");
  const downBtn = document.getElementById("down-btn");
  const rotateBtn = document.getElementById("rotate-btn");
  const tetrisCanvas = document.getElementById("tetrisCanvas");
  const allButtons = [leftBtn, rightBtn, downBtn, rotateBtn];
  const repeatDelay = 300; // Répéter le mouvement après 500ms
  const buttonIntervals = {};
  
  // Prevent zoom on the entire game area
  document.getElementById("tetris").addEventListener('touchstart', (e) => {
    e.preventDefault();
  }, { passive: false });
  
  // Prevent double-tap zoom on all buttons and canvas
  [...allButtons, tetrisCanvas].forEach(element => {
    element.addEventListener('touchstart', (e) => {
      e.preventDefault();
    }, { passive: false });
    
    element.addEventListener('touchend', (e) => {
      e.preventDefault();
    }, { passive: false });
    
    element.addEventListener('touchmove', (e) => {
      e.preventDefault();
    }, { passive: false });
  });

  // Functions for each movement
  function moveLeft() {
    let newPiece = Object.assign({}, currentPiece);
    newPiece.x -= 1;
    if (!collision(newPiece, tetrisBoard)) {
      currentPiece.x -= 1;
    }
    drawBoard();
    drawAndUpdateParticles();
    drawPiece(currentPiece);
  }

  function moveRight() {
    let newPiece = Object.assign({}, currentPiece);
    newPiece.x += 1;
    if (!collision(newPiece, tetrisBoard)) {
      currentPiece.x += 1;
    }
    drawBoard();
    drawAndUpdateParticles();
    drawPiece(currentPiece);
  }

  function moveDown() {
    let newPiece = Object.assign({}, currentPiece);
    newPiece.y += 1;
    if (!collision(newPiece, tetrisBoard)) {
      currentPiece.y += 1;
      SCORE += 1;
      updateScore();
    }
    drawBoard();
    drawAndUpdateParticles();
    drawPiece(currentPiece);
  }

  function rotate() {
    let newPiece = Object.assign({}, currentPiece);
    newPiece.shape = rotatePiece(newPiece);
    if (!collision(newPiece, tetrisBoard)) {
      currentPiece.shape = newPiece.shape;
    }
    drawBoard();
    drawAndUpdateParticles();
    drawPiece(currentPiece);
  }

  // Setup button press and hold behavior
  function setupButton(button, action) {
    const buttonId = button.id;

    // Initial click/touch
    button.addEventListener("click", function(e) {
      e.preventDefault();
      action();
    });
    
    // For mouse users
    button.addEventListener("mousedown", (e) => {
      e.preventDefault();
      action(); // Immediate action
      if (buttonIntervals[buttonId]) clearInterval(buttonIntervals[buttonId]);
      buttonIntervals[buttonId] = setInterval(action, repeatDelay);
    });
    
    button.addEventListener("mouseup", (e) => {
      e.preventDefault();
      if (buttonIntervals[buttonId]) {
        clearInterval(buttonIntervals[buttonId]);
        buttonIntervals[buttonId] = null;
      }
    });
    
    // For touch users
    button.addEventListener("touchstart", (e) => {
      e.preventDefault();
      action(); // Immediate action
      if (buttonIntervals[buttonId]) clearInterval(buttonIntervals[buttonId]);
      buttonIntervals[buttonId] = setInterval(action, repeatDelay);
    }, { passive: false });
    
    button.addEventListener("touchend", (e) => {
      e.preventDefault();
      if (buttonIntervals[buttonId]) {
        clearInterval(buttonIntervals[buttonId]);
        buttonIntervals[buttonId] = null;
      }
    }, { passive: false });
  }

  // Add events for all buttons
  setupButton(leftBtn, moveLeft);
  setupButton(rightBtn, moveRight);
  setupButton(downBtn, moveDown);
  setupButton(rotateBtn, rotate);
  
  // Clear intervals when mouse/touch leaves the element
  document.addEventListener("mouseout", () => {
    Object.keys(buttonIntervals).forEach(key => {
      if (buttonIntervals[key]) {
        clearInterval(buttonIntervals[key]);
        buttonIntervals[key] = null;
      }
    });
  });

  // Prevent default on all touch events
  document.addEventListener('touchstart', function(e) {
    if (e.target.tagName !== 'BUTTON' && e.target.id !== 'tetrisCanvas') {
      return;
    }
    e.preventDefault();
  }, { passive: false });
}

// Disable text selection and context menu
document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('selectstart', event => event.preventDefault());

// Prevent long-press from triggering text selection or context menu
document.addEventListener('mousedown', function(e) {
  if (e.button === 2) { // Right click
    e.preventDefault();
    return false;
  }
});

backgroundTiles.run();
updateScore();
setupMobileControls();
