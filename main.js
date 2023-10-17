import { Object, objects, AttackPowerUp } from "./modules/object.js";
import { RangedEnemy, Enemy } from "./modules/enemy.js";
import { Player } from "./modules/player.js";
import { Projectile, projectiles } from "./modules/projectile.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const playerSprite = new Image();
playerSprite.src = "gfx/drake_emerald.png";

const butterflySprite = new Image();
butterflySprite.src = "gfx/frostfly.png";

const snailSprite = new Image();
snailSprite.src = "gfx/slugflora.png";

const catSprite = new Image();
catSprite.src = "gfx/sparkit.png";

const shellSprite = new Image();
shellSprite.src = "gfx/goldshell.png";

const attackUp = new Image()
attackUp.src = "gfx/attack_up.png"

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
const blueFireballSprite = new Image();
blueFireballSprite.src = "gfx/fireball_blue.png"

const level = [
    "####################################",
    "#################..#################",
    "#################..#################",
    "###..............................###",
    "###..............................###",
    "###..............................###",
    "###...#...#...#......#...#...#...###",
    "###..............................###",
    "###..............................###",
    "###..............................###",
    "###...#......................#...###",
    "###..............................###",
    "###..............................###",
    "#..................................#",
    "#..................................#",
    "###..............................###",
    "###..............................###",
    "###...#......................#...###",
    "###..............................###",
    "###..............................###",
    "###..............................###",
    "###...#...#...#......#...#...#...###",
    "###..............................###",
    "###..............................###",
    "###..............................###",
    "#################..#################",
    "#################..#################",
    "####################################"
]

const spawners = [
    {x: 560, y: 48},
    {x: 48, y: 432},
    {x: 1072, y: 432},
    {x: 560, y: 784}
]

const enemyData = [
    {sprite: butterflySprite, speed: 1, health: 5, range: 0, minDifficulty: 0, spawnChance: 10, score: 1},
    {sprite: snailSprite, speed: 0.5, health: 20, range: 0, minDifficulty: 5, spawnChance: 1, score: 2},
    {sprite: shellSprite, speed: 1, health: 10, range: 160, projectile: blueFireballSprite, projectileSpeed: 3, attackDelay: 1500, minDifficulty: 10, spawnChance: 5, score: 3},
    {sprite: catSprite, speed: 3, health: 2, range: 0, minDifficulty: 20, spawnChance: 1, score: 4}
]

const player = new Player("player", 560, 432, 32, 32, playerSprite, 2);

const barX = 15;
const barY = 15;
const barHeight = 10;
let healthBarWidth = (player.health * 10) * player.maxHealth;
let playerScore = 0;

const camera = {
    x: 0,
    y: 0
}

let difficulty = 0;

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

                new Object("wall", posX, posY, tileHeight, tileWidth, sprite);
            }
            posX += tileWidth;
        }
        posY += tileHeight;
        posX = 0;
    }
}

function checkCollision(obj1, obj2) {
    return (
        obj1.x + obj1.width > obj2.x + 6 &&
        obj1.x < obj2.x + obj2.width + 5 &&
        obj1.y + obj1.height > obj2.y + 3 &&
        obj1.y < obj2.y + obj2.height + 5
    );
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    cameraFollow(player); 

    for (const object of objects) {
        if (object.tag === "enemy") {
            if (checkCollision(player, object)) {
                player.health -= object.damage
                const enemyIndex = objects.indexOf(object);
                if (enemyIndex !== -1) {
                    objects.splice(enemyIndex, 1);
                }
                if (player.health <= 0) {
                    die();
                }                
            }
        }
        else if (object.tag === "attackPowerUp")
            if (checkCollision(player, object)) {
                object.collected();
        }

        object.draw(ctx, camera);
        object.update();
    }

    for (const projectile of projectiles) {
        for (const object of objects) {
            if (object.tag === "enemy" && projectile.tag === "player" && checkCollision(projectile, object)) {
                object.health -= projectile.damage;
                if (object.health <= 0) {
                    const enemyIndex = objects.indexOf(object);
                    if (enemyIndex !== -1) {
                        objects.splice(enemyIndex, 1);
                        playerScore += object.score
                        if (Math.random() < 0.2) {
                            const powerUp = new AttackPowerUp(object.x, object.y, 32, 32, attackUp, player);
                            objects.push(powerUp);
                        }
                    }
                }
                const projectileIndex = projectiles.indexOf(projectile);
                if (projectileIndex !== -1) {
                    projectiles.splice(projectileIndex, 1);
                }
            }

            if (object.tag === "player" && projectile.tag === "enemy" && checkCollision(projectile, object)) {
                player.health -= projectile.damage;
                if (player.health <= 0) {
                    die();
                }
                const projectileIndex = projectiles.indexOf(projectile);
                if (projectileIndex !== -1) {
                    projectiles.splice(projectileIndex, 1);
                }
            }
        }

        projectile.update();
        projectile.draw(ctx, camera);
    }

    const gradient = ctx.createLinearGradient(barX, barY, barX + healthBarWidth, barY);
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(1, 'red');

    ctx.fillStyle = gradient;
    ctx.fillRect(barX, barY, healthBarWidth, barHeight);

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.strokeRect(barX - 1, barY - 1, healthBarWidth + 2, barHeight + 2);

    if (player.health >= 0) {
        healthBarWidth = (player.health * 10) * player.maxHealth;
    }
    
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + playerScore, canvas.width - 100, 30);   

    checkProjectileWallCollision();
    window.requestAnimationFrame(update);
}

function spawnEnemies() {
    for (const spawner of spawners) {
        let spawn = 0;
        let randomMult = 0;
        for (const enemy of enemyData) {
            if (difficulty >= enemy.minDifficulty) {
                randomMult += enemy.spawnChance;
            }
        }
        let randomEnemy = Math.random() * randomMult;
        for (let i = 0; i < enemyData.length; i++) {
            const enemy = enemyData[i]
            if (randomEnemy <= enemy.spawnChance) {
                spawn = i;
                break;
            }
            else {
                randomEnemy -= enemy.spawnChance;
            }
        }
        const enemy = enemyData[spawn];

        if (enemy.range > 0) {
            new RangedEnemy("enemy", spawner.x, spawner.y, 32, 32, enemy.sprite, enemy.speed, player, enemy.health, enemy.range, enemy.projectile, enemy.projectileSpeed, enemy.attackDelay, enemy.score);
        }
        else {
            new Enemy("enemy", spawner.x, spawner.y, 32, 32, enemy.sprite, enemy.speed, player, enemy.health, enemy.score);
        }
    }

    difficulty++;
    setTimeout(spawnEnemies, Math.max(10000 - difficulty * 100, 5000))
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

function die() {
    console.log("player is dead") // Väliaikainen testi, pelin loppu...
}

function cameraFollow(target) {
    camera.x = target.x + target.width / 2 - canvas.width / 2;
    camera.y = target.y + target.width / 2 - canvas.height / 2;
}

loadLevel(level);
update();
setTimeout(spawnEnemies, 5000)

let canShoot = false;
let shootingInterval;
let targetX, targetY;

canvas.addEventListener("mousedown", (event) => {
    if (event.button === 0) {
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
        const projectile = new Projectile("player", startX, startY, width, height, velocity, projectileImage, player.damage);
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
                const projectile = new Projectile("player", startX, startY, width, height, velocity, projectileImage, player.damage);
                projectiles.push(projectile);
            }
        }, 150);

        canvas.addEventListener("mousemove", updateTarget);

        canvas.addEventListener("mouseup", () => {
            canShoot = false;
            clearInterval(shootingInterval);
            canvas.removeEventListener("mousemove", updateTarget);
        });
    }
});

canvas.addEventListener("contextmenu", (event) => {
    event.preventDefault();
});

function updateTarget(event) {
    targetX = event.clientX - canvas.getBoundingClientRect().left + camera.x;
    targetY = event.clientY - canvas.getBoundingClientRect().top + camera.y;
}