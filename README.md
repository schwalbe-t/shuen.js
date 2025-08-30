# shuen.js
A Javascript game library with the goal of having the simplest API possible.

# Concepts

### The Game World

The game world is a simple cartesian 2D coordinate system where the X axis
goes from the left (negative X) towards the right (positive X) of the screen,
and where the Y axis goes from the bottom (negative Y) towards the top (positive Y) of the screen. 

It consists of "units", which is the distance that two points
in the game world are apart if they differ by a value of 1 on the X or Y axis.
This unit is freely defined and differs from game to game. If you decide that
the main character in your game is one unit tall, then a tree that is four times
as large as the player needs to be four units tall, and so on. The camera of the scene can be configured to have an arbitrary "distance" (how large the area visible to the camera actually is in world units).

### Entities

An entity is any single visible object in your game world, be that a tree, house, cat or the player. They all have a position, size and image.

### Camera

The camera is a description of the area of the world visible to the player. It has a position, which is the location in the world that is at the center of the area visible to the player. In addition it also has a distance, which is the height of the area in game units - a distance of 2 means that only 2 units of length fit into the area height, while a distance of 200 means that the player can see 200 game units of the world across the height of their screen.

### Scenes

Scenes contain a collection of entities together with a camera. 

For example when you enter a new level in a platformer game, you would enter a new scene with a new level structure, new enemies and new powerups. Another example would be a game like the old Zelda games or Animal Crossing, where entering a house means entering a new scene where the outside world doesn't exist. However, exiting the
house means that you return to the previous scene - the outside world.

For this you would use *the main scene*, which is the scene currently visible to
the player on screen. It can be changed out for a new scene using the global `replaceMainScene`-function.

Additionally scenes can be used to render things off-screen; simply don't set them as the main scene and use their `render`-method. The resulting image can then be used as the image for an entity in another scene.

# Functions

### `replaceMainScene(scene)`

Replaces the current main scene with the given scene. Calls to the global 
`spawn`, `destroy` and `lookAt` functions will then affect the given scene 
instead. Note that if `spawn` was previously used, `destroy` must be still 
used on *the old scene* to actually destroy the entity.

Parameters:
- `scene` - The new main scene.

### `spawn(sprite, size, layer)`

Creates a new entity with the given sprite, size and layer.
Entities with higher layers are rendered on top of those with lower
layers, and inside the same layer entities with a lower Y coordinate
are rendered on top of those with a higher Y coordinate.
The entity will exist until it is explicitly destroyed
using the `destroy`-function.

Parameters:
- `sprite` - The image to use for the entity. This may be a string URL or a texture object.
- *(optional)* `size` - The height of the displayed image in world units. This must be a number. (default: `1.0`)
- *(optional)* `layer` - An integer describing the layer of the entity. This must be an integer. (default: `0`)

Returns:
A reference to the new entity.

### `destroy(entity)`

Removes the given entity.
Destroying an entity that has already been destroyed has no effect.

Parameters:
- `entity` - The entity to remove.

### `lookAt(x, y, dist)`

Centers the camera on the given position in the world.

Parameters:
- `x` - The X-coordinate of the position to center. This must be a number.
- `y` - The Y-coordinate of the position to center. This must be a number.
- *(optional)* `dist` - The height of the area visible by the camera in world units. (default: `20.0`)

### `isPressed(key)`

Returns if the given keyboard key is pressed.
The key name can be one of (case-insensitive):
- `"esc"`, `"escape"`
- `"0"`, `"1"`, `"2"`, `"3"`, `"4"`, `"5"`, `"6"`, `"7"`, `"8"`, `"9"`,
- `"-"`, `"minus"`
- `"="`, `"equal"`
- `"backspace"`
- `"tab"`
- `"a"`, `"b"`, `"c"`, `"d"`, ..., `"w"`, `"x"`, `"y"`, `"z"`
- `"["`, `"bracketleft"`, `"leftbracket"`, `"bracketopen"`
- `"]"`, `"bracketright"`, `"rightbracket"`, `"bracketclose"`
- `"enter"`
- `"ctrl"`, `"ctrlleft"`, `"leftctrl"`
- `";"`, `"semicolon"`
- `'"'`, `"quote"`
- `"backquote"`
- `"shift"`, `"shiftleft"`, `"leftshift"`
- `"\\"`, `"backslash"`
- `","`, `"comma"`
- `"."`, `"dot"`, `"period"`
- `"/"`, `"slash"`
- `"shiftright"`, `"rightshift"`
- `"alt"`, `"altleft"`, `"leftalt"`
- `" "`, `"space"`
- `"caps"`, `"capslock"`
- `"f1"`, `"f2"`, `"f3"`, ..., `"f10"`, `"f11"`, `"f12"`
- `"up"`, `"uparrow"`, `"arrowup"`
- `"down"`, `"downarrow"`, `"arrowdown"`
- `"left"`, `"leftarrow"`, `"arrowleft"`
- `"right"`, `"rightarrow"`, `"arrowright"`

Parameters:
- `key` - The name of the key to check. Must be one of the above strings.

Returns: True if the key is pressed at the time of calling, and otherwise false.

### `isClicked(button)`

Returns if the given mouse button is clicked.
The button name can be one of (case-insensitive):
- `"left"`
- `"middle"`, `"wheel"`
- `"right"`

Parameters:
- `button` - The name of the button to check. Must be one of the above strings.

Returns: True if the button is clicked at the time of calling, and otherwise false.

# Types

## `Texture`

### `Texture(width, height)`

Creates a new, empty texture with the given pixel dimensions.

Parameters:
- `width` - The initial width of the texture in pixels. This must be a positive integer.
- `height` - The initial height of the texture in pixels. This must be a positive integer.

Returns: The new texture.

### `.width()`

Returns: The width of the texture in pixels.

### `.height()`

Returns: The height of the texture in pixels.

### `.resizeFast(width, height)`

Resizes the texture to have the new given width and height,
possibly discarding any contents.

Parameters:
- `width` - The new width of the texture in pixels. This must be a positive integer.
- `height` - The new height of the texture in pixels. This must be a positive integer.

### `.resize(width, height)`

Resizes the texture to have the new given width and height,
stretching or shrinking the image to fit.
If you do not care about the contents of the texture after resizing,
consider using `resizeFast` instead.

Parameters:
- `width` - The new width of the texture in pixels. This must be a positive integer.
- `height` - The new height of the texture in pixels. This must be a positive integer.

### `.clone()`

Clones the data of this texture onto a new texture, creating a copy.
Rendering done on this texture does not apply to the returned copy.

Returns: The copy.

### `.clear()`

Discards and clears any contents by overwriting all pixels with transparent black.

## `Entity`

### `.x`

The position of the entity along the X axis in world units. Must be a number.

### `.y`

The position of the entity along the Y axis in world units. Must be a number.

### `.sprite`

The image to use when rendering the entity. Must be a string image URL (such as `"kitty.png"`) or `Texture`-object.

### `.size`

The height of the entity sprite in the game world in game units. Must be a number.

### `.layer`

The layer of the entity. When on the same layer, entities are rendered in order of descending Y coordinate - this means that entities with a lower Y coordinate are seen as being "on top of" or "in front of" those with a higher Y coordinate. However, entities with a higher layer are always rendered as being "on top of" or "in front of" those with a lower layer value, so background entities can use a negative layer value to be behind the default layer value of `0`. Must be an integer.

## `Scene`

### `Scene(width, height)`

Creates a new, empty scene which is rendered onto a texture with the given pixel dimensions.

Parameters:
- `width` - The width of the render output texture in pixels. Must be a positive integer.
- `height` - The height of the render output texture in pixels. Must be a positive integer.

Returns: The new scene.

### `.width`

The width of the render output texture in pixels. Must be a positive integer.

### `.height`

The height of the render output texture in pixels. Must be a positive integer.

### `.spawn(sprite, size, layer)`

Creates a new entity with the given sprite, size and layer in the scene.
Entities with higher layers are rendered on top of those with lower layers, and inside the same layer entities with a lower Y coordinate are rendered on top of those with a higher Y coordinate. The entity will exist in this scene until it is explicitly destroyed using the `destroy`-method.

Parameters:
- `sprite` - The image to use for the entity. This may be a string URL or a texture object.
- *(optional)* `size` - The height of the displayed image in world units. This must be a number. (default: `1.0`)
- *(optional)* `layer` - An integer describing the layer of the entity. This must be an integer. (default: `0`)

### `.destroy(entity)`

Removes the given entity from the scene.
Destroying an entity that is not part of the scene has no effect.

Parameters:
- `entity` - The entity to remove.

### `.lookAt(x, y, dist)`

Centers the camera on the given position in the world.

Parameters:
- `x` - The X-coordinate of the position to center. This must be a number.
- `y` - The Y-coordinate of the position to center. This must be a number.
- *(optional)* `dist` - The height of the area visible by the camera in world units. (default: `20.0`) 

### `.entities()`

Returns a shallow copy of all entities present in the scene at the time of calling.
The order or amount of the entities present in the array may change freely between invocations.

Returns: A list of all entities present in the scene.

### `.render()`

Renders the scene onto the output texture.
Calling this method repeatedly shall render onto the same texture, which can be cloned at any time using the Texture's `clone`-method.

Returns: The output texture of the scene containing the new render.

# Building

A singular Javascript file that may be imported by library users can be built
by running `build.js` using Node. This will output a self-contained `shuen.js` file.