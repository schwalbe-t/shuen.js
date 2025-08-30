
const ShuenRenderer = (() => {

    const imageCache = {};

    function getSpriteImage(sprite) {
        if(typeof sprite == "object") {
            return sprite._canvas;
        }
        if(typeof sprite != "string") {
            throw new Error("The entity sprite must be a string URL or image object!");
        }
        const cached = imageCache[sprite];
        if(cached) { return cached; }
        const img = new Image();
        img.src = sprite;
        imageCache[sprite] = img;
        return img;
    }

    const unitSizeOnTex = scene => scene.height / scene._camera.dist;

    function computeDestX(scene, worldX) {
        const u = unitSizeOnTex(scene);
        const relX = worldX - scene._camera.x;
        return scene.width / 2.0
            + relX * u;
    }

    function computeDestY(scene, worldY) {
        const u = unitSizeOnTex(scene);
        const relY = worldY - scene._camera.y;
        return scene.height / 2.0
            - relY * u;
    }

    const entityRenderOrder = (a, b) => a.layer !== b.layer
        ? a.layer - b.layer // 1. in order of ascending layer value
        : b.y - a.y; // 2. on same layer in order of descending Y coordinate

    function renderEntity(scene, entity) {
        if(typeof entity.x != "number") {
            throw new Error("The x-coordinate of the entity must be a number!");
        }
        if(typeof entity.y != "number") {
            throw new Error("The y-coordinate of the entity must be a number!");
        }
        if(typeof entity.size != "number") {
            throw new Error("The size of the entity must be a number!");
        }
        const u = unitSizeOnTex(scene);
        const img = getSpriteImage(entity.sprite);
        const destHeight = entity.size * u;
        const destScale = destHeight / img.height;
        const destWidth = img.width * destScale;
        const anchorDestX = computeDestX(scene, entity.x);
        const anchorDestY = computeDestY(scene, entity.y);
        const destLeft = anchorDestX - destWidth / 2.0;
        const destTop = anchorDestY - destHeight;
        scene._output._ctx.drawImage(
            img, destLeft, destTop, destWidth, destHeight
        );
    }

    function renderScene(scene) {
        scene._output.clear();
        scene._output.resizeFast(scene.width, scene.height);
        scene._regEntities.sort(entityRenderOrder);
        for(const entity of scene._regEntities) {
            renderEntity(scene, entity);
        }
    }

    return {
        renderEntity,
        renderScene
    };
})();