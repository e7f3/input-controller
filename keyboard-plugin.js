/**
 * Класс плагина клавиатуры для работы с InputController
 * @extends InputPlugin
 */
class KeyboardPlugin extends InputPlugin {
    type = 'keys';
    #parentDocument;

    /**
     * Инициализирует InputPlugin и биндит обработчики классов
     * @param {InputController} controller - экземпляр класса InputController
     */
    init(controller) {
        super.init(controller);
        this.#bindedOnKeyDown = this.#onKeyDown.bind(this);
        this.#bindedOnKeyUp = this.#onKeyUp.bind(this);
    }

    /**
     * Обработчик для события keydown
     * @param {object} event - объект KeyboardEvent
     */
    #onKeyDown(event) {
        if (event.keyCode) {
            this.press(event.keyCode);
        }
    }

    /**
     * Обработчик для события keyup
     * @param {object} event - объект KeyboardEvent
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

        this.#parentDocument = target?.ownerDocument ?? null;
        super.attach(target);

        if (this.#parentDocument) {
            this.#parentDocument.addEventListener('keydown', this.#bindedOnKeyDown);
            this.#parentDocument.addEventListener('keyup', this.#bindedOnKeyUp);
        }
    }

    /**
     * Удаляет слушатели событий при наличии
     */
    detach() {
        if (this.#parentDocument) {
            this.#parentDocument.removeEventListener('keydown', this.#bindedOnKeyDown);
            this.#parentDocument.removeEventListener('keyup', this.#bindedOnKeyUp);
        }

        this.#parentDocument = null;
        super.detach();
    }

    // Обработчики событий с привязкой this
    #bindedOnKeyDown;
    #bindedOnKeyUp;
}