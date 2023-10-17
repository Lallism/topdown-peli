const objects = [];

class Object {
    constructor (tag, x, y, height, width, sprite) {
        this.tag = tag;
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.sprite = sprite;

        objects.push(this);
    }

    update() {

    }

    draw(ctx, camera) {
        ctx.drawImage(this.sprite, this.x - camera.x, this.y - camera.y);
    }
}

class AttackPowerUp extends Object {
    constructor(x, y, width, height, sprite, player) {
        super("attackPowerUp", x, y, width, height, sprite);
        this.player = player
        this.timer = 3000;
    }

    collected() {
        this.player.damage += 0.5;
        const powerUpIndex = objects.indexOf(this);
        if (powerUpIndex !== -1) {
            objects.splice(powerUpIndex, 1);
        }
    }

    update() {
        this.timer -= 5;
        if (this.timer <= 0) {
            const powerUpIndex = objects.indexOf(this);
            if (powerUpIndex !== -1) {
                objects.splice(powerUpIndex, 1);
            }
        }
    }
}

export { Object, objects, AttackPowerUp };