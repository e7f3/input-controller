/**
 * Класс плагина мыши для работы с InputController
 * @extends InputPlugin
 */
class MousePlugin extends InputPlugin {
    type = 'mouse';
    #parentDocument;

    /**
     * Инициализирует InputPlugin и биндит обработчики классов
     * @param {InputController} controller - экземпляр класса InputController
     */
    init(controller) {
        super.init(controller);
        this.#bindedOnMouseDown = this.#onMouseDown.bind(this);
        this.#bindedOnMouseUp = this.#onMouseUp.bind(this);
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
            this.#parentDocument.addEventListener('mousedown', this.#bindedOnMouseDown);
            this.#parentDocument.addEventListener('mouseup', this.#bindedOnMouseUp);
        }
    }

    /**
     * Удаляет слушатели событий при наличии
     */
    detach() {
        if (this.#parentDocument) {
            this.#parentDocument.removeEventListener('mousedown', this.#bindedOnMouseDown);
            this.#parentDocument.removeEventListener('mouseup', this.#bindedOnMouseUp);
        }

        this.#parentDocument = null;
        super.detach();
    }

    /**
     * Обработчик для события mousedown
     * @param {object} event - объект MouseEvent
     */
    #onMouseDown(event) {
        if (event.button) {
            this.press(event.button);
        }
    }

    /**
     * Обработчик для события mouseup
     * @param {object} event - объект MouseEvent
     */
    #onMouseUp(event) {
        if (event.button) {
            this.press(event.button);
        }
    }

    // Обработчики событий с привязкой this
    #bindedOnMouseDown;
    #bindedOnMouseUp;
}