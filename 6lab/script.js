
// Масив даних про сенсори
const sensors = [
    {
        id: "NS-01",
        district: "Галицький",
        location: "просп. Свободи, 14",
        noiseLevel: 52,
        status: "normal"
    },
    {
        id: "NS-02",
        district: "Франківський",
        location: "вул. Наукова, 8",
        noiseLevel: 68,
        status: "warning"
    },
    {
        id: "NS-03",
        district: "Шевченківський",
        location: "просп. Чорновола, 21",
        noiseLevel: 83,
        status: "critical"
    },
    {
        id: "NS-04",
        district: "Сихівський",
        location: "вул. Зелена, 102",
        noiseLevel: 49,
        status: "normal"
    },
    {
        id: "NS-05",
        district: "Личаківський",
        location: "вул. Пасічна, 30",
        noiseLevel: 71,
        status: "warning"
    },
    {
        id: "NS-06",
        district: "Залізничний",
        location: "вул. Городоцька, 155",
        noiseLevel: 86,
        status: "critical"
    }
];

// Отримання HTML-елементів
const districtFilter = document.querySelector("#district-filter");
const criticalFilter = document.querySelector("#critical-filter");
const sensorList = document.querySelector(".sensor-list");

// Створення картки одного сенсора
function createSensorCard(sensor) {
    const card = document.createElement("article");
    card.classList.add("sensor-card", sensor.status);

    const statusNames = {
        normal: "normal",
        warning: "warning",
        critical: "critical"
    };

    const statusColors = {
        normal: "#16a34a",
        warning: "#e58a00",
        critical: "#dc2626"
    };

    card.innerHTML = `
        <div class="sensor-header">
            <h3>${sensor.id}</h3>
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
                ${sensor.location}
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
        message.textContent = "Сенсорів за вибраними фільтрами не знайдено.";
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

// Обробники подій фільтрів
districtFilter.addEventListener("change", applyFilters);
criticalFilter.addEventListener("change", applyFilters);

// Початкове відображення всіх сенсорів
renderSensors(sensors);
