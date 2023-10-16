const projectiles = [];

class Projectile {
    constructor(tag, startX, startY, width, height, velocity, image) {
        this.tag = tag;
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

    draw(ctx, camera) {
        ctx.save();
        ctx.translate(this.x - camera.x, this.y - camera.y);
        const angle = Math.atan2(this.velocity.y, this.velocity.x);
        ctx.rotate(angle);
        ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }
}

export { Projectile, projectiles };