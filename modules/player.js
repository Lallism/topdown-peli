import { Object, objects } from "./object.js";

class Player extends Object {
    constructor(tag, x, y, height, width, sprite, speed) {
        super(tag, x, y, height, width, sprite);
        this.movR = 0;
        this.movL = 0;
        this.movU = 0;
        this.movD = 0;
        this.speed = speed;
        this.damage = 1;
        this.health = 5;
        this.maxHealth = 5;

        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowRight" || e.key === "Right") {
                this.movR = this.speed;
            }
            else if (e.key === "ArrowLeft" || e.key === "Left") {
                this.movL = this.speed;
            }
            else if (e.key === "ArrowUp" || e.key === "Up") {
                this.movU = this.speed;
            }
            else if (e.key === "ArrowDown" || e.key === "Down") {
                this.movD = this.speed;
            }
        });
        document.addEventListener("keyup", (e) => {
            if (e.key === "ArrowRight" || e.key === "Right") {
                this.movR = 0;
            }
            else if (e.key === "ArrowLeft" || e.key === "Left") {
                this.movL = 0;
            }
            else if (e.key === "ArrowUp" || e.key === "Up") {
                this.movU = 0;
            }
            else if (e.key === "ArrowDown" || e.key === "Down") {
                this.movD = 0;
            }
        });
    }

    update(deltaTime) {
        this.movePlayer(deltaTime);
    }

    movePlayer(deltaTime) {
        let playerTop = this.y;
        let playerBottom = this.y + this.height;
        let playerLeft = this.x;
        let playerRight = this.x + this.width;
    
        let movX = (this.movR - this.movL) * deltaTime;
        let movY = (this.movD - this.movU) * deltaTime;
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
        this.x += movX;
        this.y += movY;
    }
}

export { Player };