# Лабораторна робота №8: Робота з даними з API на TypeScript

**Проєкт:** Акустична варта  
**Дисципліна:** WEB-програмування

## Мета роботи
Навчитися описувати структуру даних REST API за допомогою `interface` у TypeScript, завантажувати дані через `fetch()` із `async/await` та обробкою помилок, передавати типізований масив `Sensor[]` між функціями, компілювати `.ts` у `.js` і відображати картки сенсорів на вебсторінці.

## Налаштування середовища та API
1. У корені проєкту ініціалізовано npm і встановлено TypeScript як dev-залежність (`npm init -y`, `npm install -D typescript`, `npx tsc --init`).
2. Налаштовано `tsconfig.json` з опціями `"target": "ES2020"`, `"module": "ES2020"`, `"strict": true`, `"rootDir": "./src"`, `"outDir": "./dist"`.
3. Використано проєкт у [MockAPI](https://xxxxxxxx.mockapi.io/api/v1/sensors) з префіксом `/api/v1` та ресурсом `sensors` (`https://YOUR_PROJECT.mockapi.io/api/v1/sensors`), який містить записи сенсорів із полями `id`, `name`, `district`, `noiseLevel` та `status` (`"active"` | `"inactive"`).

## Реалізація у проєкті
- **Інтерфейс `Sensor` (`src/sensors.ts`):** описано тип об'єкта сенсора (`id: string`, `name: string`, `district: string`, `noiseLevel: number`, `status: "active" | "inactive"`), щоб контролювати поля та типи даних на етапі написання коду.
- **Завантаження даних (`loadSensors(): Promise<void>`):** асинхронна функція у блоці `try / catch` виконує `await fetch(...)`, перевіряє `response.ok` (кидаючи помилку у разі неуспішної відповіді), зчитує JSON через `const sensors: Sensor[] = await response.json()` і передає масив у `renderSensors(sensors)`.
- **Відображення карток (`renderSensors(sensors: Sensor[]): void`):** знаходить контейнер `#sensors` через `document.querySelector<HTMLDivElement>("#sensors")`, перевіряє його на `null`, очищає вміст (`container.innerHTML = ""`) і для кожного елемента масиву створює картку `.sensor-card` з назвою, районом, рівнем шуму (`дБ`) та статусом.
- **Запуск та компіляція:** у кінці `src/sensors.ts` викликається `loadSensors()`, файл компілюється у `dist/sensors.js` (`npx tsc` або `npx tsc --watch`), а в `index.html` підключено `<script type="module" src="./dist/sensors.js"></script>`.

## Перевірка роботи
1. Проєкт запущено через локальний сервер (Live Server у VS Code) та відкрито в браузері.
2. У **DevTools → Console** перевірено відсутність помилок, а в **DevTools → Network** зафіксовано успішний `GET`-запит до `/api/v1/sensors`.
3. У секції «Активні сенсори» згенеровано картки сенсорів із даними, отриманими з MockAPI.

## Висновки
Під час виконання лабораторної роботи №8 для проєкту **«Акустична варта»** було переведено логіку завантаження та відображення сенсорів із API на TypeScript.

Описання структури через `interface Sensor` і типізація масиву `Sensor[]` та DOM-контейнера `HTMLDivElement` дозволили зменшити кількість помилок у назвах полів і типах даних ще під час розробки. Поділ на асинхронне отримання даних (`loadSensors()`) і рендеринг у DOM (`renderSensors()`) зробив код структурованішим, а компіляція `src/sensors.ts` у `dist/sensors.js` через `tsc` забезпечила коректне виконання скрипту в браузері.