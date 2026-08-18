

const testTarget = document.querySelector('.test-dom-element');
const attachButton = document.querySelector('.button--attach');
const detachButton = document.querySelector('.button--detach');
const enableButton = document.querySelector('.button--enable');
const disableButton = document.querySelector('.button--disable');
const bindJumpButton = document.querySelector('.button--bind-jump');
const info = document.querySelector('.info-container');

const controller = new InputController();
controller.bindActions({
    'moveLeft': {
        enabled: true,
        keys: [65, 37]
    },
    'moveRight': {
        enabled: true,
        keys: [39, 68]
    }
});

function enableController() {
    controller.enabled = true;
}

function disableController() {
    controller.enabled = false;
}

function attachTarget() {
    controller.attach(testTarget);
}

function detachTarget() {
    controller.detach();
}

function bindJump() {
    controller.bindActions({
        'jump': {
            enabled: true,
            keys: [32]
        }
    })
}

attachButton.onclick = attachTarget;
detachButton.onclick = detachTarget;
enableButton.onclick = enableController;
disableButton.onclick = disableController;
bindJumpButton.onclick = bindJump;

let startTime;
let xCoord = 0;
let SPEED = 0.03;

function loop(timestamp) {
    if (startTime === undefined) {
        startTime = timestamp;
    }

    const timeChange = timestamp - startTime;
    startTime = timestamp;

    if (controller.isActionActive('moveLeft')) {
        xCoord -= SPEED * timeChange;
    }

    if (controller.isActionActive('moveRight')) {
        xCoord += SPEED * timeChange;
    }

    testTarget.style.transform = `translateX(${xCoord}px)`;

    if (controller.isActionActive('jump')) {
        testTarget.classList.add('painted');
    } else {
        testTarget.classList.remove('painted');
    }

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
