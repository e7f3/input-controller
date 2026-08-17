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

    // Map с ключами actionName (имя активности) и значениями enabled (флаг включения активности)
    #actionsMap = new Map();
    // Map с ключами keyCode (код клавиши) и значениями actionName (имя активности)
    #keysMap = new Map();
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
            const isActionEnabled = Boolean(actionsToBind[actionName].enabled);
            const keys = actionsToBind[actionName].keys;

            if (!this.#actionsMap.has(actionName)) {
                this.#actionsMap.set(
                    actionName,
                    isActionEnabled
                );
            }

            Array.isArray(keys) && keys.forEach(keyCode => {
                if (!this.#keysMap.has(keyCode)) {
                    this.#keysMap.set(
                        keyCode,
                        actionName
                    );
                }
            });
        }
    }

    /**
     * Включает объявленную активность (включает генерацию событий при изменении статуса)
     * @param {string} actionName - имя активности
     */
    enableAction(actionName) {
        if (this.#actionsMap.has(actionName)) {
            this.#actionsMap.set(
                actionName,
                true
            );
        }
    }

    /**
     * Выключает объявленную активность (выключает генерацию событий при изменении статуса)
     * @param {string} actionName - имя активности
     */
    disableAction(actionName) {
        if (this.#actionsMap.has(actionName)) {
            this.#actionsMap.set(
                actionName,
                false
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

        if (dontEnable) {
            this.enabled = false;
        }
    }
    
    /**
     * Отцеплят контроллер от DOM элемента и деактивирует контроллер 
     */
    detach() {
        this.#target = null;
        this.enabled = false;
    }

    /**
     * Проверяет активирована ли переданная активность в контроллере (соответствующая кнопка зажата etc.)
     * @param {string} actionName - имя активности
     * @returns {boolean} статус активности true/false
     */
    isActionActive(actionName) {

    }

    /**
     * Проверяет нажата ли переданная клавиша на контроллере
     * @param {number} keyCode - код клавиши. Целое неотрицательное число.
     * @returns {boolean}
     */
    isKeyPressed(keyCode) {

    }
 
} 