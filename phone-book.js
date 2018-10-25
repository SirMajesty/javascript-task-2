'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
let phoneBook = [];

function checkPhone(phone) {
    return typeof(phone) === 'string' && /^[0-9]{10}$/.test(phone);
}

function checkName(name) {
    return typeof(name) === 'string' && name.length > 0;
}

function checkEmail(email) {
    return typeof(email) === 'string' &&
    (/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/.test(email) ||
    email.length === 0);
}

function checkAll(phone, name, email) {
    return checkPhone(phone) && checkName(name) && checkEmail(email);
}

function transform(phone) {
    return '+7 (' + phone.substring(0, 3) + ') ' + phone.substring(3, 6) +
        '-' + phone.substring(6, 8) + '-' + phone.substring(8, 10);
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (typeof(phoneBook[phone]) === 'undefined' && checkAll(phone, name, email)) {
        phoneBook[phone] = [name, email];

        return true;
    }

    return false;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (typeof(phoneBook[phone]) !== 'undefined' && checkName(name) && checkEmail(email)) {
        phoneBook[phone] = [name, email];

        return true;
    }

    return false;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    let forRemove = find(query);
    for (let i = 0; i < forRemove.length; i++) {
        delete phoneBook[forRemove.split(', ')[1]];
    }

    return forRemove.length;
}

function getData(data, query) {
    let result = [];
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
        if (typeof(query) === 'undefined' || data[keys[i]][0] === query ||
        data[keys[i]][1] === query) {
            result.push(data[keys[i]][0] + ', ' + transform(keys[i]) +
                        data[keys[i]][1].length > 0 ? ', ' + data[keys[i]][1] : '');
        }
    }

    return result;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    let result = [];
    if (query === '*') {
        result = getData(phoneBook);
    } else if (query !== '') {
        if (checkPhone(query) && typeof(phoneBook[query]) !== 'undefined') {
            let temp = [];
            temp[query] = [phoneBook[query][0], phoneBook[query][1]];
            result = getData(temp);
        } else {
            result = getData(phoneBook, query);
        }
    }
    result.sort();

    return result;
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    let phones = csv.split('\n');
    for (let i = 0; i < phones.length; i++) {
        let data = phones[i].split(';');
        if (typeof(phoneBook[data[0]]) === 'undefined') {
            add(data[0], data[1], data[2]);
        } else {
            update(data[0], data[1], data[2]);
        }
    }

    return csv.split('\n').length;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
