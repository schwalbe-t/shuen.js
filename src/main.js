
let _SHUEN_MAIN_SCENE = Scene(100, 100);

/**
 * Replaces the current main scene with the given scene.
 * @param {Scene} scene The new main scene.
 */
function replaceMainScene(scene) {
    _SHUEN_MAIN_SCENE = scene;
}

/**
 * Creates a new entity with the given sprite, size and layer.
 * Entities with higher layers are rendered on top of those with lower
 * layers, and inside the same layer entities with a lower Y coordinate
 * are rendered on top of those with a higher Y coordinate.
 * The entity will exist until it is explicitly destroyed
 * using the `destroy`-function.
 * @param {(string|Texture)} sprite - The image to use for the entity. This may be a string URL or a texture object.
 * @param {number} size - The height of the displayed image in world units.
 * @param {number} layer - An integer describing the layer of the entity.
 * @returns A reference to the new entity.
 */
function spawn(sprite, size = 1.0, layer = 0) {
    return _SHUEN_MAIN_SCENE.spawn(sprite, size, layer);
}

/**
 * Removes the given entity.
 * Destroying an entity that has already been destroyed has no effect.
 * @param {Entity} entity - The entity to remove. 
 */
function destroy(entity) {
    _SHUEN_MAIN_SCENE.destroy(entity);
}

/**
 * Centers the camera on the given position in the world.
 * @param {number} x The X-coordinate of the position to center. 
 * @param {number} y The Y-coordinate of the position to center.
 * @param {number} dist The height of the area visible by the camera in world units.
 */
function lookAt(x, y, dist = 20.0) {
    _SHUEN_MAIN_SCENE.lookAt(x, y, dist);
}

window.addEventListener("load", () => {

    function renderLoop(canvas, ctx) {
        let lastTimeStamp = -1;
        const frameHandler = (timestamp) => {
            _SHUEN_MAIN_SCENE.width = canvas.offsetWidth;
            _SHUEN_MAIN_SCENE.height = canvas.offsetHeight;
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            const deltaTime = lastTimeStamp === -1? 0.0
                : (timestamp - lastTimeStamp) / 1000.0;
            lastTimeStamp = timestamp;
            if(globalThis.render !== undefined) {
                globalThis.render(deltaTime);
            }
            const render = _SHUEN_MAIN_SCENE.render();
            ctx.fillStyle = "#111111";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(render._canvas, 0, 0);
            window.requestAnimationFrame(frameHandler);
        };
        window.requestAnimationFrame(frameHandler);
    }

    function updateLoop() {
        setInterval(() => {
            if(globalThis.update === undefined) { return; }
            globalThis.update();
        }, 1000 / 30);
    }

    function createCanvas() {
        const canvas = document.createElement("canvas");
        canvas.style.position = "absolute";
        canvas.style.top = "0px";
        canvas.style.left = "0px";
        canvas.style.width = "100vw";
        canvas.style.height = "100vh";
        document.body.appendChild(canvas);
        const ctx = canvas.getContext("2d");
        renderLoop(canvas, ctx);
        updateLoop();
    }

    createCanvas();
    
});