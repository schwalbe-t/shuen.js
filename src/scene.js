
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