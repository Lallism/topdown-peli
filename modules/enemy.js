import { Object, objects } from "./object.js";
import { Projectile, projectiles } from "./projectile.js";

class Enemy extends Object {
    constructor (tag, x, y, height, width, sprite, speed, target, health, score) {
        super(tag, x, y, height, width, sprite);
        this.speed = speed;
        this.target = target;
        this.health = health;
        this.damage = 1
        this.score = score
    }

    update(deltaTime) {
        const deltaX = this.target.x - this.x;
        const deltaY = this.target.y - this.y;
        const magnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const normalizedDirection = {
            x: deltaX / magnitude,
            y: deltaY / magnitude,
        };

        const velocity = {
            x: normalizedDirection.x * this.speed,
            y: normalizedDirection.y * this.speed,
        };

        let enemyTop = this.y;
        let enemyBottom = this.y + this.height;
        let enemyLeft = this.x;
        let enemyRight = this.x + this.width;
    
        let movX = velocity.x * deltaTime;
        let movY = velocity.y * deltaTime;
        const length = objects.length;
        for (let i = 0; i < length; i++) {
            const object = objects[i];

            if (object.tag != "wall") {
                continue
            }
    
            let wallTop = object.y;
            let wallBottom = object.y + object.height;
            let wallLeft = object.x;
            let wallRight = object.x + object.width;
    
            if (movX > 0 && wallLeft <= (enemyRight + movX) && wallRight >= (enemyLeft + movX)) {
                if (enemyTop <= wallBottom && enemyTop >= wallTop) {
                    movX = 0;
                }
                if (enemyBottom <= wallBottom && enemyBottom >= wallTop) {
                    movX = 0;
                }
            }
            else if (movX < 0 && wallLeft <= (enemyRight + movX) && wallRight >= (enemyLeft + movX)) {
                if (enemyTop <= wallBottom && enemyTop >= wallTop) {
                    movX = 0;
                }
                else if (enemyBottom <= wallBottom && enemyBottom >= wallTop) {
                    movX = 0;
                }
            }
            if (movY > 0 && wallTop <= (enemyBottom + movY) && wallBottom >= (enemyTop + movY)) {
                if (enemyRight <= wallRight && enemyRight >= wallLeft) {
                    movY = 0;
                }
                if (enemyLeft <= wallRight && enemyLeft >= wallLeft) {
                    movY = 0;
                }
            }
            else if (movY < 0 && wallTop <= (enemyBottom + movY) && wallBottom >= (enemyTop + movY)) {
                if (enemyRight <= wallRight && enemyRight >= wallLeft) {
                    movY = 0;
                }
                else if (enemyLeft <= wallRight && enemyLeft >= wallLeft) {
                    movY = 0;
                }
            }
        }
        this.x += movX;
        this.y += movY;
    }
}

class RangedEnemy extends Enemy {
    constructor(tag, x, y, height, width, sprite, speed, target, health, range, projectile, projectileSpeed, attackDelay, score) {
        super(tag, x, y, height, width, sprite, speed, target, health);
        this.range = range;
        this.projectile = projectile;
        this.projectileSpeed = projectileSpeed;
        this.attackDelay = attackDelay;
        this.canShoot = true;
        this.score = score
    }

    update(deltaTime) {
        const deltaX = this.target.x - this.x;
        const deltaY = this.target.y - this.y;
        const magnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (magnitude < this.range) {
            if (this.canShoot) {
                this.canShoot = false;
                setTimeout(this.shoot, this.attackDelay, this);
            }
            return;
        }

        const normalizedDirection = {
            x: deltaX / magnitude,
            y: deltaY / magnitude,
        };

        const velocity = {
            x: normalizedDirection.x * this.speed,
            y: normalizedDirection.y * this.speed,
        };

        let enemyTop = this.y;
        let enemyBottom = this.y + this.height;
        let enemyLeft = this.x;
        let enemyRight = this.x + this.width;
    
        let movX = velocity.x * deltaTime;
        let movY = velocity.y * deltaTime;
        const length = objects.length;
        for (let i = 0; i < length; i++) {
            const object = objects[i];

            if (object.tag != "wall") {
                continue
            }
    
            let wallTop = object.y;
            let wallBottom = object.y + object.height;
            let wallLeft = object.x;
            let wallRight = object.x + object.width;
    
            if (movX > 0 && wallLeft <= (enemyRight + movX) && wallRight >= (enemyLeft + movX)) {
                if (enemyTop <= wallBottom && enemyTop >= wallTop) {
                    movX = 0;
                }
                if (enemyBottom <= wallBottom && enemyBottom >= wallTop) {
                    movX = 0;
                }
            }
            else if (movX < 0 && wallLeft <= (enemyRight + movX) && wallRight >= (enemyLeft + movX)) {
                if (enemyTop <= wallBottom && enemyTop >= wallTop) {
                    movX = 0;
                }
                else if (enemyBottom <= wallBottom && enemyBottom >= wallTop) {
                    movX = 0;
                }
            }
            if (movY > 0 && wallTop <= (enemyBottom + movY) && wallBottom >= (enemyTop + movY)) {
                if (enemyRight <= wallRight && enemyRight >= wallLeft) {
                    movY = 0;
                }
                if (enemyLeft <= wallRight && enemyLeft >= wallLeft) {
                    movY = 0;
                }
            }
            else if (movY < 0 && wallTop <= (enemyBottom + movY) && wallBottom >= (enemyTop + movY)) {
                if (enemyRight <= wallRight && enemyRight >= wallLeft) {
                    movY = 0;
                }
                else if (enemyLeft <= wallRight && enemyLeft >= wallLeft) {
                    movY = 0;
                }
            }
        }
        this.x += movX;
        this.y += movY;
    }

    shoot(self) {
        if (self.health <= 0) {
            return;
        }
        const deltaX = (self.target.x + self.target.width / 2) - (self.x + self.width / 2);
        const deltaY = (self.target.y + self.target.height / 2) - (self.y + self.height / 2);
        const magnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const normalizedDirection = {
            x: deltaX / magnitude,
            y: deltaY / magnitude,
        };

        const velocity = {
            x: normalizedDirection.x * self.projectileSpeed,
            y: normalizedDirection.y * self.projectileSpeed,
        };

        const startX = self.x + self.width / 2;
        const startY = self.y + self.height / 2;
        const width = 25;
        const height = 14;
        const projectile = new Projectile("enemy", startX, startY, width, height, velocity, self.projectile, self.damage);
        projectiles.push(projectile);

        self.canShoot = true;
    }
}

export { Enemy, RangedEnemy };