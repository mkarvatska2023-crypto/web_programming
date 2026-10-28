// analysis.js

// --- Тимчасові повідомлення ---
console.log("Запуск моніторингу...");
console.warn("Увага: використано тестові дані");
console.error("Демонстраційна помилка (видалити перед фінальним звітом)");

// --- Константи ---
const minValidLevel = 30;
const maxValidLevel = 130;
const warningLevel = 70;
const criticalLevel = 85;

// --- Тестові дані ---
const noiseLevels = [39, 45, 70, 85, 91, 95, -1, 141, 68, 72, 86, 40, 60];

// --- Допоміжні функції ---
// Arrow Function
const isValidLevel = level => Number.isFinite(level) && level >= minValidLevel && level <= maxValidLevel;

// Function Declaration
function findFirstCritical(levels, criticalLevel) {
  for (let i = 0; i < levels.length; i++) {
    const value = levels[i];
    if (isValidLevel(value) && value > criticalLevel) {
      return { value, position: i };
    }
  }
  return null;
}

// Function Expression
const countByCategory = function(levels, warningLevel, criticalLevel) {
  let safe = 0, warning = 0, critical = 0;
  for (const value of levels) {
    if (!isValidLevel(value)) continue;
    if (value <= warningLevel) safe++;
    else if (value <= criticalLevel) warning++;
    else critical++;
  }
  return { safe, warning, critical };
};

// Середнє
function calculateAverage(levels) {
  let sum = 0, count = 0;
  for (const value of levels) {
    if (!isValidLevel(value)) continue;
    sum += value;
    count++;
  }
  return count > 0 ? sum / count : null;
}

// Мінімум
function findMinimum(levels) {
  let min = null;
  for (const value of levels) {
    if (!isValidLevel(value)) continue;
    if (min === null) min = value;
    else if (value < min) min = value;
  }
  return min;
}

// Максимум
function findMaximum(levels) {
  let max = null;
  for (const value of levels) {
    if (!isValidLevel(value)) continue;
    if (max === null) max = value;
    else if (value > max) max = value;
  }
  return max;
}

// Відновлення
function findRecovery(levels, warningLevel, firstCriticalIndex) {
  if (firstCriticalIndex === null) return null;
  let i = firstCriticalIndex + 1;
  let streak = 0;
  while (i < levels.length) {
    const value = levels[i];
    if (isValidLevel(value) && value <= warningLevel) {
      streak++;
      if (streak === 3) return i;
    } else {
      streak = 0;
    }
    i++;
  }
  return null;
}

// Перше коректне значення (do...while)
function findFirstValid(levels) {
  if (levels.length === 0) return null;
  let i = 0;
  let result = null;
  do {
    if (isValidLevel(levels[i])) {
      result = levels[i];
      break;
    }
    i++;
  } while (i < levels.length);
  return result;
}

// --- Основний аналіз ---
const categories = countByCategory(noiseLevels, warningLevel, criticalLevel);
const average = calculateAverage(noiseLevels);
const min = findMinimum(noiseLevels);
const max = findMaximum(noiseLevels);
const firstCritical = findFirstCritical(noiseLevels, criticalLevel);
const recovery = firstCritical ? findRecovery(noiseLevels, warningLevel, firstCritical.position) : null;
const firstValid = findFirstValid(noiseLevels);

// --- Підсумковий звіт ---
console.group("Акустична варта -- звіт моніторингу");
console.log(`Пороги: попередження > ${warningLevel} dB; критичний рівень > ${criticalLevel} dB`);
console.log(`Усього вимірювань: ${noiseLevels.length}`);
const validCount = noiseLevels.filter(v => isValidLevel(v)).length;
console.log(`Коректних: ${validCount}`);
console.log(`Некоректних: ${noiseLevels.length - validCount}`);

console.table({
  "Без перевищення": categories.safe,
  "Попередження": categories.warning,
  "Критичні": categories.critical
});

console.log(`Середній рівень: ${average !== null ? average.toFixed(2) + " dB" : "null"}`);
console.log(`Мінімальний рівень: ${min !== null ? min + " dB" : "null"}`);
console.log(`Максимальний рівень: ${max !== null ? max + " dB" : "null"}`);

if (firstCritical) {
  console.log(`Перше критичне вимірювання: ${firstCritical.value} dB, позиція ${firstCritical.position}`);
} else {
  console.log("Перше критичне вимірювання: не знайдено");
}

if (recovery !== null) {
  console.log(`Відновлення -- три безпечні вимірювання поспіль: позиція ${recovery}`);
} else {
  console.log("Відновлення -- три безпечні вимірювання поспіль: не знайдено");
}

console.warn(`Поріг ${warningLevel} dB перевищено у ${categories.warning + categories.critical} вимірюваннях.`);

noiseLevels.forEach((v, i) => {
  if (!isValidLevel(v)) {
    console.error(`Некоректні дані: позиція ${i} (${v} dB)`);
  }
});

console.log(`Висновок: зафіксовано ${categories.critical} критичні вимірювання; після першого з них стійкого відновлення ${recovery ? "виявлено" : "не виявлено"}.`);
console.groupEnd();
