/*
    task
    1. Напишите функцию подготовки строки, которая заполняет шаблон данными из указанного объекта
    2. Пришлите код целиком, чтобы можно его было проверить
    3. Придерживайтесь code style текущего задания
    4. По необходимости - можете дописать код, методы
    5. Разместите код в гите и пришлите ссылку
*/

const isEmptyObject = (obj) => {
    return obj && typeof obj === 'object' && !Object.keys(obj).length;
}

/**
 * Класс для работы с API
 *
 * @author        Dmitrii Babich
 * @version        v.1.0 (15/07/2025)
 */
class Api {
    constructor() {

    }

    /**
     * Возвращает статичную часть из шаблона template
     *
     * @author        Dmitrii Babich
     * @version       v.1.0 (15/07/2025)
     * @param        {string} template
     * @return        {string}
     */
    get_url_static_part(template)
    {
        return template.split('/').filter(part => {
            return !part.startsWith('%') && !part.endsWith('%')
        }).join('/') ?? '';
    }

    /**
     * Возвращает список параметров из шаблона template
     *
     * @author        Dmitrii Babich
     * @version       v.1.0 (15/07/2025)
     * @param        {string} template
     * @return        {string[]}
     */
    get_url_params(template)
    {
        return template.split('/').filter(part => {
            return part.startsWith('%') && part.endsWith('%')
        }).map((part => {
            return part.replaceAll('%', '')
        })) ?? []
    }

    /**
     * Заполняет параметры данными из объекта
     *
     * @author        Dmitrii Babich
     * @version       v.1.0 (15/07/2025)
     * @param        {object} object
     * @param        {string[]} params
     * @return        {string}
     */
    prepare_url_parameters(object, params)
    {
        const result = []

        for (const param of params) {
            if (object[param]) {
                result.push(encodeURIComponent(object[param]));
            }
        }

        return result.join('/')
    }

    /**
     * Заполняет строковый шаблон template данными из объекта object
     *
     * @author        Dmitrii Babich
     * @version       v.1.0 (15/07/2025)
     * @param        {object} object
     * @param        {string} template
     * @return        {string}
     */
    get_api_path(object, template)
    {
        if (!template || isEmptyObject(object)) {
            return ''
        }

        let result = this.get_url_static_part(template);

        const params = this.get_url_params(template)

        if (!params.length) {
            return result;
        }

        result += this.prepare_url_parameters(object, params)

        return result;
    }
}


let user =
    {
        id: 20,
        name: 'John Dow',
        role: 'QA',
        salary: 100
    };

let api_path_templates =
    [
        "/api/items/%id%/%name%",
        "/api/items/%id%/%role%",
        "/api/items/%id%/%salary%"
    ];

let api = new Api();

let api_paths = api_path_templates.map((api_path_template) => {
    return api.get_api_path(user, api_path_template);
});

console.log(JSON.stringify(api_paths));

// Ожидаемый результат
let expected_result = ["/api/items/20/John%20Dow", "/api/items/20/QA", "/api/items/20/100"];
