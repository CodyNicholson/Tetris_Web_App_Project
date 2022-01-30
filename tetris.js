const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");
context.scale(20,20);

let hdrTxt = document.getElementById("score");

const colors = [
    null,
    "#FF0D72",
    "#0DC2FF",
    "#0DFF72",
    "#F538FF",
    "#FF8E0D",
    "#FFE138",
    "#3877FF",
];

const arena = createMatrix(12,20);

const player = {
    pos: {x: 0, y:0},
    matrix: null,
    score: 0,
    playing: true
}

// Remove completed rows
function arenaSweep(){
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y > 0; y--) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }
        // Take arena row out at index y, and fill it with zeros
        const row = arena.splice(y,1)[0].fill(0);
        arena.unshift(row);
        y++;
        player.score += rowCount * 10;
        rowCount*=2;
    }
}

function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 && (arena[y+o.y] && arena[y+o.y][x+o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function createMatrix(w,h){
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0))
    }
    return matrix;
}

function createPiece(type){
    if (type === "T"){
        return [
            [0,0,0],
            [1,1,1],
            [0,1,0],
        ];
    } else if (type === "O") {
        return [
            [2,2],
            [2,2]
        ];
    } else if (type === "L"){
        return [
            [0,3,0],
            [0,3,0],
            [0,3,3],
        ];
    } else if (type === "J"){
        return [
            [0,4,0],
            [0,4,0],
            [4,4,0],
        ];
    } else if (type === "I"){
        return [
            [0,5,0,0],
            [0,5,0,0],
            [0,5,0,0],
            [0,5,0,0],
        ];
    } else if (type === "S"){
        return [
            [0,6,6],
            [6,6,0],
            [0,0,0],
        ];
    } else if (type === "Z"){
        return [
            [7,7,0],
            [0,7,7],
            [0,0,0],
        ];
    }
}

function draw() {
    context.fillStyle = "#000";
    context.fillRect(0,0,canvas.width,canvas.height);
    drawMatrix(arena, {x: 0, y:0});
    drawMatrix(player.matrix, player.pos);
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x)  => {
            if (value !== 0) {
                context.fillStyle = colors[value];
                context.fillRect(x+offset.x,y+offset.y,1,1);
            }
        });
    });
}

function drawTitle() {
    // T
    arena[1][1] = 1;
    arena[1][2] = 1;
    arena[1][3] = 1;
    arena[1][4] = 1;
    arena[1][5] = 1;
    arena[2][3] = 1;
    arena[3][3] = 1;
    arena[4][3] = 1;
    arena[5][3] = 1;
    // E
    arena[2][7] = 2;
    arena[2][8] = 2;
    arena[2][9] = 2;
    arena[2][10] = 2;
    arena[3][7] = 2;
    arena[4][7] = 2;
    arena[5][7] = 2;
    arena[6][7] = 2;
    arena[6][8] = 2;
    arena[6][9] = 2;
    arena[6][10] = 2;
    arena[4][8] = 2;
    arena[4][9] = 2;
    // T
    arena[7][1] = 3;
    arena[7][2] = 3;
    arena[7][3] = 3;
    arena[7][4] = 3;
    arena[7][5] = 3;
    arena[8][3] = 3;
    arena[9][3] = 3;
    arena[10][3] = 3;
    arena[11][3] = 3;
    // R
    arena[8][7] = 4;
    arena[8][8] = 4;
    arena[8][9] = 4;
    arena[8][10] = 4;
    arena[9][10] = 4;
    arena[9][7] = 4;
    arena[10][7] = 4;
    arena[10][10] = 4;
    arena[11][7] = 4;
    arena[12][7] = 4;
    arena[11][9] = 4;
    arena[12][10] = 4;
    arena[10][9] = 4;
    arena[10][8] = 4;
    // I
    arena[13][1] = 5;
    arena[13][2] = 5;
    arena[13][3] = 5;
    arena[13][4] = 5;
    arena[13][5] = 5;
    arena[14][3] = 5;
    arena[15][3] = 5;
    arena[16][3] = 5;
    arena[17][1] = 5;
    arena[17][2] = 5;
    arena[17][3] = 5;
    arena[17][4] = 5;
    arena[17][5] = 5;
    // S
    arena[14][7] = 6;
    arena[14][8] = 6;
    arena[14][9] = 6;
    arena[14][10] = 6;
    arena[15][7] = 6;
    arena[16][7] = 6;
    arena[17][10] = 6;
    arena[18][7] = 6;
    arena[18][8] = 6;
    arena[18][9] = 6;
    arena[18][10] = 6;
    arena[16][8] = 6;
    arena[16][9] = 6;
    arena[16][10] = 6;
    drawMatrix(arena, {x: 0, y:0});
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)){
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        if (player.playing) {
            updateScore();
        }
    }
    dropCounter = 0;
}

function playerMove(dir) {
    player.pos.x += dir;
    if(collide(arena, player)) {
        player.pos.x -= dir;
    }
}

function playerReset() {
    const pieces = "ILJOTSZ";
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length/2|0) - (player.matrix[0].length/2|0);

    // If the new piece cannot be placed end game
    if (collide(arena, player)){
        player.playing = false;
        hdrTxt.style.animation = "blinker 1s linear infinite";
        hdrTxt.innerText = "FINAL SCORE: " + player.score;
        document.addEventListener('keydown', startGame);
    }
}

function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while(collide(arena, player)){
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length){
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

// The rotation function will transpose and then reverse the matrix
function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x){
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                matrix[y][x],
                matrix[x][y],
            ];
        }
    }
    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
let checkpoint = 50;

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if(dropCounter > dropInterval){
        playerDrop();
    }

    draw();

    if (player.playing) {
        requestAnimationFrame(update);
    }
}

function updateScore(){
    hdrTxt.innerText = player.score;

    if (player.score >= checkpoint && player.score < 500) {
        dropInterval -= 100;
        checkpoint += 50;
        // 50 900, 100, 800, 150 700, 200 600, 250 500, 300 400, 350 300, 400 200, 450 100
    }
}

document.addEventListener("keydown", event => {
    if (event.keyCode === 37) { // Arrow Left
        playerMove(-1);
    } else if (event.keyCode === 39) { // Arrow Right
        playerMove(1);
    } else if (event.keyCode === 40) { // Arrow Down
        playerDrop();
    } else if (event.keyCode === 90) { // "Z"
        playerRotate(-1)
    } else if (event.keyCode === 88) { // "X"
        playerRotate(1)
    } else if (event.keyCode === 50) { // Digit 2
        player.score *= 2;
        updateScore();
    }
});

function clearBoard() {
    arena.forEach(row => row.fill(0));
}

function startGame() {
    player.score = 0;
    player.playing = true;
    document.removeEventListener('keydown', startGame);
    hdrTxt.style.animation = "none";
    clearBoard();
    updateScore();
    update();
}

hdrTxt.innerText = "Click any key to play";
playerReset();
drawTitle();

document.addEventListener('keydown', startGame);

