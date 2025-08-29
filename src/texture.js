
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
