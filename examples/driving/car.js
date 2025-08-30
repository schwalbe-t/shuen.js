
const CAR_ANGLE_SPRITES = [
    "car/right.png",
    "car/top_right.png",
    "car/top.png",
    "car/top_left.png",
    "car/left.png",
    "car/bottom_left.png",
    "car/bottom.png",
    "car/bottom_right.png"
];

const CAR_TURN_MIN_SPEED = 1.0;
const CAR_TURN_SPEED = Math.PI; // 180 deg per second
const CAR_ACCEL = 7.5;
const CAR_FRICTION = 0.5;
const CAR_DECEL = 20.0;
const CAR_TOP_SPEED = 20.0;
const CAR_TOP_SPEED_REV = -5.0;

const MIN_CAM_DIST = 15.0;
const MAX_CAM_DIST = 20.0;

const car = spawn(CAR_ANGLE_SPRITES[0], 2);
let carAngle = 0;
let carSpeed = 0.0;

function updateCar() {
    if(isPressed("left") && carSpeed > +CAR_TURN_MIN_SPEED) { carAngle += CAR_TURN_SPEED / 60.0; }
    if(isPressed("left") && carSpeed < -CAR_TURN_MIN_SPEED) { carAngle -= CAR_TURN_SPEED / 60.0; }
    if(isPressed("right") && carSpeed > +CAR_TURN_MIN_SPEED) { carAngle -= CAR_TURN_SPEED / 60.0; }
    if(isPressed("right") && carSpeed < -CAR_TURN_MIN_SPEED) { carAngle += CAR_TURN_SPEED / 60.0; }
    if(isPressed("up")) { carSpeed += CAR_ACCEL / 60.0; }
    else if(isPressed("down")) { carSpeed -= CAR_DECEL / 60.0; }
    else if(carSpeed > 0.001) { carSpeed -= CAR_FRICTION / 60.0; }
    else if(carSpeed < 0.001) { carSpeed += CAR_FRICTION / 60.0; }
    else { carSpeed = 0.0; }
    carSpeed = Math.min(Math.max(carSpeed, CAR_TOP_SPEED_REV), CAR_TOP_SPEED);
    const angleI = Math.round(
        ((carAngle / (Math.PI * 2) % 1) + 1) % 1 * CAR_ANGLE_SPRITES.length
    ) % CAR_ANGLE_SPRITES.length;
    console.log(angleI);
    car.x += Math.cos(carAngle) * carSpeed / 60.0;
    car.y += Math.sin(carAngle) * carSpeed / 60.0;
    car.sprite = CAR_ANGLE_SPRITES[angleI];
}

function lookAtCar() {
    const dist = Math.abs(carSpeed) / CAR_TOP_SPEED 
        * (MAX_CAM_DIST - MIN_CAM_DIST)
        + MIN_CAM_DIST;
    lookAt(car.x, car.y, dist);
}