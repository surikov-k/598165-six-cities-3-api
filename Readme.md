# Личный проект «Шесть городов»

* Студент: [Константин Суриков](https://up.htmlacademy.ru/nodejs-api/2/user/598165).
* Наставник: [Сергей Вохмянин](https://htmlacademy.ru/profile/id530823).

---

## Памятка

### 1. Файл .env

- `SALT` —  соль
- `DB_USER` — имя пользователя базы данных
- `DB_PASSWORD` — пароль базы данных
- `DB_NAME` — название базы данных
- `UPLOAD_DIRECTORY` — директория для загрузки файлов
- `JWT_SECRET` — jwt секрет

### 2. Запуск проекта
1. `npm install` — Установит зависимости
2. `npm run mock:server` — Запустит json-сервер с моковыми данными
3. `npm run ts src/cli.ts -- --generate 10 ./mocks/mock-data.tsv  http://localhost:2123/api
  ` — Сохранит данные для 10 предложений об аренде в файл `/mocks/mock-data.tsv`
4. `npm run ts src/cli.ts -- --import ./mocks/mock-data.tsv admin test localhost six-cities-restapi salt` — Импортирует данные в БД
5. `npm run start:dev` — Запустит дев-сервер

### 2. Сценарии
- `start` — соберет и запустит проект
- `start:dev` — запустит дев-сервер
- `build` — очистит `/dist` и скомпилирует проект
- `lint` — линт
- `compile` — скомпилирует ts
- `clean` — очистит `/dist`
- `ts` — ts-node
- `mock:server` — запустит json-сервер с моковыми данными  

---

<a href="https://htmlacademy.ru/profession/fullstack"><img align="left" width="50" height="50" title="HTML Academy" src="https://up.htmlacademy.ru/static/img/intensive/nodejs/logo-for-github-2.png"></a>

Репозиторий создан для обучения на профессиональном онлайн‑курсе «[Node.js. Профессиональная разработка REST API](https://htmlacademy.ru/profession/fullstack)» от [HTML Academy](https://htmlacademy.ru).
