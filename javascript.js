
const stopwatchTab = document.querySelector("#stopwatchTab");
const timerTab = document.querySelector("#timerTab");

const stopwatchSection = document.querySelector("#stopwatchSection");
const timerSection = document.querySelector("#timerSection");

const stopwatchDisplay = document.querySelector("#stopwatchDisplay");
const timerDisplay = document.querySelector("#timerDisplay");

const startButton = document.querySelector("#startButton");
const pauseButton = document.querySelector("#pauseButton");
const resetButton = document.querySelector("#resetButton");

const minutesInput = document.querySelector("#minutesInput");
const secondsInput = document.querySelector("#secondsInput");

const timerStartButton = document.querySelector("#timerStartButton");
const timerPauseButton = document.querySelector("#timerPauseButton");
const timerResetButton = document.querySelector("#timerResetButton");

const timerMessage = document.querySelector("#timerMessage");

// Stopwatch variables
let stopwatchInterval = null;
let stopwatchStartTime = 0;
let elapsedTime = 0;

// Timer variables
let timerInterval = null;
let remainingTime = 0;
let timerEndTime = 0;
let timerStarted = false;


// Convert time into HH:MM:SS
function formatStopwatch(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const centiseconds = Math.floor((milliseconds % 1000) / 10);

    return (
        String(hours).padStart(2, "0") + ":" +
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0") + "." +
        String(centiseconds).padStart(2, "0")
    );
}


// Start Stopwatch
startButton.addEventListener("click", function () {
    if (stopwatchInterval !== null) {
        return;
    }

    stopwatchStartTime = Date.now() - elapsedTime;

    stopwatchInterval = setInterval(function () {
        elapsedTime = Date.now() - stopwatchStartTime;

        stopwatchDisplay.textContent =
            formatStopwatch(elapsedTime);
    }, 10);
});


// Pause Stopwatch
pauseButton.addEventListener("click", function () {
    if (stopwatchInterval !== null) {
        clearInterval(stopwatchInterval);
        stopwatchInterval = null;
    }
});


// Reset Stopwatch
resetButton.addEventListener("click", function () {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
    elapsedTime = 0;
    stopwatchDisplay.textContent = "00:00:00.00";
});


// Switch to Stopwatch
stopwatchTab.addEventListener("click", function () {
    stopwatchSection.classList.remove("hidden");
    timerSection.classList.add("hidden");

    stopwatchTab.classList.add("active");
    timerTab.classList.remove("active");
});


// Switch to Timer
timerTab.addEventListener("click", function () {
    timerSection.classList.remove("hidden");
    stopwatchSection.classList.add("hidden");

    timerTab.classList.add("active");
    stopwatchTab.classList.remove("active");
});


// Format Timer display
function formatTimer(milliseconds) {
    const totalSeconds = Math.ceil(milliseconds / 1000);

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return (
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0")
    );
}


// Update Timer display
function updateTimerDisplay() {
    timerDisplay.textContent = formatTimer(remainingTime);
}


// Start Timer
timerStartButton.addEventListener("click", function () {
    if (timerInterval !== null) {
        return;
    }

    // Read time from inputs when starting a new timer
    if (!timerStarted) {
        const minutes = Number(minutesInput.value);
        const seconds = Number(secondsInput.value);

        if (
            minutesInput.value === "" ||
            secondsInput.value === "" ||
            !Number.isInteger(minutes) ||
            !Number.isInteger(seconds) ||
            minutes < 0 ||
            minutes > 999 ||
            seconds < 0 ||
            seconds > 59
        ) {
            timerMessage.textContent =
                "Enter valid minutes and seconds.";
            return;
        }

        remainingTime = (minutes * 60 + seconds) * 1000;

        if (remainingTime <= 0) {
            timerMessage.textContent =
                "Please set a time greater than zero.";
            return;
        }

        timerStarted = true;
        minutesInput.disabled = true;
        secondsInput.disabled = true;
    }

    timerMessage.textContent = "Timer is running!";

    timerEndTime = Date.now() + remainingTime;

    timerInterval = setInterval(function () {
        remainingTime = Math.max(0, timerEndTime - Date.now());

        updateTimerDisplay();

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            timerStarted = false;

            minutesInput.disabled = false;
            secondsInput.disabled = false;

            timerMessage.textContent = "Time is up!";
        }
    }, 100);
});


// Pause Timer
timerPauseButton.addEventListener("click", function () {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;

        remainingTime = Math.max(0, timerEndTime - Date.now());

        updateTimerDisplay();

        timerMessage.textContent = "Timer paused.";
    }
});


// Reset Timer
timerResetButton.addEventListener("click", function () {
    clearInterval(timerInterval);
    timerInterval = null;

    timerStarted = false;
    remainingTime = 0;

    minutesInput.disabled = false;
    secondsInput.disabled = false;

    const minutes = Number(minutesInput.value) || 0;
    const seconds = Number(secondsInput.value) || 0;

    remainingTime = (minutes * 60 + seconds) * 1000;

    updateTimerDisplay();

    timerMessage.textContent = "Set your time and press Start.";
});


// Show initial timer value
remainingTime =
    (Number(minutesInput.value) * 60 +
    Number(secondsInput.value)) * 1000;

updateTimerDisplay();
