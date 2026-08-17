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

    }

    /**
     * Включает объявленную активность (включает генерацию событий при изменении статуса)
     * @param {string} actionName - имя активности
     */
    enableAction(actionName) {

    }

    /**
     * Выключает объявленную активность (выключает генерацию событий при изменении статуса)
     * @param {string} actionName - имя активности
     */
    disableAction(actionName) {

    }

    /**
     * Нацеливает контроллер на переданный  DOM
     * @param {object} target - DOM элемент для прослушивания событий клавиатуры и диспатча кастомных событий
     * @param {boolean} [dontEnable] - необязательный аргумент. При значении true не активирует контроллер
     */
    attach(target, dontEnable) {

    }
    
    /**
     * Отцеплят контроллер от DOM элемента и деактивирует контроллер 
     */
    detach() {

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