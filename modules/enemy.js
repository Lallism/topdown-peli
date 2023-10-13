import { Object, objects } from "./object.js";

class Enemy extends Object {
    constructor (tag, x, y, height, width, sprite, speed, target) {
        super(tag, x, y, height, width, sprite);
        this.speed = speed;
        this.target = target;
    }

    update() {
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
    
        let movX = velocity.x;
        let movY = velocity.y;
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

export { Enemy };