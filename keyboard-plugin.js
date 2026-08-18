/**
 * Класс плагина клавиатуры для работы с InputController
 * @extends InputPlugin
 */
class KeyboardPlugin extends InputPlugin {
    type = 'keys';
    #parentDocument;

    /**
     * Обработчик для события keydown
     * @param {object} event - объект Keyboard Event
     */
    #onKeyDown(event) {
        if (event.keyCode) {
            this.press(event.keyCode);
        }
    }

    /**
     * Обработчик для события keyup
     * @param {object} event - объект Keyboard Event
     */
    #onKeyUp(event) {
        if (event.keyCode) {
            this.release(event.keyCode);
        }
    }

    /**
     * Вешает слушатели событий на родительский документ переданного DOM элемента
     * @param {object} target - DOM элемент 
     */
    attach(target) {
        if (this.target) {
            this.detach();
        }

        this.#parentDocument = target?.ownerDocument;
        super.attach(target);

        if (this.#parentDocument) {
            this.#parentDocument.addEventListener('keydown', this.#onKeyDown);
            this.#parentDocument.addEventListener('keyup', this.#onKeyUp);
        }
    }

    /**
     * Удаляет слушатели событий при наличии
     */
    detach() {
        if (this.#parentDocument) {
            this.#parentDocument.removeEventListener('keydown', this.#onKeyDown);
            this.#parentDocument.removeEventListener('keyup', this.#onKeyUp);
        }

        this.#parentDocument = null;
        super.detach();
    }
}