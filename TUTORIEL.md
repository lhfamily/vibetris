# Tutoriel VIBETRIS pour les Enfants

Bienvenue ! Ce tutoriel va t'aider à comprendre comment nous avons construit VIBETRIS en utilisant HTML, CSS et JavaScript. Explorons les techniques cool utilisées dans ce jeu !

## Table des Matières

1. [Structure HTML](#structure-html)
2. [Stylisation CSS](#stylisation-css)
3. [Logique de Jeu JavaScript](#logique-de-jeu-javascript)
4. [Dessin Canvas](#dessin-canvas)
5. [Audio avec Web Audio API](#audio-avec-web-audio-api)
6. [Contrôles Tactiles](#contrôles-tactiles)

---

## Structure HTML

### Qu'est-ce que le HTML ?

HTML (HyperText Markup Language) est comme le squelette d'une page web. Il définit quels éléments sont sur la page.

### La Structure de Base

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>VIBETRIS</title>
    <!-- Les styles vont ici -->
</head>
<body>
    <!-- Le contenu va ici -->
</body>
</html>
```

**Parties clés :**
- `<!DOCTYPE html>` - Indique au navigateur que c'est un document HTML5
- `<head>` - Contient les informations sur la page (titre, styles)
- `<body>` - Contient tout ce que tu vois sur la page

### Éléments Importants dans VIBETRIS

#### 1. Élément Canvas
```html
<canvas id="tetrisCanvas"></canvas>
```
Le `<canvas>` est comme un tableau blanc sur lequel on dessine le jeu avec JavaScript !

#### 2. Divs pour les Écrans
```html
<div id="splash">
    <!-- Contenu de l'écran d'accueil -->
</div>

<div id="game-over">
    <!-- Contenu de l'écran game over -->
</div>
```
Les éléments `<div>` sont des conteneurs qui regroupent du contenu lié ensemble.

#### 3. Boutons
```html
<button class="splash-btn" onclick="startGame()">JOUER</button>
```
Les boutons permettent aux utilisateurs d'interagir avec le jeu. Le `onclick` dit à JavaScript quoi faire quand on clique.

---

## Stylisation CSS

### Qu'est-ce que le CSS ?

CSS (Cascading Style Sheets) rend les choses jolies ! Il contrôle les couleurs, les tailles, les positions et les animations.

### Techniques CSS Cool dans VIBETRIS

#### 1. Effet Écran CRT (Look Rétro)
```css
body::after {
    content: " ";
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%);
    background-size: 100% 2px;
}
```
Cela crée des lignes de balayage comme sur les vieux écrans de télé !

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
Cela fait flotter le logo de haut en bas doucement !

#### 3. Flexbox pour la Mise en Page
```css
#splash {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
```
Flexbox aide à centrer les choses facilement - plus besoin de deviner avec les marges !

#### 4. Design Réactif (Mobile vs Desktop)
```css
@media (min-width: 1024px) {
    #mobile-controls {
        display: none !important;
    }
}
```
Les media queries nous permettent d'afficher/cacher des éléments selon la taille de l'écran.

#### 5. Effets de Bouton Cool
```css
.game-btn:active {
    background: rgba(0, 173, 239, 0.3);
    transform: scale(0.95);
    box-shadow: 0 0 10px rgba(0, 173, 239, 0.5);
}
```
Quand tu appuies sur un bouton, il rétrécit et brille !

---

## Logique de Jeu JavaScript

### Qu'est-ce que JavaScript ?

JavaScript rend les pages web interactives ! C'est le "cerveau" qui contrôle tout.

### Concepts de Jeu Fondamentaux

#### 1. Variables
```javascript
let SCORE = 0;
let LEVEL = 1;
let isGameRunning = false;
```
Les variables stockent les informations qu'on doit se rappeler.

#### 2. Tableaux
```javascript
let tetrisBoard = Array.from({ length: rows }, () => Array(cols).fill(0));
```
Pense aux tableaux comme une grille de cases. Chaque case peut contenir une valeur (0 = vide, ou une couleur de pièce).

#### 3. Objets
```javascript
const piece = {
    shape: [[1, 1], [1, 1]],
    color: "#FFE135",
    x: 5,
    y: 0
};
```
Les objets regroupent des informations liées ensemble (comme la forme, la couleur et la position d'une pièce).

#### 4. Fonctions
```javascript
function startGame() {
    // Réinitialiser tout
    SCORE = 0;
    LEVEL = 1;
    isGameRunning = true;
}
```
Les fonctions sont comme des recettes - elles effectuent des tâches spécifiques quand on les appelle.

#### 5. La Boucle de Jeu
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
La boucle de jeu tourne en continu, mettant à jour et dessinant tout plusieurs fois par seconde !

---

## Dessin Canvas

### Qu'est-ce que Canvas ?

Canvas est un élément HTML où on peut dessiner des formes, des couleurs et des images en utilisant JavaScript.

### Opérations Canvas de Base

#### 1. Obtenir le Contexte
```javascript
const canvas = document.getElementById("tetrisCanvas");
const ctx = canvas.getContext("2d");
```
Le contexte (`ctx`) est comme ton pinceau !

#### 2. Dessiner un Rectangle
```javascript
ctx.fillStyle = "#FFE135";  // Couleur jaune
ctx.fillRect(x, y, width, height);
```

#### 3. Dessiner avec des Effets Lumineux
```javascript
ctx.shadowBlur = 15;
ctx.shadowColor = "#FFD700";
ctx.fillRect(px, py, size, size);
```
Cela fait briller les blocs !

#### 4. Effacer le Canvas
```javascript
ctx.clearRect(0, 0, canvas.width, canvas.height);
```
Efface tout pour redessiner la prochaine image.

### Dessiner le Plateau de Tetris

```javascript
function drawBoard() {
    // Effacer tout
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner les lignes de grille
    for (let i = 0; i <= cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * boxSize, 0);
        ctx.lineTo(i * boxSize, canvas.height);
        ctx.stroke();
    }

    // Dessiner les pièces placées
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

## Audio avec Web Audio API

### Qu'est-ce que Web Audio API ?

Au lieu de lire des fichiers MP3, on peut **créer des sons à partir de zéro** avec du code ! C'est comme être musicien et ingénieur en même temps.

### Créer des Sons

#### 1. Initialiser le Contexte Audio
```javascript
audioCtx = new AudioContext();
```
C'est comme allumer ton studio de musique.

#### 2. Créer un Oscillateur (Onde Sonore)
```javascript
const osc = audioCtx.createOscillator();
osc.type = 'triangle';  // Forme d'onde
osc.frequency.value = 440;  // Note La (440 Hz)
```

#### 3. Contrôler le Volume
```javascript
const gain = audioCtx.createGain();
gain.gain.value = 0.5;  // Volume à 50%
```

#### 4. Jouer une Note
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

### Notes de Musique comme Fréquences

```javascript
const frequencies = {
    'A4': 440.00,
    'B4': 493.88,
    'C5': 523.25,
    'D5': 587.33,
    'E5': 659.25
};
```

Chaque note a une fréquence spécifique (vibrations par seconde) !

---

## Contrôles Tactiles

### Pourquoi des Contrôles Tactiles ?

Les appareils mobiles n'ont pas de clavier, donc on a besoin de contrôles tactiles !

### Détecter les Événements Tactiles

#### 1. Début du Toucher
```javascript
button.addEventListener("touchstart", (e) => {
    e.preventDefault();  // Arrêter le comportement par défaut
    move(-1);  // Déplacer à gauche
});
```

#### 2. Fin du Toucher
```javascript
button.addEventListener("touchend", (e) => {
    // Arrêter l'action
});
```

#### 3. Détection de Balayage
```javascript
canvas.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].pageX;
    touchStartY = e.changedTouches[0].pageY;
});

canvas.addEventListener('touchend', function(e) {
    let diffX = e.changedTouches[0].pageX - touchStartX;
    let diffY = e.changedTouches[0].pageY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Balayage horizontal
        if (diffX > 0) move(1);  // Droite
        else move(-1);  // Gauche
    }
});
```

### Empêcher le Comportement Par Défaut

```javascript
{ passive: false }  // Permet preventDefault()
e.preventDefault();  // Empêcher le défilement/zoom
```

Sur mobile, les touchers font normalement défiler la page. On empêche ça pour que les touchers contrôlent le jeu à la place !

---

## Techniques Avancées

### 1. LocalStorage (Sauvegarder le Meilleur Score)

```javascript
// Sauvegarder
localStorage.setItem('tetris_highscore', HIGHSCORE);

// Charger
let HIGHSCORE = localStorage.getItem('tetris_highscore') || 0;
```

LocalStorage nous permet de sauvegarder des données dans le navigateur, même après avoir fermé la page !

### 2. Système de Particules (Explosions)

```javascript
function spawnExplosion(x, y, color) {
    for (let i = 0; i < 8; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 8,  // Vélocité aléatoire
            vy: (Math.random() - 0.5) * 8,
            life: 1.0,
            color: color
        });
    }
}
```

Chaque particule a une position, une vélocité et une durée de vie. On les met à jour à chaque image !

### 3. Détection de Collision

```javascript
function collision(piece, board) {
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x]) {
                let boardX = piece.x + x;
                let boardY = piece.y + y;

                // Vérifier les limites et les chevauchements
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

On vérifie chaque bloc de la pièce contre le plateau !

### 4. Rotation des Pièces

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

C'est une rotation de matrice - on tourne la forme de 90 degrés !

---

## Défis pour Toi !

Maintenant que tu comprends les bases, essaye ces modifications :

### Facile
1. Change les couleurs du jeu pour tes couleurs préférées
2. Modifie l'intensité de l'effet CRT
3. Change le multiplicateur de vitesse de montée de niveau

### Moyen
1. Ajoute un bouton "PAUSE"
2. Crée une nouvelle forme de pièce Tetris
3. Ajoute un compteur de combo pour plusieurs lignes effacées

### Difficile
1. Ajoute une fonction "HOLD" (sauvegarder une pièce pour plus tard)
2. Crée des power-ups qui apparaissent aléatoirement
3. Ajoute différentes pistes de musique de fond

---

## Points Clés à Retenir

1. **HTML** crée la structure (éléments)
2. **CSS** le rend beau (couleurs, animations, mise en page)
3. **JavaScript** le rend interactif (logique de jeu, contrôles)
4. **Canvas** nous permet de dessiner des graphiques
5. **Web Audio API** crée des sons par programmation
6. **Événements Tactiles** font fonctionner sur les appareils mobiles

## Continue d'Apprendre !

- Expérimente avec le code
- Casse des trucs (c'est comme ça qu'on apprend !)
- Pose des questions
- Construis ton propre jeu

Rappelle-toi : chaque expert a été débutant un jour. Amuse-toi bien à coder ! 🚀

---

Fait avec ❤️ par l'équipe [LH.FAMILY](https://lh.family)
