interface ApiSensor {
    id: string;
    name: string;
    district: string;
    noiseLevel: number;
    status: string;
}

interface Sensor {
    id: string;
    name: string;
    district: string;
    location: string;
    noiseLevel: number;
    operationalStatus: string;
    status: "normal" | "warning" | "critical";
}

const API_URL =
    "https://6b07f07958419b87a438ddf4.mockapi.io/api/v1/sensors";

const districtFilter =
    document.querySelector<HTMLSelectElement>("#district-filter");

const criticalFilter =
    document.querySelector<HTMLInputElement>("#critical-filter");

const sensorList =
    document.querySelector<HTMLDivElement>(".sensor-list");

let sensors: Sensor[] = [];

function getNoiseStatus(
    noiseLevel: number
): "normal" | "warning" | "critical" {

    if (noiseLevel >= 80) {
        return "critical";
    }

    if (noiseLevel >= 60) {
        return "warning";
    }

    return "normal";
}

function createSensorCard(sensor: Sensor): HTMLElement {
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

function renderSensors(sensorArray: Sensor[]): void {

    if (!sensorList) {
        return;
    }

    sensorList.innerHTML = "";

    if (sensorArray.length === 0) {
        const message = document.createElement("p");

        message.classList.add("empty-message");

        message.textContent =
            "Сенсорів за вибраними фільтрами не знайдено.";

        sensorList.appendChild(message);

        return;
    }

    sensorArray.forEach((sensor) => {
        const card = createSensorCard(sensor);
        sensorList.appendChild(card);
    });
}

function applyFilters(): void {

    if (!districtFilter || !criticalFilter) {
        return;
    }

    const selectedDistrict = districtFilter.value;
    const onlyCritical = criticalFilter.checked;

    const filteredSensors = sensors.filter((sensor) => {

        const matchesDistrict =
            selectedDistrict === "all" ||
            sensor.district === selectedDistrict;

        const matchesCritical =
            !onlyCritical ||
            sensor.status === "critical";

        return matchesDistrict && matchesCritical;
    });

    renderSensors(filteredSensors);
}

async function loadSensors(): Promise<void> {

    if (!sensorList) {
        return;
    }

    try {

        sensorList.innerHTML = "Завантаження даних...";

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(
                "Помилка сервера: " + response.status
            );
        }

        const data: ApiSensor[] = await response.json();

        sensors = data.map(
            (sensor: ApiSensor, index: number): Sensor => ({
                id:
                    sensor.id ||
                    `NS-${String(index + 1).padStart(2, "0")}`,

                name: sensor.name,

                district: sensor.district,

                location: "Адреса не вказана",

                noiseLevel: Number(sensor.noiseLevel),

                operationalStatus: sensor.status,

                status: getNoiseStatus(
                    Number(sensor.noiseLevel)
                )
            })
        );

        renderSensors(sensors);

    } catch (error) {

        console.error(
            "Помилка завантаження сенсорів:",
            error
        );

        sensorList.textContent =
            "Не вдалося завантажити дані. Перевірте підключення до API.";
    }
}

districtFilter?.addEventListener(
    "change",
    applyFilters
);

criticalFilter?.addEventListener(
    "change",
    applyFilters
);

loadSensors();