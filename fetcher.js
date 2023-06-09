const fs = require('fs'); // импорт модуля для работы с файлами

const url = require('url'); // импорт модуля для работы с url
const data = require('./data.json'); // импорт данных

const ROOT = 'https://test.com'; // корневой домен
const NOT_FOUND_PAGE = '<!DOCTYPE html><html><head/><body>Not found</body></html>'; // страница 404
const RETRY_PATH = '/b/e' // путь, который нужно будет перезапросить

let totalRequests = 0 // счетчик запросов

async function fetcher(resource) { // функция для получения ответа от сервера
  totalRequests += 1 // увеличиваем счетчик запросов
  if(totalRequests > 23) { // если запросов больше 23, то завершаем процесс
    fs.writeFileSync('./output.txt', JSON.stringify({message: 'Too many requests'}, null, 2));
    process.exit(0)
  }
  var q = url.parse(resource, false); // парсим url
  if(`${q.protocol}//${q.host}` !== ROOT) { // если домен не совпадает с корневым, то выбрасываем ошибку
    throw new Error('getaddrinfo ENOTFOUND');
  }
  const pathname = q.pathname; // получаем путь из url

  if(pathname === RETRY_PATH) { // если путь равен RETRY_PATH, то возвращаем 404
    data[pathname].status = 200 // меняем статус на 200
  }

  if(!(pathname in data)) { // если пути нет в данных, то возвращаем 404
    return {
      status: 404,
      text: async () => NOT_FOUND_PAGE // возвращаем страницу 404
    }
  } else {
    return {
      status: data[pathname].status,
      text: async () => data[pathname].content //  в другом случае возвращаем контент страницы
    }
  }
}


module.exports = {fetcher}; // экспортируем функцию
