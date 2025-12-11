// Check authentication
document.addEventListener('DOMContentLoaded', function () {
    const user = sessionStorage.getItem('user');
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Set user name
    const userData = JSON.parse(user);
    document.getElementById('userName').textContent = userData.username;

    // Initialize the dashboard
    initializeDashboard();
});

// Logout handler
document.getElementById('logoutBtn').addEventListener('click', function () {
    sessionStorage.removeItem('user');
    window.location.href = 'login.html';
});

// Navigation handler
const navItems = document.querySelectorAll('.nav-item');
const contentSections = document.querySelectorAll('.content-section');

navItems.forEach(item => {
    item.addEventListener('click', function (e) {
        e.preventDefault();

        // Remove active class from all nav items
        navItems.forEach(nav => nav.classList.remove('active'));

        // Add active class to clicked item
        this.classList.add('active');

        // Hide all content sections
        contentSections.forEach(section => section.classList.remove('active'));

        // Show selected section
        const sectionId = this.getAttribute('data-section');
        document.getElementById(sectionId).classList.add('active');
    });
});

// Dashboard Initialization
function initializeDashboard() {
    // Initialize traffic status
    updateTrafficStatus();

    // Start simulation
    startTrafficSimulation();

    // Initialize emergency log
    addLogEntry('System initialized - Traffic control active', false);
}

// Traffic Simulation
let totalVehicleCount = 0;
let emergencyCount = 0;
const directions = ['North', 'East', 'South', 'West'];
let currentSignalIndex = 0;
let signalTimer = 0;
let currentGreenTime = 10;

function startTrafficSimulation() {
    // Initialize all signals to RED first
    setAllSignalsToRed();

    // Start the first signal cycle
    setTimeout(() => {
        updateSignalStatus();
        updateTrafficStatus();
    }, 1000);

    // Main simulation loop - update every second for timer countdown
    setInterval(() => {
        signalTimer++;

        // Update timer display
        updateTimerDisplay();

        // Check if it's time to switch signals
        if (signalTimer >= currentGreenTime) {
            signalTimer = 0;
            currentSignalIndex = (currentSignalIndex + 1) % directions.length;
            updateSignalStatus();
            updateTrafficStatus();
        }
    }, 1000);
}

function setAllSignalsToRed() {
    directions.forEach(direction => {
        const card = document.querySelector(`[data-direction="${direction}"]`);
        if (card) {
            const lights = card.querySelectorAll('.light');
            const statusEl = card.querySelector('.status-text');
            const timerEl = card.querySelector('.timer');

            lights.forEach(light => light.classList.remove('active'));
            lights[0].classList.add('active'); // Red
            statusEl.textContent = 'RED';
            statusEl.style.color = '#e74c3c';
            timerEl.textContent = '10s';
        }
    });
}

function updateTimerDisplay() {
    const direction = directions[currentSignalIndex];
    const card = document.querySelector(`[data-direction="${direction}"]`);
    if (card) {
        const timerEl = card.querySelector('.timer');
        const remaining = currentGreenTime - signalTimer;
        timerEl.textContent = remaining + 's';
    }
}

function updateSignalStatus() {
    // First, set all signals to RED
    directions.forEach(direction => {
        const card = document.querySelector(`[data-direction="${direction}"]`);
        if (card) {
            const lights = card.querySelectorAll('.light');
            const statusEl = card.querySelector('.status-text');
            const timerEl = card.querySelector('.timer');

            lights.forEach(light => light.classList.remove('active'));
            lights[0].classList.add('active'); // Red
            statusEl.textContent = 'RED';
            statusEl.style.color = '#e74c3c';
            timerEl.textContent = '--';
        }
    });

    // Now set the current signal to GREEN
    const direction = directions[currentSignalIndex];
    const vehicleCount = Math.floor(Math.random() * 21);
    const isEmergency = Math.random() > 0.85; // 15% chance of emergency

    totalVehicleCount += vehicleCount;
    document.getElementById('totalVehicles').textContent = totalVehicleCount;

    // Update the active signal card
    const signalCard = document.querySelector(`[data-direction="${direction}"]`);
    if (signalCard) {
        const vehicleCountEl = signalCard.querySelector('.vehicle-count');
        const statusEl = signalCard.querySelector('.status-text');
        const timerEl = signalCard.querySelector('.timer');
        const lights = signalCard.querySelectorAll('.light');

        vehicleCountEl.textContent = vehicleCount;

        if (isEmergency) {
            emergencyCount++;
            document.getElementById('emergencyAlerts').textContent = emergencyCount;
            statusEl.textContent = 'EMERGENCY';
            statusEl.style.color = '#e74c3c';
            currentGreenTime = 15;
            timerEl.textContent = currentGreenTime + 's';

            // Show green light for emergency
            lights.forEach(light => light.classList.remove('active'));
            lights[2].classList.add('active'); // Green

            addLogEntry(`🚨 Emergency vehicle at ${direction} signal`, true);
        } else {
            // Determine signal based on traffic
            let greenTime, status;
            if (vehicleCount > 15) {
                greenTime = 20;
                status = 'GREEN (High Traffic)';
            } else if (vehicleCount > 8) {
                greenTime = 15;
                status = 'GREEN (Medium Traffic)';
            } else {
                greenTime = 10;
                status = 'GREEN (Low Traffic)';
            }

            currentGreenTime = greenTime;
            statusEl.textContent = status;
            statusEl.style.color = '#27ae60';
            timerEl.textContent = greenTime + 's';

            // Show green light
            lights.forEach(light => light.classList.remove('active'));
            lights[2].classList.add('active'); // Green
        }

        // Add to activity table
        addActivityRow(direction, vehicleCount, isEmergency);
    }

    // Reset timer for the new signal
    signalTimer = 0;
}

function updateTrafficStatus() {
    const trafficStatusEl = document.getElementById('trafficStatus');
    trafficStatusEl.innerHTML = '';

    directions.forEach(direction => {
        const card = document.querySelector(`[data-direction="${direction}"]`);
        if (card) {
            const vehicleCount = card.querySelector('.vehicle-count').textContent;
            const status = card.querySelector('.status-text').textContent;

            const statusItem = document.createElement('div');
            statusItem.className = 'traffic-item';
            statusItem.innerHTML = `
                <h4>${direction} Junction</h4>
                <p>Vehicles: ${vehicleCount}</p>
                <p>Status: ${status}</p>
            `;
            trafficStatusEl.appendChild(statusItem);
        }
    });
}

function addActivityRow(signal, vehicles, isEmergency) {
    const tbody = document.getElementById('activityTableBody');
    const now = new Date();
    const timeStr = now.toLocaleTimeString();

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${timeStr}</td>
        <td>${signal}</td>
        <td>${vehicles}</td>
        <td>${isEmergency ? '🚨 Emergency' : 'Normal'}</td>
        <td><span style="color: ${isEmergency ? '#e74c3c' : '#27ae60'}">${isEmergency ? 'Priority' : 'Active'}</span></td>
    `;

    // Add to top of table
    if (tbody.firstChild) {
        tbody.insertBefore(row, tbody.firstChild);
    } else {
        tbody.appendChild(row);
    }

    // Keep only last 10 rows
    while (tbody.children.length > 10) {
        tbody.removeChild(tbody.lastChild);
    }
}

function addLogEntry(message, isEmergency) {
    const logContent = document.getElementById('emergencyLogContent');
    const now = new Date();
    const timeStr = now.toLocaleTimeString();

    const entry = document.createElement('p');
    entry.className = 'log-entry' + (isEmergency ? ' emergency' : '');
    entry.textContent = `[${timeStr}] ${message}`;

    logContent.insertBefore(entry, logContent.firstChild);

    // Keep only last 20 entries
    while (logContent.children.length > 20) {
        logContent.removeChild(logContent.lastChild);
    }
}

// Emergency Controls
document.getElementById('simulateEmergency').addEventListener('click', function () {
    const statusIndicator = document.getElementById('emergencyStatus');
    const dot = statusIndicator.querySelector('.status-dot');
    const label = statusIndicator.querySelector('.status-label');

    dot.classList.add('emergency');
    label.textContent = 'Emergency Active';
    label.style.color = '#e74c3c';

    addLogEntry('🚨 Manual emergency simulation activated', true);
    emergencyCount++;
    document.getElementById('emergencyAlerts').textContent = emergencyCount;

    // Auto-clear after 15 seconds
    setTimeout(() => {
        clearEmergency();
    }, 15000);
});

document.getElementById('clearEmergency').addEventListener('click', function () {
    clearEmergency();
});

function clearEmergency() {
    const statusIndicator = document.getElementById('emergencyStatus');
    const dot = statusIndicator.querySelector('.status-dot');
    const label = statusIndicator.querySelector('.status-label');

    dot.classList.remove('emergency');
    label.textContent = 'No Emergency';
    label.style.color = '#27ae60';

    addLogEntry('Emergency cleared - Normal operation resumed', false);
}

// Signal Control Buttons
document.querySelectorAll('.btn-green').forEach(btn => {
    btn.addEventListener('click', function () {
        const card = this.closest('.signal-card');
        const direction = card.getAttribute('data-direction');
        const lights = card.querySelectorAll('.light');
        const statusEl = card.querySelector('.status-text');

        lights.forEach(light => light.classList.remove('active'));
        lights[2].classList.add('active'); // Green
        statusEl.textContent = 'GREEN (Manual)';
        statusEl.style.color = '#27ae60';

        addLogEntry(`Manual override: ${direction} signal set to GREEN`, false);
    });
});

document.querySelectorAll('.btn-red').forEach(btn => {
    btn.addEventListener('click', function () {
        const card = this.closest('.signal-card');
        const direction = card.getAttribute('data-direction');
        const lights = card.querySelectorAll('.light');
        const statusEl = card.querySelector('.status-text');

        lights.forEach(light => light.classList.remove('active'));
        lights[0].classList.add('active'); // Red
        statusEl.textContent = 'RED (Manual)';
        statusEl.style.color = '#e74c3c';

        addLogEntry(`Manual override: ${direction} signal set to RED`, false);
    });
});

// Settings Save
document.getElementById('saveSettings').addEventListener('click', function () {
    const settings = {
        greenTimeHigh: document.getElementById('greenTimeHigh').value,
        greenTimeMedium: document.getElementById('greenTimeMedium').value,
        greenTimeLow: document.getElementById('greenTimeLow').value,
        highThreshold: document.getElementById('highThreshold').value,
        mediumThreshold: document.getElementById('mediumThreshold').value,
        autoMode: document.getElementById('autoMode').checked,
        soundAlerts: document.getElementById('soundAlerts').checked,
        notifications: document.getElementById('notifications').checked
    };

    localStorage.setItem('trafficSettings', JSON.stringify(settings));

    // Show success message
    alert('Settings saved successfully!');
    addLogEntry('System settings updated', false);
});

// Load saved settings on page load
window.addEventListener('load', function () {
    const savedSettings = localStorage.getItem('trafficSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        document.getElementById('greenTimeHigh').value = settings.greenTimeHigh;
        document.getElementById('greenTimeMedium').value = settings.greenTimeMedium;
        document.getElementById('greenTimeLow').value = settings.greenTimeLow;
        document.getElementById('highThreshold').value = settings.highThreshold;
        document.getElementById('mediumThreshold').value = settings.mediumThreshold;
        document.getElementById('autoMode').checked = settings.autoMode;
        document.getElementById('soundAlerts').checked = settings.soundAlerts;
        document.getElementById('notifications').checked = settings.notifications;
    }
});
