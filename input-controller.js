/**
 * Класс контроллера для преобразования сигналов устройств ввода в стандартизированый формат.
 */
export class InputController {
    // Флаг включения/отключения генерации событий
    enabled = false;
    // Флаг нахождения окна с целевым DOM элементом в фокусе
    focused = false;
    // Имя события активации активности
    ACTION_ACTIVATED = 'input-controller:action-activated';
    // Имя события деактивации активности
    ACTION_DEACTIVATED = 'input-controller:action-deactivated';

    /**
     * Map с ключами actionName (имя активности) и объектом вида
     * {
     *      keys: new Set(),
     *      enabled: false,
     *      active: false,
     * }
     * в качестве значений
     **/
    #actionsMap = new Map();
    // Set с keyCode (код клавиши) нажатых клавиш 
    #pressedKeys = new Set();
    // Прикрепленный DOM элемент
    #target;

    /**
     * @param {object} [actionsToBind] - необязательный аргумент. Объект со списком активностей вида 
     * { 
     *  "actionName": {
     *      "keys": [],
     *      "enabled": true,
     *  }
     * }
     * @param {object} [target] - необязательный аргумент. DOM элемент для прослушивания событий клавиатуры и диспатча кастомных событий
     */
    constructor(actionsToBind, target) {
        if (actionsToBind && typeof actionsToBind === 'object') {
            this.bindActions(actionsToBind);
        }

        if (target && typeof target === 'object') {
            this.#target = target;
        }
    }
    /**
     * Добавляет в контроллер переданные активности
     * @param {object} actionsToBind - Объект со списком активностей вида 
     * { 
     *  "actionName": {
     *      "keys": [],
     *      "enabled": true,
     *  }
     * }
     */
    bindActions(actionsToBind) {
        for (let actionName in actionsToBind) {
            if (!this.#actionsMap.has(actionName)) {
                const keys = actionsToBind[actionName]?.keys;
                const enabled = actionsToBind[actionName]?.enabled

                this.#actionsMap.set(
                    actionName,
                    {
                        keys: keys || [],
                        enabled: enabled || false,
                        active: false
                    }
                );
            }

        }
    }

    /**
     * Включает объявленную активность (включает генерацию событий при изменении статуса)
     * @param {string} actionName - имя активности
     */
    enableAction(actionName) {
        if (this.#actionsMap.has(actionName)) {
            const action = this.#actionsMap.get(actionName);
            this.#actionsMap.set(
                actionName,
                {
                    ...action,
                    enabled: true
                }
            );
        }
    }

    /**
     * Выключает объявленную активность (выключает генерацию событий при изменении статуса)
     * @param {string} actionName - имя активности
     */
    disableAction(actionName) {
        if (this.#actionsMap.has(actionName)) {
            const action = this.#actionsMap.get(actionName);
            this.#actionsMap.set(
                actionName,
                {
                    ...action,
                    enabled: false
                }
            );
        }
    }

    /**
     * Нацеливает контроллер на переданный  DOM
     * @param {object} target - DOM элемент для прослушивания событий клавиатуры и диспатча кастомных событий
     * @param {boolean} [dontEnable] - необязательный аргумент. При значении true не активирует контроллер
     */
    attach(target, dontEnable) {
        this.#target = target;

        // Подписываемся на события и добавляем обработчики
        this.#target.addEventListener('keydown', this.#onKeyDown);
        this.#target.addEventListener('keyup', this.#onKeyUp);

        if (dontEnable) {
            this.enabled = false;
        }
    }
    
    /**
     * Отцеплят контроллер от DOM элемента и деактивирует контроллер 
     */
    detach() {
        // Удаляем обработчики
        this.#target.removeEventListener('keydown', this.#onKeyDown);
        this.#target.removeEventListener('keyup', this.#onKeyUp);
    
        this.#target = null;
        this.enabled = false;
    }

    /**
     * Проверяет активирована ли переданная активность в контроллере (соответствующая кнопка зажата etc.)
     * @param {string} actionName - имя активности
     * @returns {boolean} статус активности true/false
     */
    isActionActive(actionName) {
        return this.#actionsMap.get(actionName)?.active || false;
    }

    /**
     * Проверяет нажата ли переданная клавиша на контроллере
     * @param {number} keyCode - код клавиши. Целое неотрицательное число.
     * @returns {boolean}
     */
    isKeyPressed(keyCode) {
        return this.#pressedKeys.has(keyCode);
    }
 
    /**
     * Обработчик для события keydown
     * @param {object} event 
     */
    #onKeyDown(event) {
        
    }

    /**
     * Обработчик для события keyup
     * @param {object} event 
     */
    #onKeyUp(event) {

    }
} 