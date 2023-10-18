import { Object, objects, AttackPowerUp, HealthPowerUp } from "./modules/object.js";
import { RangedEnemy, Enemy } from "./modules/enemy.js";
import { Player } from "./modules/player.js";
import { Projectile, projectiles } from "./modules/projectile.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const font = new FontFace("quicksand", "url(Quicksand-Regular.ttf)")
document.fonts.add(font);

let lastTime = 0;

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

const healthUp = new Image()
healthUp.src = "gfx/health_up.png"

const tileWidth = 32;
const tileHeight = 32;

const wallSprite = new Image();
wallSprite.src = "gfx/wall.png";
const wallSprite2 = new Image();
wallSprite2.src = "gfx/wall2.png";
const wallSprite3 = new Image();
wallSprite3.src = "gfx/wall3.png";

const smallFireballSprite = new Image();
smallFireballSprite.src = "gfx/fireball_s.png";
const fireballSprite = new Image();
fireballSprite.src = "gfx/fireball.png";
const largeFireballSprite = new Image();
largeFireballSprite.src = "gfx/fireball_large.png";
const xLargeFireballSprite = new Image();
xLargeFireballSprite.src = "gfx/fireball_xlarge.png";
const blueFireballSprite = new Image();
blueFireballSprite.src = "gfx/fireball_blue.png";

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
    {sprite: butterflySprite, speed: 1.5, health: 5, healthScaling: 0.5, range: 0, minDifficulty: 0, spawnChance: 10, score: 1},
    {sprite: snailSprite, speed: 0.8, health: 20, healthScaling: 5, range: 0, minDifficulty: 5, spawnChance: 1, score: 2},
    {sprite: shellSprite, speed: 1.5, health: 10, healthScaling: 1, range: 160, projectile: blueFireballSprite, projectileSpeed: 5, attackDelay: 1500, minDifficulty: 10, spawnChance: 5, score: 3},
    {sprite: catSprite, speed: 4, health: 1, healthScaling: 0, range: 0, minDifficulty: 20, spawnChance: 1, score: 4}
]

const player = new Player("player", 560, 432, 32, 32, playerSprite, 3);

const barX = 15;
const barY = 15;
const barHeight = 10;
let healthBarWidth = (player.health * 10) * player.maxHealth;
let playerScore = 0;
let enemyKills = 0;

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

let gameOver = false;

function update() {
    if (!gameOver) {
        const currTime = new Date().getTime();
        const deltaTime = Math.min((currTime - lastTime) / 10, 5);
        lastTime = currTime;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        cameraFollow(player);

        for (const object of objects) {
            if (object.tag === "enemy") {
                if (checkCollision(player, object)) {
                    player.health -= object.damage
                    const enemyIndex = objects.indexOf(object);
                    if (enemyIndex !== -1) {
                        object.health = 0;
                        objects.splice(enemyIndex, 1);
                    }
                    if (player.health <= 0) {
                        die();
                    }                
                }
            }
            else if (object.tag === "attackPowerUp" || object.tag === "healthPowerUp")
                if (checkCollision(player, object)) {
                    object.collected();
            }

            object.draw(ctx, camera);
            object.update(deltaTime);
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
                            enemyKills++
                            if (Math.random() < 0.1 || enemyKills % 20 == 0) {
                                const powerUp = new AttackPowerUp(object.x, object.y, 32, 32, attackUp, player);
                                objects.push(powerUp);
                            }
                            else if (Math.random() < 0.1 || enemyKills % 30 == 0) {
                                const powerUp = new HealthPowerUp(object.x, object.y, 32, 32, healthUp, player);
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

            projectile.update(deltaTime);
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
        ctx.font = 'bold 20px quicksand';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.strokeText('Score: ' + playerScore, canvas.width - 115, 25);
        ctx.fillText('Score: ' + playerScore, canvas.width - 115, 25);
        ctx.strokeText('Wave: ' + difficulty, canvas.width - 360, 25);
        ctx.fillText('Wave: ' + difficulty, canvas.width - 360, 25);

        checkProjectileWallCollision();
        
        window.requestAnimationFrame(update);
    }
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
        const totalHealthMultiplier = 1 + 0.02 * difficulty;
        const enemyHealth = Math.floor((enemy.health + enemy.healthScaling * difficulty) * totalHealthMultiplier);

        if (enemy.range > 0) {
            new RangedEnemy("enemy", spawner.x, spawner.y, 32, 32, enemy.sprite, enemy.speed, player, enemyHealth, enemy.range, enemy.projectile, enemy.projectileSpeed, enemy.attackDelay, enemy.score);
        }
        else {
            new Enemy("enemy", spawner.x, spawner.y, 32, 32, enemy.sprite, enemy.speed, player, enemyHealth, enemy.score);
        }
    }

    difficulty++;
    const spawnDelay = Math.max(200000 / (20 + difficulty), 2000)
    setTimeout(spawnEnemies, spawnDelay)
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
    gameOver = true;
    const endgameScreen = document.getElementById("endgame-screen");
    const scoreDisplay = document.getElementById("score-display");
    const waveDisplay = document.getElementById("wave-display");
    scoreDisplay.textContent = playerScore;
    waveDisplay.textContent = difficulty;
    endgameScreen.style.display = "block";
}

const restartButton = document.getElementById("restart-button");
restartButton.addEventListener("click", () => {
  location.reload();
});

function cameraFollow(target) {
    camera.x = target.x + target.width / 2 - canvas.width / 2;
    camera.y = target.y + target.width / 2 - canvas.height / 2;
}

loadLevel(level);
font.load().then(
    () => {
        update();
    },
    (err) => {
        console.error(err);
    }
)
setTimeout(spawnEnemies, 5000)

let canShoot = false;
let shootingInterval;
let targetX, targetY;

canvas.addEventListener("mousedown", (event) => {
    if (event.button === 0) {
        let projectileSprite = smallFireballSprite;
        let width = 18;
        let height = 10;
        if (player.damage > 10) {
            projectileSprite = xLargeFireballSprite;
            width = 32;
            height = 24;
        }
        else if (player.damage > 6) {
            projectileSprite = largeFireballSprite;
            width = 32;
            height = 18;
        }
        else if (player.damage > 3) {
            projectileSprite = fireballSprite;
            width = 25;
            height = 14;
        }

        canShoot = true;
        updateTarget(event);

        const deltaX = targetX - (player.x + player.width / 2);
        const deltaY = targetY - (player.y + player.height / 2);
        const magnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const normalizedDirection = {
            x: deltaX / magnitude,
            y: deltaY / magnitude,
        };

        const speed = 6;
        const velocity = {
            x: normalizedDirection.x * speed,
            y: normalizedDirection.y * speed,
        };

        const startX = player.x + player.width / 2;
        const startY = player.y + player.height / 2;
        const projectile = new Projectile("player", startX, startY, width, height, velocity, projectileSprite, player.damage);
        projectiles.push(projectile);

        shootingInterval = setInterval(() => {
            if (canShoot) {
                if (player.damage > 10) {
                    projectileSprite = xLargeFireballSprite;
                    width = 32;
                    height = 24;
                }
                else if (player.damage > 6) {
                    projectileSprite = largeFireballSprite;
                    width = 32;
                    height = 18;
                }
                else if (player.damage > 3) {
                    projectileSprite = fireballSprite;
                    width = 25;
                    height = 14;
                }

                const deltaX = targetX - (player.x + player.width / 2);
                const deltaY = targetY - (player.y + player.height / 2);
                const magnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                const normalizedDirection = {
                    x: deltaX / magnitude,
                    y: deltaY / magnitude,
                };

                const speed = 6;
                const velocity = {
                    x: normalizedDirection.x * speed,
                    y: normalizedDirection.y * speed,
                };

                const startX = player.x + player.width / 2;
                const startY = player.y + player.height / 2;
                const projectile = new Projectile("player", startX, startY, width, height, velocity, projectileSprite, player.damage);
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