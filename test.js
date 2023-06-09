const request = require('supertest');
const app = require('./server.js');

describe('POST /parse', function() {
  it('отвечает json, содержащим массив просканированных ссылок', async function() {
    const res = await request(app) // подключаем supertest
      .post('/parse') // делаем post запрос на /parse
      .send({domainName: 'https://test.com'}) // отправляем в теле запроса домен
      .set('Accept', 'application/json'); // указываем, что ожидаем json в ответе

    expect(Array.isArray(res.body)).toBeTruthy(); // проверяем, что ответ - массив
    expect(res.body).toContain('https://test.com/a'); // проверяем, что в массиве есть ссылка https://test.com/a
    expect(res.body).toContain('https://test.com/a/c'); // проверяем, что в массиве есть ссылка https://test.com/a/c
  });
});
