
const CAT_IDLE = dir => `cat/idle_${dir}.png`;
const CAT_JUMP = dir => `cat/jump_${dir}.png`;
const CAT_RUN = (dir, frame) => `cat/run_${dir}_${frame + 1}.png`;
const CAT_RUN_FRAMES = 2;
const CAT_RUN_FPS = 6;

const GRAVITY = 50.0;
const CAT_RUN_SPEED = 10.0;
const CAT_JUMP_SPEED = 25.0;

let catVelX;
let catVelY;
let catDir;
let catRunTimer;
const cat = spawn(CAT_IDLE("right"), 1);

function resetCat() {
    catVelX = 0.0;
    catVelY = 0.0;
    catDir = "right";
    catRunTimer = 0;
    cat.x = 2.0;
    cat.y = 0.0;
}

function moveCat() {
    if(isPressed("left")) { catVelX = -CAT_RUN_SPEED; } 
    else if(isPressed("right")) { catVelX = CAT_RUN_SPEED; } 
    else { catVelX = 0; }
    catVelY -= GRAVITY / 60;
    const newX = cat.x + catVelX / 60;
    const newY = cat.y + catVelY / 60;
    if(catVelX > 0 && levelCollides(newX + 0.5, cat.y)) { catVelX = 0; }
    if(catVelX < 0 && levelCollides(newX - 0.5, cat.y)) { catVelX = 0; }
    if(catVelY > 0 && levelCollides(cat.x, newY + 1.0)) { catVelY = 0; }
    if(catVelY < 0 && levelCollides(cat.x, newY + 0.0)) { catVelY = 0; }
    cat.x += catVelX / 60;
    cat.y += catVelY / 60;
    if(catVelY == 0 && isPressed("space")) {
        catVelY += CAT_JUMP_SPEED;
    }
    killRats(cat.x, cat.y, catVelY);
}

function animateCat() {
    if(catVelX > 0) { catDir = "right"; }
    if(catVelX < 0) { catDir = "left"; }
    if(catVelY != 0) {
        cat.sprite = CAT_JUMP(catDir);
        catRunTimer = 0;
    } else if(catVelX != 0) {
        cat.sprite = CAT_RUN(catDir, Math.floor(catRunTimer * CAT_RUN_FPS));
        catRunTimer += 1 / 60;
        catRunTimer = catRunTimer % (CAT_RUN_FRAMES / CAT_RUN_FPS);
    } else {
        cat.sprite = CAT_IDLE(catDir);
        catRunTimer = 0;
    }
}

function lookAtCat() {
    lookAt(cat.x, 2.5, 15);
}

const DEATH_BELOW_Y = -5.0;

function killCat() {
    return touchesRat(cat.x, cat.y)
        || cat.y < DEATH_BELOW_Y;
}