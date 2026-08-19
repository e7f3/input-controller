

const testTarget = document.querySelector('.test-dom-element');
const attachButton = document.querySelector('.button--attach');
const detachButton = document.querySelector('.button--detach');
const enableButton = document.querySelector('.button--enable');
const disableButton = document.querySelector('.button--disable');
const bindJumpButton = document.querySelector('.button--bind-jump');
const connectKeysButton = document.querySelector('.button--connect-keys');
const connectMouseButton = document.querySelector('.button--connect-mouse');

const logs = document.querySelector('.logs');

const controller = new InputController();
controller.bindActions({
    'moveLeft': {
        enabled: true,
        keys: [65, 37]
    },
    'moveRight': {
        enabled: true,
        keys: [39, 68]
    },
    'moveUp': {
        enabled: true,
        mouse: [0]
    },
    'moveDown': {
        enabled: true,
        mouse: [2]
    }
});

function writeLog(text) {
    const div = document.createElement('div');
    const logText = `${new Date().toLocaleTimeString()} : ${text}`;
    div.textContent = logText;
    logs.appendChild(div);
    logs.scrollTop = logs.scrollHeight;
}

function enableController() {
    controller.enabled = true;
    writeLog('Controller enabled!');
}

function disableController() {
    controller.enabled = false;
    writeLog('Controller disabled!');
}

function attachTarget() {
    controller.attach(testTarget);
    writeLog('Target attached!');
}

function detachTarget() {
    controller.detach();
    writeLog('Target detached!');
}

function bindJump() {
    controller.bindActions({
        'jump': {
            enabled: true,
            keys: [32]
        }
    });
    writeLog('Action binded!');
}

function connectKeys() {
    controller.connectPlugins([
        new KeyboardPlugin()
    ]);
    writeLog('Keyboard plugin connected!');
}

function connectMouse() {
    controller.connectPlugins([
        new MousePlugin()
    ]);
    writeLog('Mouse plugin connected!');
}

attachButton.onclick = attachTarget;
detachButton.onclick = detachTarget;
enableButton.onclick = enableController;
disableButton.onclick = disableController;
bindJumpButton.onclick = bindJump;
connectKeysButton.onclick = connectKeys;
connectMouseButton.onclick = connectMouse;

function logCustomEvents(customEvent) {
    writeLog(`${customEvent.detail} => ${customEvent.type}`);
}

testTarget.addEventListener(controller.ACTION_ACTIVATED, logCustomEvents);
testTarget.addEventListener(controller.ACTION_DEACTIVATED, logCustomEvents);

let startTime;
let xCoord = 0;
let yCoord = 0;
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

    if (controller.isActionActive('moveUp')) {
        yCoord -= SPEED * timeChange;
    }

    if (controller.isActionActive('moveDown')) {
        yCoord += SPEED * timeChange;
    }

    testTarget.style.transform = `translateX(${xCoord}px) translateY(${yCoord}px)`;

    if (controller.isActionActive('jump')) {
        testTarget.classList.add('painted');
    } else {
        testTarget.classList.remove('painted');
    }

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
