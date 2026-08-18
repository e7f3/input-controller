/**
 * Класс контроллера для преобразования сигналов устройств ввода в стандартизированый формат.
 */
class InputController {
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
     * }
     * в качестве значений
     **/
    #actionsMap = new Map();
    // Map с ключами keyCode и значениями actionName
    #keysMap = new Map();
    // Set с keyCode (код клавиши) нажатых клавиш 
    #pressedKeys = new Set();
    // Прикрепленный DOM элемент
    #target;
    // Объект Document для прикрепленного DOM элемента
    #parentDocument;

    /**
     * @param {object} [actionsToBind] - необязательный аргумент. Объект со списком активностей вида 
     * { 
     *  "actionName": {
     *      "keys": [],
     *      "enabled": true,
     *  }
     * }
     * @param {object} [target] - необязательный аргумент. DOM элемент для прослушивания событий клавиатуры и диспатча кастомных событий
     * @param {Array<InputPlugin>} [plugins] - необязательный аргумент. Список плагинов ввода для подключения.
     */
    constructor(actionsToBind, target, plugins) {
        this.#bindedOnKeyDown = this.#onKeyDown.bind(this);
        this.#bindedOnKeyUp = this.#onKeyUp.bind(this);
        this.#bindedOnVisibilityChange = this.#onVisibilityChange.bind(this);

        if (actionsToBind && typeof actionsToBind === 'object') {
            this.bindActions(actionsToBind);
        }

        if (target && typeof target === 'object') {
            this.attach(target);
        }

        if (plugins && Array.isArray(plugins)) {
            plugins.forEach(plugin => this.initPlugin(plugin))
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
            const keys = actionsToBind[actionName]?.keys;
            const enabled = actionsToBind[actionName]?.enabled

            // Для каждого из кодов клавиш добавляем его в Map, перезаписываем связаную активность если код уже был записан
            for (let key of keys) {
                this.#keysMap.set(key, actionName);
            }

            this.#actionsMap.set(
                actionName,
                {
                    keys: keys || [],
                    enabled: enabled || false,
                }
            );
        }
    }

    /**
     * Подключает переданные плагины ввода к контроллеру
     * @param {Array<InputPlugin>} plugins - cписок плагинов ввода для подключения.
     */
    connectPlugins(plugins) {
        if (plugins && Array.isArray(plugins)) {
            plugins.forEach(plugin => this.initPlugin(plugin))
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
     * Нацеливает контроллер на переданный DOM
     * @param {object} target - DOM элемент для прослушивания событий клавиатуры и диспатча кастомных событий
     * @param {boolean} [dontEnable] - необязательный аргумент. При значении true не активирует контроллер
     */
    attach(target, dontEnable) {
        if (!target) {
            return;
        }

        // Если уже имеется прикрепленный DOM элемент, отписываемся от событий
        if (this.#target) {
            this.detach();
        }

        this.#target = target;
        this.#parentDocument = target?.ownerDocument;

        // Подписываемся на события и добавляем обработчики
        if (this.#parentDocument) {
            this.#parentDocument.addEventListener('keydown', this.#bindedOnKeyDown);
            this.#parentDocument.addEventListener('keyup', this.#bindedOnKeyUp);
            this.#parentDocument.addEventListener('visibilitychange', this.#bindedOnVisibilityChange);
        }

        if (dontEnable) {
            this.enabled = false;
        }

        this.focused = this.#parentDocument.visibilityState === 'visible';
    }
    
    /**
     * Отцеплят контроллер от DOM элемента и деактивирует контроллер 
     */
    detach() {
        // Удаляем обработчики
        if (this.#parentDocument) {
            this.#parentDocument.removeEventListener('keydown', this.#bindedOnKeyDown);
            this.#parentDocument.removeEventListener('keyup', this.#bindedOnKeyUp);
            this.#parentDocument.removeEventListener('visibilitychange', this.#bindedOnVisibilityChange);
        }
    
        this.#target = null;
        this.enabled = false;
    }

    /**
     * Проверяет активирована ли переданная активность в контроллере (соответствующая кнопка зажата etc.)
     * @param {string} actionName - имя активности
     * @returns {boolean} статус активности true/false
     */
    isActionActive(actionName) {
        const hasAnyAttachedKeysPressed = Array.from(
            this.#actionsMap.get(actionName)?.keys ?? []
        ).some(keyCode => this.#pressedKeys.has(keyCode));
        return hasAnyAttachedKeysPressed || false;
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
     * Инициализирует переданный плагин и передает DOM элемент при наличии
     * @param {InputPlugin} plugin - экземпляр плагина имплементирующий InputPlugin
     */
    initPlugin(plugin) {
        plugin?.init?.(this);

        if (this.#target) {
            plugin?.attach?.(this.#target);
        }
    }

    /**
     * Создает кастомный эвент и отправляет его с именем активности
     * @param {string} eventName - название эвента
     * @param {string} actionName - имя активности
     */
    #emitEventForAction(eventName, actionName) {
        const target = this.#target;

        if (target && this.enabled && this.focused) {
            const event = new CustomEvent(
                eventName,
                {
                    detail: actionName
                }
            );
            target.dispatchEvent(event);
        }
    }

    /**
     * Проверяет наличие активности для кода клавиши
     * @param {string} keyCode 
     * @returns {string} имя разрешенной (включенной) активности
     */
    #getEnabledActionName(keyCode) {
        const actionName = this.#keysMap.get(keyCode);
        const actionConfig = this.#actionsMap.get(actionName);

        if (actionConfig?.enabled) {
            return actionName;
        }
    }

    /**
     * Обработчик для события keydown
     * @param {object} event - объект Keyboard Event
     */
    #onKeyDown(event) {
        if (!this.enabled) {
            return;
        }

        const keyCode = event.keyCode;
        if (keyCode) {
            if (this.#pressedKeys.has(keyCode)) {
                return;
            }

            const actionName = this.#getEnabledActionName(keyCode);

            if (actionName) {
                if (!this.isActionActive(actionName)) {
                    this.#emitEventForAction(this.ACTION_ACTIVATED, actionName);
                }

                this.#pressedKeys.add(keyCode);
            }
        }
    }

    /**
     * Обработчик для события keyup
     * @param {object} event - объект Keyboard Event
     */
    #onKeyUp(event) {
        if (!this.enabled) {
            return;
        }
        
        const keyCode = event.keyCode;
        if (keyCode) {
            const actionName = this.#getEnabledActionName(keyCode);

            if (actionName) {
                this.#pressedKeys.delete(keyCode);

                if (this.isActionActive(actionName)) {
                    return;
                }

                this.#emitEventForAction(this.ACTION_DEACTIVATED, actionName);
            }
        }
    }
    
    /**
     * Обработчик события visibilitychange
     * @param {object} event - объект VisibilityChange Event
     * @returns 
     */
    #onVisibilityChange(event) {
        this.focused = event.target.visibilityState === 'visible';
    }

    // Методы обработчиков событий с привязаным this
    #bindedOnKeyDown;
    #bindedOnKeyUp;
    #bindedOnVisibilityChange
}