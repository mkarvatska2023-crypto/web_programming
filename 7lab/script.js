
// Адреса твого ресурсу MockAPI
const API_URL = "https://6b07f07958419b87a438ddf4.mockapi.io/api/v1/sensors";

// Отримання HTML-елементів
const districtFilter = document.querySelector("#district-filter");
const criticalFilter = document.querySelector("#critical-filter");
const sensorList = document.querySelector(".sensor-list");

// Масив для отриманих даних
let sensors = [];

// Визначення рівня шуму
function getNoiseStatus(noiseLevel) {
    if (noiseLevel >= 80) {
        return "critical";
    }

    if (noiseLevel >= 60) {
        return "warning";
    }

    return "normal";
}

// Створення картки одного сенсора
function createSensorCard(sensor) {
    const card = document.createElement("article");
    card.classList.add("sensor-card", sensor.status);

    const statusNames = {
        normal: "Нормальний",
        warning: "Підвищений",
        critical: "Критичний"
    };

    const statusColors = {
        normal: "#16a34a",
        warning: "#e58a00",
        critical: "#dc2626"
    };

    card.innerHTML = `
        <div class="sensor-header">
            <h3>${sensor.name}</h3>
            <span class="sensor-status ${sensor.status}">
                <span class="status-dot"></span>
                ${statusNames[sensor.status]}
            </span>
        </div>

        <div class="sensor-info">
            <p>
                <span>📍</span>
                ${sensor.district} район
            </p>

            <p>
                <span>🏢</span>
                Адреса не вказана
            </p>

            <p>
                Статус сенсора: ${sensor.operationalStatus}
            </p>
        </div>

        <div class="sensor-noise">
            <span>📊</span>
            Рівень шуму:
            <strong style="color: ${statusColors[sensor.status]}">
                ${sensor.noiseLevel} дБ
            </strong>
        </div>
    `;

    return card;
}

// Відображення карток сенсорів
function renderSensors(sensorArray) {
    sensorList.innerHTML = "";

    if (sensorArray.length === 0) {
        const message = document.createElement("p");
        message.classList.add("empty-message");
        message.textContent =
            "Сенсорів за вибраними фільтрами не знайдено.";
        sensorList.appendChild(message);
        return;
    }

    sensorArray.forEach(sensor => {
        const card = createSensorCard(sensor);
        sensorList.appendChild(card);
    });
}

// Фільтрація сенсорів
function applyFilters() {
    const selectedDistrict = districtFilter.value;
    const onlyCritical = criticalFilter.checked;

    const filteredSensors = sensors.filter(sensor => {
        const matchesDistrict =
            selectedDistrict === "all" ||
            sensor.district === selectedDistrict;

        const matchesCritical =
            !onlyCritical || sensor.status === "critical";

        return matchesDistrict && matchesCritical;
    });

    renderSensors(filteredSensors);
}

// Завантаження даних із MockAPI
async function loadSensors() {
    try {
        sensorList.innerHTML = "Завантаження даних...";

        const response = await fetch(API_URL);

        console.log("Відповідь сервера:", response);
        console.log("Статус відповіді:", response.status);
        console.log("Успішний запит:", response.ok);

        if (!response.ok) {
            throw new Error("Помилка сервера: " + response.status);
        }

        const data = await response.json();

        console.log("Отримані дані:", data);

        // Перетворення даних API у формат сайту
        sensors = data.map((sensor, index) => ({
            id: sensor.id || `NS-${String(index + 1).padStart(2, "0")}`,
            name: sensor.name,
            district: sensor.district,
            location: "Адреса не вказана",
            noiseLevel: Number(sensor.noiseLevel),
            operationalStatus: sensor.status,
            status: getNoiseStatus(Number(sensor.noiseLevel))
        }));

        renderSensors(sensors);

    } catch (error) {
        console.error("Помилка завантаження сенсорів:", error);

        sensorList.textContent =
            "Не вдалося завантажити дані. Перевірте підключення до API.";
    }
}

// Обробники подій фільтрів
districtFilter.addEventListener("change", applyFilters);
criticalFilter.addEventListener("change", applyFilters);

// Початкове завантаження сенсорів
loadSensors();
