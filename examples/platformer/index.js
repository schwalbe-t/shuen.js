
createLevel();
resetCat();

function update() {
    moveCat();
    animateCat();
    lookAtCat();
    updateLevel();
    if(killCat()) { onDeath(); }
}

function onDeath() {
    resetCat();
}