class Wall {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const playerSprite = new Image();
playerSprite.src = "gfx/drake_emerald.png";

const tileWidth = 32;
const tileHeight = 32;
const wallSprite = new Image();
wallSprite.src = "gfx/wall.png"

const level = [
    "##############################",
    "#............................#",
    "#............................#",
    "#..########################..#",
    "#............................#",
    "#............................#",
    "#######..####..#.............#",
    "#.....#..#.....#.............#",
    "#.....#..#.....#.............#",
    "#..#..#..#..####",
    "#..#..#..#...",
    "#..#..#..#...",
    "#..#..#..#..#",
    "#..#.....#..#",
    "#..#.....#..#",
    "#..##########",
    "#............",
    "#............",
    "##############################"
]

const player = {
    x: 48,
    y: 48,
    height: 32,
    width: 32,
    movR: 0,
    movL: 0,
    movU: 0,
    movD: 0,
    speed: 2,
    sprite: playerSprite
}

const camera = {
    x: 0,
    y: 0
}

const walls = []

function loadLevel(level) {
    let posX = 0;
    let posY = 0;
    
    for (let i = 0; i < level.length; i++) {
        const row = level[i];
        for (let j = 0; j < row.length; j++) {
            const char = row[j];
            if (char == "#") {
                const newWall = new Wall(posX, posY);
                walls.push(newWall);
            }
            posX += tileWidth;
        }
        posY += tileHeight;
        posX = 0;
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    movePlayer();
    cameraFollow(player);
    
    for (const wall of walls) {
        ctx.drawImage(wallSprite, wall.x - camera.x, wall.y - camera.y);
    }
    ctx.drawImage(player.sprite, player.x - camera.x, player.y - camera.y);
    
    window.requestAnimationFrame(update);
}

function movePlayer() {
    let playerTopleft = {x: player.x, y: player.y};
    let playerTopright = {x: player.x + player.width, y: player.y};
    let playerBottomleft = {x: player.x, y: player.y + player.height};
    let playerBottomright = {x: player.x + player.width, y: player.y + player.height};

    let movX = player.movR - player.movL;
    let movY = player.movD - player.movU;
    for (let i = 0; i < walls.length; i++) {
        const wall = walls[i];
        let wallTopleft = {x: wall.x, y: wall.y};
        let wallTopright = {x: wall.x + tileWidth, y: wall.y};
        let wallBottomleft = {x: wall.x, y: wall.y + tileHeight};
        let wallBottomright = {x: wall.x + tileWidth, y: wall.y + tileHeight};
        if (movX > 0 && wall.x <= (player.x + player.width + movX) && (wall.x + tileWidth) >= (player.x + movX)) {
            if (playerTopright.y <= wallBottomleft.y && playerTopright.y >= wallTopleft.y) {
                movX = 0;
            }
            if (playerBottomright.y <= wallBottomleft.y && playerBottomright.y >= wallTopleft.y) {
                movX = 0;
            }
        }
        else if (movX < 0 && wall.x <= (player.x + player.width + movX) && (wall.x + tileWidth) >= (player.x + movX)) {
            if (playerTopleft.y <= wallBottomright.y && playerTopleft.y >= wallTopright.y) {
                movX = 0;
            }
            else if (playerBottomleft.y <= wallBottomright.y && playerBottomleft.y >= wallTopright.y) {
                movX = 0;
            }
        }
        if (movY > 0 && wall.y <= (player.y + player.width + movY) && (wall.y + tileWidth) >= (player.y + movY)) {
            if (playerBottomright.x <= wallTopright.x && playerBottomright.x >= wallTopleft.x) {
                movY = 0;
            }
            if (playerBottomleft.x <= wallTopright.x && playerBottomleft.x >= wallTopleft.x) {
                movY = 0;
            }
        }
        else if (movY < 0 && wall.y <= (player.y + player.width + movY) && (wall.y + tileWidth) >= (player.y + movY)) {
            if (playerTopright.x <= wallBottomright.x && playerTopright.x >= wallBottomleft.x) {
                movY = 0;
            }
            else if (playerTopleft.x <= wallBottomright.x && playerTopleft.x >= wallBottomleft.x) {
                movY = 0;
            }
        }
    }
    player.x += movX;
    player.y += movY;
}

function cameraFollow(target) {
    camera.x = target.x - canvas.width / 2;
    camera.y = target.y - canvas.height / 2;
}

function keyDown(e) {
    if (e.key === "ArrowRight" || e.key === "Right") {
        player.movR = player.speed;
    }
    else if (e.key === "ArrowLeft" || e.key === "Left") {
        player.movL = player.speed;
    }
    else if (e.key === "ArrowUp" || e.key === "Up") {
        player.movU = player.speed;
    }
    else if (e.key === "ArrowDown" || e.key === "Down") {
        player.movD = player.speed;
    }
}

function keyUp(e) {
    if (e.key === "ArrowRight" || e.key === "Right") {
        player.movR = 0;
    }
    else if (e.key === "ArrowLeft" || e.key === "Left") {
        player.movL = 0;
    }
    else if (e.key === "ArrowUp" || e.key === "Up") {
        player.movU = 0;
    }
    else if (e.key === "ArrowDown" || e.key === "Down") {
        player.movD = 0;
    }
}

loadLevel(level);
update();

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);