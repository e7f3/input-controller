

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
    controller.enable = false;
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

let start;

function loop(timestamp) {
    if (start === undefined) {
        start = timestamp;
    }

    const elapsed = timestamp - start;
    const shift = Math.min(0.1 * elapsed, 200);

    if (controller.isActionActive('moveLeft')) {
        testTarget.style.transform = `translateX${step}px`
    }

        requestAnimationFrame(loop);

}

requestAnimationFrame(loop);
