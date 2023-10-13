import { Object, objects } from "./modules/object.js";
import { Player } from "./modules/player.js";

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

const player = new Player("player", 48, 48, 32, 32, playerSprite, 2);

const camera = {
    x: 0,
    y: 0
}

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

                const newWall = new Object("wall", posX, posY, tileHeight, tileWidth, sprite);
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

    cameraFollow(player);
    
    for (const object of objects) {
        object.draw(ctx, camera);
        object.update();
    }

    for (const projectile of projectiles) {
        projectile.update();
        projectile.draw();
    }
    checkProjectileWallCollision();
    window.requestAnimationFrame(update);
}

function checkProjectileWallCollision() {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i];
        for (let j = 0; j < objects.length; j++) {
            const wall = objects[j];

            if (wall.tag != "wall") {
                continue;
            }

            if (
                projectile.x + projectile.width > wall.x + 12 &&
                projectile.x < wall.x + tileWidth + 10 &&
                projectile.y + projectile.height > wall.y + 5 &&
                projectile.y < wall.y + tileHeight + 10
            ) {
                projectiles.splice(i, 1);
                break;
            }
        }
    }
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

loadLevel(level);
update();

let canShoot = false;
let shootingInterval;
let targetX, targetY;

canvas.addEventListener("mousedown", (event) => {
    canShoot = true;
    updateTarget(event);

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

    shootingInterval = setInterval(() => {
        if (canShoot) {
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
        }
    }, 150);

    canvas.addEventListener("mousemove", updateTarget);

    canvas.addEventListener("mouseup", () => {
        canShoot = false;
        clearInterval(shootingInterval);
        canvas.removeEventListener("mousemove", updateTarget);
    });

    function updateTarget(event) {
        targetX = event.clientX - canvas.getBoundingClientRect().left + camera.x;
        targetY = event.clientY - canvas.getBoundingClientRect().top + camera.y;
    }
});

canvas.addEventListener("contextmenu", (event) => {
    event.preventDefault();
});