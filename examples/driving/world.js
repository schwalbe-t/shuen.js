
const TILE_VARIANTS = [
    {
        sprite: "tiles/straight_horiz.png", 
        connects: ["left", "right"],
        decoAreas: [
            { x: 0, y:  0, w: 16, h: 2 },
            { x: 0, y: 11, w: 16, h: 5 }
        ]
    },
    {
        sprite: "tiles/straight_vert.png",
        connects: ["top", "bottom"],
        decoAreas: [
            { x:  0, y: 0, w: 5, h: 16 },
            { x: 11, y: 0, w: 5, h: 16 }
        ]
    },
    { 
        sprite: "tiles/curve_top_left.png", 
        connects: ["top", "left"],
        decoAreas: [
            { x:  0, y: 0, w: 16, h:  2 },
            { x: 11, y: 2, w:  5, h: 14 }
        ]
    },
    { 
        sprite: "tiles/curve_top_right.png", 
        connects: ["top", "right"],
        decoAreas: [
            { x: 0, y: 0, w: 16, h:  2 },
            { x: 0, y: 2, w:  5, h: 14 }
        ]
    },
    { 
        sprite: "tiles/curve_bottom_left.png", 
        connects: ["bottom", "left"],
        decoAreas: [
            { x:  0, y: 11, w: 16, h:  5 },
            { x: 11, y:  0, w:  5, h: 11 }
        ]
    },
    { 
        sprite: "tiles/curve_bottom_right.png", 
        connects: ["bottom", "right"],
        decoAreas: [
            { x: 0, y: 11, w: 16, h:  5 },
            { x: 0, y:  0, w:  5, h: 11 }
        ]
    },
    { 
        sprite: "tiles/three_way_top.png", 
        connects: ["left", "top", "right"],
        decoAreas: [
            { x: 0, y: 0, w: 16, h: 2 }
        ]
    },
    { 
        sprite: "tiles/three_way_right.png", 
        connects: ["top", "right", "bottom"],
        decoAreas: [
            { x: 0, y: 0, w: 5, h: 16 }
        ]
    },
    { 
        sprite: "tiles/three_way_bottom.png", 
        connects: ["right", "bottom", "left"],
        decoAreas: [
            { x: 0, y: 11, w: 16, h: 5 }
        ]
    },
    {
        sprite: "tiles/three_way_left.png", 
        connects: ["bottom", "left", "top"],
        decoAreas: [
            { x: 11, y: 0, w: 5, h: 16 }
        ]
    },
    {
        sprite: "tiles/four_way.png",
        connects: ["top", "bottom", "left", "right"],
        decoAreas: [
            { x:  0, y:  0, w: 5, h: 2 },
            { x: 11, y:  0, w: 5, h: 2 },
            { x:  0, y: 11, w: 5, h: 5 },
            { x: 11, y: 11, w: 5, h: 5 }
        ]
    },
    {
        sprite: "tiles/stub_top.png",
        connects: ["top"],
        decoAreas: [
            { x:  0, y: 0, w: 16, h:  5 },
            { x:  0, y: 5, w:  5, h: 11 },
            { x: 11, y: 5, w:  5, h: 11 }
        ]
    },
    {
        sprite: "tiles/stub_left.png",
        connects: ["left"],
        decoAreas: [
            { x: 0, y:  0, w: 16, h: 2 },
            { x: 8, y:  2, w:  8, h: 9 },
            { x: 0, y: 11, w: 16, h: 5 }
        ]
    },
    {
        sprite: "tiles/stub_bottom.png",
        connects: ["bottom"],
        decoAreas: [
            { x:  0, y: 8, w: 16, h: 8 },
            { x:  0, y: 0, w:  5, h: 8 },
            { x: 11, y: 0, w:  5, h: 8 }
        ]
    },
    {
        sprite: "tiles/stub_right.png",
        connects: ["right"],
        decoAreas: [
            { x: 0, y:  0, w: 16, h: 2 },
            { x: 0, y:  2, w:  8, h: 9 },
            { x: 0, y: 11, w: 16, h: 5 }
        ]
    },
    {
        sprite: "tiles/empty.png",
        connects: [],
        decoAreas: [
            { x: 0, y: 0, w: 16, h: 16 }
        ]
    }
];

const WORLD_SIZE_TILES = 16;
const TILE_SIZE = 16;

function generateWorld() {
    const state = new Array(WORLD_SIZE_TILES * WORLD_SIZE_TILES)
        .fill(undefined);
    const variantAllowedAt = (variantI, x, y) => {
        const variant = TILE_VARIANTS[variantI];
        const allowedBy = (ox, oy, selfDir, checkedDir) => {
            const cx = x + ox;
            const cy = y + oy;
            const cInBounds = cx >= 0 && cx < WORLD_SIZE_TILES
                && cy >= 0 && cy < WORLD_SIZE_TILES;
            const cGenerated = cInBounds 
                && state[cx + cy * TILE_SIZE] !== undefined;
            const selfConnects = variant.connects.includes(selfDir);
            if(cInBounds && !cGenerated) { return true; }
            const cConnects = cInBounds
                && TILE_VARIANTS[state[cx + cy * TILE_SIZE]].connects.includes(checkedDir);
            return selfConnects === cConnects;
        };
        return allowedBy(-1,  0, "left", "right") 
            && allowedBy(+1,  0, "right", "left")
            && allowedBy( 0, -1, "bottom", "top") 
            && allowedBy( 0, +1, "top", "bottom");
    };
    for(let x = 0; x < WORLD_SIZE_TILES; x += 1) {
        for(let y = 0; y < WORLD_SIZE_TILES; y += 1) {
            const allowed = [...TILE_VARIANTS.keys()]
                .filter(v => variantAllowedAt(v, x, y));
            const allowedI = Math.floor(Math.random() * allowed.length);
            const variantI = allowed[allowedI];
            state[x + y * TILE_SIZE] = variantI;
            const variant = TILE_VARIANTS[variantI];
            const tile = spawn(variant.sprite, TILE_SIZE, -1);
            tile.x = (x + 0.5) * TILE_SIZE;
            tile.y = y * TILE_SIZE;
            generateDecoration(x, y, variant);
        }
    }
}


const DECORATION_VARIANTS = [
    { sprite: "deco/tree.png", size: 4, weight: 50 },
    { sprite: "deco/house_orange.png", size: 7, weight: 1 },
    { sprite: "deco/house_purple.png", size: 7, weight: 1 },
    { sprite: "deco/house_green.png", size: 7, weight: 1 }
];
const DECO_WEIGHT_SUM = DECORATION_VARIANTS
    .map(v => v.weight)
    .reduce((a, b) => a + b);

const DECO_SPAWNS_PER_SQU = 1 / 20;

function findDecorationVariant(weight) {
    let w = weight;
    for(const variant of DECORATION_VARIANTS) {
        if(w < variant.weight) { return variant; }
        w -= variant.weight;
    }
    return null;
}

function generateDecoration(tileX, tileY, tileVariant) {
    for(const decoArea of tileVariant.decoAreas) {
        const spawnC = decoArea.w * decoArea.h * DECO_SPAWNS_PER_SQU;
        for(let spawnI = 0; spawnI < spawnC; spawnI += 1) {
            const w = Math.random() * DECO_WEIGHT_SUM;
            const variant = findDecorationVariant(w);
            const deco = spawn(variant.sprite, variant.size);
            const rangeX = decoArea.w - variant.size;
            const rangeY = decoArea.h - variant.size;
            deco.x = tileX * TILE_SIZE + decoArea.x
                + Math.random() * rangeX 
                + variant.size / 2;
            deco.y = tileY * TILE_SIZE + decoArea.y
                + Math.random() * rangeY
                + variant.size / 2;
        }
    }
}