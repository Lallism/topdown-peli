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
        ctx.drawImage(this.sprite, Math.round(this.x - camera.x), Math.round(this.y - camera.y));
    }
}

export { Object, objects };