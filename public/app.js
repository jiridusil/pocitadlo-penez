const hourlyRateInput = document.getElementById("hourlyRate");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");
const moneyDisplayMiliseconds = document.getElementById("moneyDisplayMiliseconds");
const startTimeDisplay = document.getElementById("elapsedTime");

let timerId = null;
let startTimestamp = null;
let baseEarnings = 0;
let currentHourlyRate = 0;

const formatter = new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const updateDisplayMiliseconds = (amount) => {
    moneyDisplayMiliseconds.textContent = formatter.format(amount);
}

const formatElapsed = (elapsedMs) => {
    const totalSeconds = Math.floor(elapsedMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const paddedSeconds = String(seconds).padStart(2, "0");
    return `${minutes}:${paddedSeconds}`;
};

const removeHourlyRate = () => {
    hourlyRateInput.value = "";
};

const getHourlyRate = () => {
    const value = Number(hourlyRateInput.value);
    return Number.isFinite(value) && value > 0 ? value : 0;
};

const toggleButtons = (isRunning) => {
    startBtn.disabled = isRunning;
    stopBtn.disabled = !isRunning;
    resetBtn.disabled = isRunning && baseEarnings === 0;
};

const tickMiliseconds = () => {
    if (!startTimestamp) return;
    const elapsedMs = Date.now() - startTimestamp;
    const perMs = currentHourlyRate / 3600000;
    const total = baseEarnings + elapsedMs * perMs;
    updateDisplayMiliseconds(total);
    startTimeDisplay.textContent = `Začátek: ${new Date(startTimestamp).toLocaleTimeString("cs-CZ")} • Uplynulý čas: ${formatElapsed(elapsedMs)}`;
};

startBtn.addEventListener("click", () => {
    const hourlyRate = getHourlyRate();
    if (hourlyRate === 0) {
        updateDisplayMiliseconds(0);
        hourlyRateInput.focus();
        return;
    }

    if (timerId) {
        clearInterval(timerId);
    }

    currentHourlyRate = hourlyRate;
    startTimestamp = Date.now();
    startTimeDisplay.textContent = `Začátek: ${new Date(startTimestamp).toLocaleTimeString("cs-CZ")} • Uplynulý čas: 0:00`;
    timerId = setInterval(tickMiliseconds, 1);
    tickMiliseconds();
    toggleButtons(true);
    removeHourlyRate();
});

stopBtn.addEventListener("click", () => {
    if (!timerId || !startTimestamp) return;
    tickMiliseconds();
    clearInterval(timerId);
    timerId = null;
    const elapsedMs = Date.now() - startTimestamp;
    baseEarnings += (currentHourlyRate / 3600000) * elapsedMs;
    startTimestamp = null;
    toggleButtons(false);
});

resetBtn.addEventListener("click", () => {
    if (timerId) {
        clearInterval(timerId);
    }
    timerId = null;
    startTimestamp = null;
    baseEarnings = 0;
    currentHourlyRate = 0;
    updateDisplayMiliseconds(0);
    startTimeDisplay.textContent = "";
    toggleButtons(false);
    removeHourlyRate();
});

hourlyRateInput.addEventListener("input", () => {
    if (!timerId && baseEarnings === 0) {
        updateDisplayMiliseconds(0);
    }
});

updateDisplayMiliseconds(0);
