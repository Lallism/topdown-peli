class Wall {
    constructor(x, y, sprite) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
    }
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const playerSprite = new Image();
playerSprite.src = "gfx/drake_emerald.png";

const tileWidth = 32;
const tileHeight = 32;

const wallSprite = new Image();
wallSprite.src = "gfx/wall.png";
const wallSprite2 = new Image();
wallSprite2.src = "gfx/wall2.png";
const wallSprite3 = new Image();
wallSprite3.src = "gfx/wall3.png";

const projectileImage = new Image();
projectileImage.src = "gfx/fireball.png";

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
    "#..#..#..#..####.............#",
    "#..#..#..#...................#",
    "#..#..#..#...................#",
    "#..#..#..#..#................#",
    "#..#.....#..#................#",
    "#..#.....#..#................#",
    "#..##########................#",
    "#............................#",
    "#............................#",
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
                const randomWall = Math.random();
                let sprite = wallSprite;

                if (randomWall > 0.98) {
                    sprite = wallSprite3;
                }
                else if (randomWall > 0.5) {
                    sprite = wallSprite2;
                }

                const newWall = new Wall(posX, posY, sprite);
                walls.push(newWall);
            }
            posX += tileWidth;
        }
        posY += tileHeight;
        posX = 0;
    }
}

const projectiles = [];

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    movePlayer();
    cameraFollow(player);

    for (const wall of walls) {
        ctx.drawImage(wall.sprite, wall.x - camera.x, wall.y - camera.y);
    }

    for (const projectile of projectiles) {
        projectile.update();
        projectile.draw();
    }

    ctx.drawImage(player.sprite, player.x - camera.x, player.y - camera.y);

    window.requestAnimationFrame(update);
}

function movePlayer() {
    let playerTop = player.y;
    let playerBottom = player.y + player.height;
    let playerLeft = player.x;
    let playerRight = player.x + player.width;

    let movX = player.movR - player.movL;
    let movY = player.movD - player.movU;
    for (let i = 0; i < walls.length; i++) {
        const wall = walls[i];

        let wallTop = wall.y;
        let wallBottom = wall.y + tileHeight;
        let wallLeft = wall.x;
        let wallRight = wall.x + tileWidth;

        if (movX > 0 && wallLeft <= (playerRight + movX) && wallRight >= (playerLeft + movX)) {
            if (playerTop <= wallBottom && playerTop >= wallTop) {
                movX = 0;
            }
            if (playerBottom <= wallBottom && playerBottom >= wallTop) {
                movX = 0;
            }
        }
        else if (movX < 0 && wallLeft <= (playerRight + movX) && wallRight >= (playerLeft + movX)) {
            if (playerTop <= wallBottom && playerTop >= wallTop) {
                movX = 0;
            }
            else if (playerBottom <= wallBottom && playerBottom >= wallTop) {
                movX = 0;
            }
        }
        if (movY > 0 && wallTop <= (playerBottom + movY) && wallBottom >= (playerTop + movY)) {
            if (playerRight <= wallRight && playerRight >= wallLeft) {
                movY = 0;
            }
            if (playerLeft <= wallRight && playerLeft >= wallLeft) {
                movY = 0;
            }
        }
        else if (movY < 0 && wallTop <= (playerBottom + movY) && wallBottom >= (playerTop + movY)) {
            if (playerRight <= wallRight && playerRight >= wallLeft) {
                movY = 0;
            }
            else if (playerLeft <= wallRight && playerLeft >= wallLeft) {
                movY = 0;
            }
        }
    }
    player.x += movX;
    player.y += movY;
}

class Projectile {
    constructor(startX, startY, width, height, velocity, image) {
        this.startX = startX;
        this.startY = startY;
        this.x = startX;
        this.y = startY;
        this.width = width;
        this.height = height;
        this.velocity = velocity;
        this.image = image;
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x - camera.x, this.y - camera.y);
        const angle = Math.atan2(this.velocity.y, this.velocity.x);
        ctx.rotate(angle);
        ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }
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
addEventListener("click", (event) => {
    const targetX = event.clientX - canvas.getBoundingClientRect().left + camera.x;
    const targetY = event.clientY - canvas.getBoundingClientRect().top + camera.y;

    const deltaX = targetX - (player.x + player.width / 2);
    const deltaY = targetY - (player.y + player.height / 2);

    const magnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    const normalizedDirection = {
        x: deltaX / magnitude,
        y: deltaY / magnitude,
    };

    const speed = 5;

    const velocity = {
        x: normalizedDirection.x * speed,
        y: normalizedDirection.y * speed,
    };

    const startX = player.x + player.width / 2;
    const startY = player.y + player.height / 2;

    const width = 25;
    const height = 14;

    const projectile = new Projectile(startX, startY, width, height, velocity, projectileImage);
    projectiles.push(projectile);
});