// This is free and unencumbered software released into the public domain.
// 
// Anyone is free to copy, modify, publish, use, compile, sell, or
// distribute this software, either in source code form or as a compiled
// binary, for any purpose, commercial or non-commercial, and by any
// means.
// 
// In jurisdictions that recognize copyright laws, the author or authors
// of this software dedicate any and all copyright interest in the
// software to the public domain. We make this dedication for the benefit
// of the public at large and to the detriment of our heirs and
// successors. We intend this dedication to be an overt act of
// relinquishment in perpetuity of all present and future rights to this
// software under copyright law.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
// OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
// ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.
// 
// For more information, please refer to <https://unlicense.org>

/**
 * Starts playback of the given sound. Starting playback of the same sound
 * while it is already running will stop the playback and call the previously
 * given callback.
 * @param {string} audio The URL of the audio file to play.
 * @param {function} onStop A function that shall be called when playback is stopped.
 */
const play = (() => {

    const playerCache = {};

    function getAudioPlayer(audio) {
        const cached = playerCache[audio];
        if(cached) { return cached; }
        if(typeof audio != "string") {
            throw new Error("The played audio must be a string URL!");
        }
        const player = new Audio(audio);
        playerCache[audio] = player;
        return player;
    }

    return (audio, onStop = (() => {})) => {
        const player = getAudioPlayer(audio);
        if(!player.ended) {
            player.pause();
            if(player.onended) { player.onended(); }
            player.currentTime = 0;
        }
        player.onended = () => onStop();
        player.play();
    };

})();

const ShuenInputManager = (() => {

    const SHUEN_KEY_MAP = Object.freeze({
        "esc": "Escape", "escape": "Escape",
        "0": "Digit0",
        "1": "Digit1",
        "2": "Digit2",
        "3": "Digit3",
        "4": "Digit4",
        "5": "Digit5",
        "6": "Digit6",
        "7": "Digit7",
        "8": "Digit8",
        "9": "Digit9",
        "-": "Minus", "minus": "Minus",
        "=": "Equal", "equal": "Equal",
        "backspace": "Backspace",
        "tab": "Tab",
        "a": "KeyA",
        "b": "KeyB",
        "c": "KeyC",
        "d": "KeyD",
        "e": "KeyE",
        "f": "KeyF",
        "g": "KeyG",
        "h": "KeyH",
        "i": "KeyI",
        "j": "KeyJ",
        "k": "KeyK",
        "l": "KeyL",
        "m": "KeyM",
        "n": "KeyN",
        "o": "KeyO",
        "p": "KeyP",
        "q": "KeyQ",
        "r": "KeyR",
        "s": "KeyS",
        "t": "KeyT",
        "u": "KeyU",
        "v": "KeyV",
        "w": "KeyW",
        "x": "KeyX",
        "y": "KeyY",
        "z": "KeyZ",
        "[": "BracketLeft", "bracketleft": "BracketLeft", "leftbracket": "BracketLeft", "bracketopen": "BracketLeft",
        "]": "BracketRight", "bracketright": "BracketRight", "rightbracket": "BracketRight", "bracketclose": "BracketRight",
        "enter": "Enter",
        "ctrl": "ControlLeft", "ctrlleft": "ControlLeft", "leftctrl": "ControlLeft",
        ";": "Semicolon", "semicolon": "Semicolon",
        "\"": "Quote", "quote": "Quote",
        "`": "Backquote", "backquote": "Backquote",
        "shift": "ShiftLeft", "shiftleft": "ShiftLeft", "leftshift": "ShiftLeft",
        "\\": "Backslash", "backslash": "Backslash",
        ",": "Comma", "comma": "Comma",
        ".": "Period", "dot": "Period", "period": "Period",
        "/": "Slash", "slash": "Slash",
        "shiftright": "ShiftRight", "rightshift": "ShiftRight",
        "alt": "AltLeft", "altleft": "AltLeft", "leftalt": "AltLeft",
        " ": "Space", "space": "Space",
        "caps": "CapsLock", "capslock": "CapsLock",
        "f1": "F1",
        "f2": "F2",
        "f3": "F3",
        "f4": "F4",
        "f5": "F5",
        "f6": "F6",
        "f7": "F7",
        "f8": "F8",
        "f9": "F9",
        "f10": "F10",
        "f11": "F11",
        "f12": "F12",
        "up": "ArrowUp", "arrowup": "ArrowUp", "uparrow": "ArrowUp",
        "down": "ArrowDown", "arrowdown": "ArrowDown", "downarrow": "ArrowDown",
        "left": "ArrowLeft", "arrowleft": "ArrowLeft", "leftarrow": "ArrowLeft",
        "right": "ArrowRight", "arrowright": "ArrowRight", "rightarrow": "ArrowRight"
    });

    function getKeyCode(key) {
        const keyCode = SHUEN_KEY_MAP[key.toLowerCase()];
        if(keyCode !== undefined) { return keyCode; }
        throw new Error(`'${key}' is not a known key!`);
    }

    const pressed = new Set();
    const unpressed = new Set();
    window.addEventListener("keydown", e => pressed.add(e.code));
    window.addEventListener("keyup", e => {
        pressed.delete(e.code);
        unpressed.add(e.code);
    });

    const isPressed = key => pressed.has(getKeyCode(key));
    const wasPressed = key => unpressed.has(getKeyCode(key));


    const SHUEN_BUTTON_MAP = Object.freeze({
        "left": 0,
        "wheel": 1, "middle": 1,
        "right": 2
    });

    function getButtonCode(button) {
        const buttonCode = SHUEN_BUTTON_MAP[button.toLowerCase()];
        if(buttonCode !== undefined) { return buttonCode; }
        throw new Error(`'${button}' is not a known button!`);
    }

    const clicked = new Set();
    const unclicked = new Set();
    window.addEventListener("mousedown", e => clicked.add(e.button));
    window.addEventListener("mouseup", e => {
        clicked.delete(e.button);
        unclicked.add(e.button);
    });

    const isClicked = button => clicked.has(getButtonCode(button));
    const wasClicked = button => unclicked.has(getButtonCode(button));


    function _onUpdateEnd() {
        unpressed.clear();
        unclicked.clear();
    }

    return {
        isPressed, wasPressed,
        isClicked, wasClicked,
        _onUpdateEnd
    };

})();

/**
 * Returns if the given keyboard key is pressed.
 * The key name can be one of (case-insensitive):
 * - `"esc"`, `"escape"`
 * - `"0"`, `"1"`, `"2"`, `"3"`, `"4"`, `"5"`, `"6"`, `"7"`, `"8"`, `"9"`,
 * - `"-"`, `"minus"`
 * - `"="`, `"equal"`
 * - `"backspace"`
 * - `"tab"`
 * - `"a"`, `"b"`, `"c"`, `"d"`, ..., `"w"`, `"x"`, `"y"`, `"z"`
 * - `"["`, `"bracketleft"`, `"leftbracket"`, `"bracketopen"`
 * - `"]"`, `"bracketright"`, `"rightbracket"`, `"bracketclose"`
 * - `"enter"`
 * - `"ctrl"`, `"ctrlleft"`, `"leftctrl"`
 * - `";"`, `"semicolon"`
 * - `'"'`, `"quote"`
 * - `"backquote"`
 * - `"shift"`, `"shiftleft"`, `"leftshift"`
 * - `"\\"`, `"backslash"`
 * - `","`, `"comma"`
 * - `"."`, `"dot"`, `"period"`
 * - `"/"`, `"slash"`
 * - `"shiftright"`, `"rightshift"`
 * - `"alt"`, `"altleft"`, `"leftalt"`
 * - `" "`, `"space"`
 * - `"caps"`, `"capslock"`
 * - `"f1"`, `"f2"`, `"f3"`, ..., `"f10"`, `"f11"`, `"f12"`
 * - `"up"`, `"uparrow"`, `"arrowup"`
 * - `"down"`, `"downarrow"`, `"arrowdown"`
 * - `"left"`, `"leftarrow"`, `"arrowleft"`
 * - `"right"`, `"rightarrow"`, `"arrowright"`
 * @param {string} key Name of the key to check.
 * @returns True if the key is pressed at the time of calling, and otherwise false.
 */
const isPressed = ShuenInputManager.isPressed;

/**
 * Returns if the given keyboard key was released since the last update.
 * Refer to the documentation of `isPressed` for a list of all valid key names.
 * @param {string} key Name of the key to check.
 * @returns True if the key was released since the last update, and otherwise false.
 */
const wasPressed = ShuenInputManager.wasPressed;

/**
 * Returns if the given mouse button is clicked.
 * The button name can be one of (case-insensitive):
 * - `"left"`
 * - `"middle"`, `"wheel"`
 * - `"right"`
 * @param {string} button Name of the button to check.
 * @returns True if the button is clicked at the time of calling, and otherwise false.
 */
const isClicked = ShuenInputManager.isClicked;

/**
 * Returns if the given mouse button was released.
 * The button name can be one of (case-insensitive):
 * - `"left"`
 * - `"middle"`, `"wheel"`
 * - `"right"`
 * @param {string} button Name of the button to check.
 * @returns True if the button was released since the last update, and otherwise false.
 */
const wasClicked = ShuenInputManager.wasClicked;

let _SHUEN_MAIN_SCENE = Scene(100, 100);

/**
 * Replaces the current main scene with the given scene. Calls to the global 
 * `spawn`, `destroy` and `lookAt` functions will then affect the given scene 
 * instead. Note that if `spawn` was previously used, `destroy` must be still 
 * used on *the old scene* to actually destroy the entity.
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

    function startRenderLoop(canvas, ctx) {
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

    function startUpdateLoop() {
        setInterval(() => {
            if(globalThis.update === undefined) { return; }
            globalThis.update();
            ShuenInputManager._onUpdateEnd();
        }, 1000 / 60.0);
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
        startRenderLoop(canvas, ctx);
        startUpdateLoop();
    }

    createCanvas();
    
});

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

/**
 * Creates a new, empty scene which is rendered onto a texture with the given
 * pixel dimensions.
 * @param {number} width The width of the render output texture in pixels.
 * @param {number} height The height of the render output texture in pixels.
 * @returns The new scene.
 */
function Scene(width, height) {
    return {
        /**
         * The width of the render output texture in pixels.
         */
        width, 
        /**
         * The height of the render output texture in pixels.
         */
        height,
        
        /** @private */
        _regEntities: [],

        /** @private */
        _camera: {
            x: 0.0,
            y: 0.0,
            dist: 20.0
        },

        /** @private */
        _output: Texture(width, height),

        /**
         * Creates a new entity with the given sprite, size and layer in the 
         * scene.
         * Entities with higher layers are rendered on top of those with lower
         * layers, and inside the same layer entities with a lower Y coordinate
         * are rendered on top of those with a higher Y coordinate.
         * The entity will exist in this scene until it is explicitly destroyed
         * using the `destroy`-method.
         * @param {(string|Texture)} sprite - The image to use for the entity. This may be a string URL or a texture object.
         * @param {number} size - The height of the displayed image in world units.
         * @param {number} layer - An integer describing the layer of the entity.
         * @returns A reference to the new entity.
         */
        spawn: function(sprite, size = 1.0, layer = 0) {
            if(typeof sprite != "string" && typeof sprite != "object") {
                throw new Error("The entity sprite must be a string URL or image object!")
            }
            if(typeof size != "number") {
                throw new Error("The entity size must a number!");
            }
            if(!Number.isInteger(layer)) {
                throw new Error("The entity layer must be an integer!");
            }
            const entity = {
                x: 0.0, y: 0.0,
                sprite, size, layer
            };
            this._regEntities.push(entity);
            return entity;
        },

        /**
         * Removes the given entity from the scene.
         * Destroying an entity that is not part of the scene has no effect.
         * @param {Entity} entity - The entity to remove from the scene. 
         */
        destroy: function(entity) {
            if(typeof entity != "object") {
                throw new Error("The removed thing must be an entity!");
            }
            this._regEntities = this._regEntities
                .filter(e => e !== entity);
        },

        /**
         * Centers the camera on the given position in the world.
         * @param {number} x The X-coordinate of the position to center. 
         * @param {number} y The Y-coordinate of the position to center.
         * @param {number} dist The height of the area visible by the camera in world units.
         */
        lookAt: function(x, y, dist = 20.0) {
            if(typeof x != "number") {
                throw new Error("The x-coordinate must be a number!");
            }
            if(typeof y != "number") {
                throw new Error("The y-coordinate must be a number!");
            }
            if(typeof dist != "number") {
                throw new Error("The distance must be a number!");
            }
            this._camera.x = x;
            this._camera.y = y;
            this._camera.dist = dist;
        },

        /**
         * Returns a shallow copy of all entities present in the scene at the
         * time of calling.
         * The order or amount of the entities present in the array may change
         * freely between invocations.
         * @returns A list of all entities present in the scene.
         */
        entities: function() {
            return [...this._regEntities];
        },

        /**
         * Renders the scene onto the output texture.
         * Calling this method repeatedly shall render onto the same texture,
         * which can be cloned at any time using the Texture's `clone`-method.
         * @returns The output texture of the scene containing the new render.
         */
        render: function() {
            ShuenRenderer.renderScene(this);
            return this._output;
        }
    };
}

/**
 * Creates a new, empty texture with the given pixel dimensions.
 * @param {number} width The initial width of the texture in pixels.
 * @param {number} height The initial height of the texture in pixels.
 * @returns The new texture.
 */
function Texture(width, height) {
    const texture = {
        /** @private */
        _width: 0,

        /** @private */
        _height: 0,

        /** @private */
        _canvas: null,

        /** @private */
        _ctx: null,

        /**
         * Returns the width of the texture in pixels.
         * @returns The width of the texture.
         */
        width: function() { return this._width; },

        /**
         * Returns the height of the texture in pixels.
         * @returns The height of the texture.
         */
        height: function() { return this._height; },

        /**
         * Resizes the texture to have the new given width and height,
         * possibly discarding any contents.
         * @param {number} width The new width of the texture in pixels.
         * @param {number} height The new height of the texture in pixels.
         */
        resizeFast: function(width, height) {
            if(!Number.isInteger(width)) {
                throw new Error("The texture width must be an integer!");
            }
            if(!Number.isInteger(height)) {
                throw new Error("The texture height must be an integer!");
            }
            if(width === this._width && height === this._height) { return; }
            this._canvas.width = width;
            this._canvas.height = height;
            this._width = width;
            this._height = height;
            this.clear();
        },

        /**
         * Resizes the texture to have the new given width and height,
         * stretching or shrinking the image to fit.
         * If you do not care about the contents of the texture after resizing,
         * consider using `resizeFast` instead.
         * @param {number} width The new width of the texture in pixels.
         * @param {number} height The new height of the texture in pixels.
         */
        resize: function(width, height) {
            if(width === this._width && height === this._height) { return; }
            const old = this.clone();
            this.resizeFast(width, height);
            this._copyImageData(old._canvas);
        },

        /** 
         * @private 
         * Copies the image data from the given JS image or canvas onto this
         * image, stretching or shrinking the image to fit.
         */
        _copyImageData: function(img) {
            this._ctx.drawImage(img, 0, 0, this._width, this._height);
        },
        
        /**
         * Clones the data of this texture onto a new texture, creating a copy.
         * Rendering done on this texture does not apply to the returned copy.
         * @returns The copy.
         */
        clone: function() {
            const cloned = Texture(this._width, this._height);
            cloned._copyImageData(this);
            return cloned;
        },

        /**
         * Discards and clears any contents by overwriting all pixels with
         * transparent black.
         */
        clear: function() {
            this._ctx.clearRect(0, 0, this._width, this._height);
        }
    };
    texture._canvas = document.createElement("canvas");
    texture._ctx = texture._canvas.getContext("2d");
    texture.resizeFast(width, height);
    return texture;
}
