
const BACKGROUND_FLOOR = "level/background_floor.png";
const BACKGROUND_HOLE = "level/background_hole.png";
const YARN = "level/yarn.png";
const BOX = "level/box.png";
const RAT = dir => `level/rat_${dir}.png`;

const LEVEL_LENGTH = 32;
const SEGMENT_LENGTH = 4;
const BOX_POS_HEIGHT = 4;
const BOX_HEIGHT = 21/16;
const BOX_COLL_HEIGHT = 1;

let levelSegmentIsFloor;
let levelSegmentHasBox;
let rats;
let yarn = spawn(YARN, 2, -1);

function createLevelBackground() {
    levelSegmentIsFloor = [];
    for(let segmentI = 0; segmentI < LEVEL_LENGTH; segmentI += 1) {
        const isFloor = segmentI == 0
            || segmentI == (LEVEL_LENGTH - 1)
            || !levelSegmentIsFloor[segmentI - 1]
            || Math.random() < 0.66;
        levelSegmentIsFloor.push(isFloor);
        const bg = spawn(isFloor? BACKGROUND_FLOOR : BACKGROUND_HOLE, 24, -2);
        bg.x = (segmentI + 0.5) * SEGMENT_LENGTH;
        bg.y = -8;
    }
}

function createBoxes() {
    levelSegmentHasBox = [];
    for(let segmentI = 0; segmentI < LEVEL_LENGTH; segmentI += 1) {
        const hasBox = segmentI != 0
            && segmentI != (LEVEL_LENGTH - 1)
            && Math.random() < 0.2;
        levelSegmentHasBox.push(hasBox);
        if(!hasBox) { continue; }
        const box = spawn(BOX, BOX_HEIGHT, -1);
        box.x = (segmentI + 0.5) * SEGMENT_LENGTH;
        box.y = BOX_POS_HEIGHT;
    }
}

function createRats() {
    rats = [];
    const levelSegmentHasRat = [];
    for(let segmentI = 0; segmentI < LEVEL_LENGTH; segmentI += 1) {
        const prevHole = levelSegmentIsFloor
            .slice(0, segmentI)
            .findLastIndex(isFloor => !isFloor);
        const prevHasRat = levelSegmentHasRat
            .slice(prevHole + 1, segmentI)
            .some(hasRat => hasRat);
        const isFloor = levelSegmentIsFloor[segmentI];
        const createRat = isFloor && prevHole >= 0 && !prevHasRat;
        const hasRat = isFloor && prevHole >= 0 && (prevHasRat || createRat);
        levelSegmentHasRat.push(hasRat);
        if(!createRat) { continue; }
        const rat = spawn(RAT("left"), 1);
        rat.x = (segmentI + Math.random()) * SEGMENT_LENGTH;
        rat.y = 0.0;
        rats.push({ dir: "left", entity: rat, dead: false });
    }
}

function createLevel() {
    createLevelBackground();
    createBoxes();
    createRats();
    yarn.x = (LEVEL_LENGTH - 0.5) * SEGMENT_LENGTH;
    yarn.y = -0.25;
}

function levelCollides(x, y) {
    const inLevel = x > 0 && x < SEGMENT_LENGTH * LEVEL_LENGTH;
    const segmentI = inLevel? Math.floor(x / SEGMENT_LENGTH) : -1;
    const segmentHasFloor = inLevel && levelSegmentIsFloor[segmentI];
    const segmentHasBox = inLevel && levelSegmentHasBox[segmentI];
    return (segmentHasFloor && y < 0.0)
        || (segmentHasBox && y > BOX_POS_HEIGHT && y < BOX_POS_HEIGHT + BOX_COLL_HEIGHT);
}

const RAT_TOUCH_DIST = 0.5;

function touchesRat(x, y) {
    for(const rat of rats) {
        const distance = Math.hypot(x - rat.entity.x, y - rat.entity.y);
        if(distance <= RAT_TOUCH_DIST) { return true; }
    }
    return false;
}

const RAT_SPEED = 2.5;
const RAT_TURN_DIST = 0.5;
const RAT_DEATH_DIST_X = 1.0;
const RAT_DEATH_MIN_DIST_Y = 0.25;
const RAT_DEATH_MAX_DIST_Y = 1.00;

function updateRat(rat) {
    const stepX = (rat.dir == "left"? -1 : 1);
    if(!levelCollides(rat.entity.x + stepX * RAT_TURN_DIST, rat.entity.y - 0.5)) {
        rat.dir = (rat.dir == "left")? "right" : "left";
        rat.entity.sprite = RAT(rat.dir);
    } else {
        rat.entity.x += stepX * RAT_SPEED / 60;
    }
}

function killRats(x, y, velY) {
    if(velY >= 0.0) { return; }
    for(const rat of rats) {
        const horizDist = Math.abs(rat.entity.x - x);
        if(horizDist > RAT_DEATH_DIST_X) { continue; }
        if(y < rat.entity.y + RAT_DEATH_MIN_DIST_Y) { continue; }
        if(y > rat.entity.y + RAT_DEATH_MAX_DIST_Y) { continue; }
        rat.dead = true;
        destroy(rat.entity);
    }
    rats = rats.filter(rat => !rat.dead);
}

function updateLevel() {
    rats.forEach(updateRat);
}