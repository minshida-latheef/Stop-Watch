const timeDisplay = document.getElementById("timeDisplay");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const lapBtn = document.getElementById("lapBtn");
const resetBtn = document.getElementById("resetBtn");
const clearLapsBtn = document.getElementById("clearLapsBtn");

const lapList = document.getElementById("lapList");

let startTime = 0;
let elapsedTime = 0;
let timerId = null;
let lapCount = 0;


// Format milliseconds into HH:MM:SS:MS
function formatTime(time) {
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor(
        (time % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor(
        (time % (1000 * 60)) / 1000
    );
    const milliseconds = Math.floor(
        (time % 1000) / 10
    );

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(milliseconds)}`;
}


// Add leading zero
function pad(number) {
    return String(number).padStart(2, "0");
}


// Update stopwatch display
function updateDisplay() {
    elapsedTime = performance.now() - startTime;
    timeDisplay.textContent = formatTime(elapsedTime);
}


// Start stopwatch
function startStopwatch() {
    if (timerId !== null) {
        return;
    }

    startTime = performance.now() - elapsedTime;

    timerId = setInterval(updateDisplay, 10);

    startBtn.disabled = true;
    pauseBtn.disabled = false;
    lapBtn.disabled = false;
}


// Pause stopwatch
function pauseStopwatch() {
    if (timerId === null) {
        return;
    }

    clearInterval(timerId);
    timerId = null;

    elapsedTime = performance.now() - startTime;

    updateDisplay();

    startBtn.disabled = false;
    pauseBtn.disabled = true;
    lapBtn.disabled = true;
}


// Reset stopwatch
function resetStopwatch() {
    clearInterval(timerId);

    timerId = null;
    startTime = 0;
    elapsedTime = 0;
    lapCount = 0;

    timeDisplay.textContent = "00:00:00:00";

    startBtn.disabled = false;
    pauseBtn.disabled = true;
    lapBtn.disabled = true;

    lapList.innerHTML = "";
    clearLapsBtn.disabled = true;
}


// Record lap
function recordLap() {
    if (timerId === null) {
        return;
    }

    lapCount++;

    const li = document.createElement("li");
    li.className = "lap-item";

    li.innerHTML = `
        <span class="lap-number">Lap ${lapCount}</span>
        <span class="lap-time">${formatTime(elapsedTime)}</span>
    `;

    lapList.prepend(li);

    clearLapsBtn.disabled = false;
}


// Clear all laps
function clearLaps() {
    lapList.innerHTML = "";
    lapCount = 0;
    clearLapsBtn.disabled = true;
}


// Button events
startBtn.addEventListener("click", startStopwatch);
pauseBtn.addEventListener("click", pauseStopwatch);
lapBtn.addEventListener("click", recordLap);
resetBtn.addEventListener("click", resetStopwatch);
clearLapsBtn.addEventListener("click", clearLaps);


// Keyboard shortcuts
document.addEventListener("keydown", function (event) {

    // Ignore shortcuts when typing in an input
    if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
    ) {
        return;
    }

    // Space = Start / Pause
    if (event.code === "Space") {
        event.preventDefault();

        if (timerId === null) {
            startStopwatch();
        } else {
            pauseStopwatch();
        }
    }

    // R = Reset
    if (event.key.toLowerCase() === "r") {
        resetStopwatch();
    }

    // L = Lap
    if (event.key.toLowerCase() === "l") {
        recordLap();
    }
});