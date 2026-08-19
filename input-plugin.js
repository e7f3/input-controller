/**
 * Универсальный класс плагина для устройства ввода
 */
class InputPlugin {
    // Тип устройства ввода
    type = 'input';
    // Экземпляр контроллера
    controller;
    // DOM элемент для привязки слушателей событий
    #target;
    // Список нажатых клавиш, кнопок etc.
    pressed = new Set();

    /**
     * Инициализирует плагин
     * @param {object} controller - Инстанс контроллера
     */
    init(controller) {
        this.controller = controller;
    }

    /**
     * Прикрепляет DOM элемент
     * @param {object} target - DOM элемент
     */
    attach(target) {
        if (this.#target) {
            this.detach();
        }

        this.#target = target;
    }

    /**
     * Открепляет DOM элемент и очищает список нажатых кнопок, клавиш и т.д.
     */
    detach() {
        this.#target = null;
        this.pressed.clear();
    }

    /**
     * Добавляет кнопку/клавишу в список нажатых
     * @param {number} id - уникальный идентификатор клавиши/кнопки и тд.
     */
    press(id) {
        if (this.pressed.has(id)) {
            return;
        }

        this.pressed.add(id);
        this.#notifyController(id);
    }

    /**
     * Удаляет кнопку/клавишу из списка нажатых
     * @param {number} id - уникальный идентификатор клавиши/кнопки и тд.
     */
    release(id) {
        this.pressed.delete(id);
        this.#notifyController(id);
    }

    /**
     * Проверяет соответствующие плагину кнопки/клавиши для заданой активности на нажатие
     * @param {object} action - объект конфигурации активности
     * @returns {boolean}
     */
    isActionActive(action) {
        const ids = this.getIdsFromAction(action);
        return ids.some(id => this.pressed.has(id));
    }

    /**
     * Хелпер для получения списка id кнопок/клавиш для данного плагина
     * @param {object} action - конфиг активности
     * @returns {Array<number|string>}
     */
    getIdsFromAction(action) {
        return action[this.type] ?? [];
    }

    /**
     * Уведомляет контроллер о случившемся нажатии кнопки/клавиши и обновляет связанную активность
     * @param {number} id - уникальный идентификатор клавиши/кнопки и тд.
     */
    #notifyController(id) {
        const actionName = this.controller.getActionName(this.type, id);

        if (actionName) {
            this.controller.refreshAction(actionName);
        }
    }
}