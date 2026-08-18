

const testTarget = document.querySelector('.test-dom-element');
const attachButton = document.querySelector('.button--attach');
const detachButton = document.querySelector('.button--detach');
const enableButton = document.querySelector('.button--enable');
const disableButton = document.querySelector('.button--disable');
const bindJumpButton = document.querySelector('.button--bind-jump');
const eventLogs = document.querySelector('.event-logs');

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

function logCustomEvents(customEvent) {
    const div = document.createElement('div');
    const text = `${new Date().toLocaleTimeString()} : ${customEvent.detail} => ${customEvent.type}`;
    div.textContent = text;
    eventLogs.appendChild(div);
}

testTarget.addEventListener(controller.ACTION_ACTIVATED, logCustomEvents);
testTarget.addEventListener(controller.ACTION_DEACTIVATED, logCustomEvents);

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
