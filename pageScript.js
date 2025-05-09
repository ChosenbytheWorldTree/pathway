// Prevent text selection on entire table
document.querySelector('.planner-table').addEventListener('selectstart', function(e) {
    e.preventDefault();
    return false;
});

// Only allow text selection in textarea
document.getElementById('dailyReflection').addEventListener('selectstart', function(e) {
    e.stopPropagation();
});
// Subjects array
const subjects = [
    "ENGLISH", "ALGORITHMS", "PYTHON", "ROBOTICS",
    "MATH", "PHISICS", "PROJECT", "PORTFOLIO", "TEST", "PREP"
];

// Display current date
const today = new Date();
const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
const currentDateStr = today.toLocaleDateString('en-US', dateOptions).replace(/\//g, ',');

// Initialize completion status
const completionStatus = {};
subjects.forEach(subject => {
    completionStatus[subject] = false;
});

// Task completion tracking
const completeButtons = document.querySelectorAll('.complete-btn');
const taskStatusElement = document.getElementById('taskStatus');
const completionStatusElement = document.getElementById('completionStatus');
let completedTasks = 0;
const totalTasks = completeButtons.length;

// Set up completion buttons
completeButtons.forEach((button, index) => {
    const subject = subjects[index];
    button.addEventListener('click', function () {
        completionStatus[subject] = !completionStatus[subject];
        updateCompletionStatus();
        updateProgress();
    });
});

function updateCompletionStatus() {
    let statusHTML = '';
    subjects.forEach(subject => {
        statusHTML += `<div class="completed-status ${completionStatus[subject] ? 'completed' : 'not-completed'}">
                    ${subject} ${completionStatus[subject] ? 'Completed' : "Don't Completed"}
                </div>`;
    });
    completionStatusElement.innerHTML = statusHTML;
}

function updateProgress() {
    completedTasks = Object.values(completionStatus).filter(Boolean).length;
    taskStatusElement.innerHTML = `<strong>Progress:</strong> ${completedTasks}/${totalTasks} tasks completed (${Math.round((completedTasks / totalTasks) * 100)}%)`;
}

// Enhanced Tracker Functionality
document.getElementById('saveReflection').addEventListener('click', function () {
    saveReflection();
    alert('Progress saved!');
});

function saveReflection() {
    const reflectionText = document.getElementById('dailyReflection').value;
    const completionText = generateCompletionText();
    const fullReflection = `${currentDateStr}\n————————\n--------\n${completionText}\n\n${reflectionText}`;

    localStorage.setItem('dailyReflection', fullReflection);
    return fullReflection;
}

function generateCompletionText() {
    return subjects.map(subject =>
        `${subject} ${completionStatus[subject] ? 'Completed' : "Don't Completed"}`
    ).join('\n');
}

// Download functionality
document.getElementById('downloadBtn').addEventListener('click', function () {
    const fullReflection = saveReflection();
    const filename = `progress_${currentDateStr.replace(/,/g, '-')}.txt`;

    const blob = new Blob([fullReflection], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// Import functionality
document.getElementById('fileInput').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const importedText = e.target.result;
        processImportedData(importedText);
    };
    reader.readAsText(file);

    // Reset file input
    e.target.value = '';
});

function processImportedData(importedText) {
    const lines = importedText.split('\n');
    let dateFound = false;
    let completionSection = false;
    let reflectionText = '';

    // Check if current date exists in imported file
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() === currentDateStr) {
            dateFound = true;
            // Skip the separator lines
            i += 2;
            // Read completion status
            while (i < lines.length && lines[i].trim() !== '' && !lines[i].includes('———————')) {
                const line = lines[i].trim();
                const parts = line.split(' ');
                const subject = parts[0];
                const status = parts.slice(1).join(' ');

                if (subjects.includes(subject)) {
                    completionStatus[subject] = status === 'Completed';
                }
                i++;
            }
            // The rest is reflection text
            reflectionText = lines.slice(i).join('\n').trim();
            break;
        }
    }

    if (dateFound) {
        // Update UI with imported data
        updateCompletionStatus();
        updateProgress();
        document.getElementById('dailyReflection').value = reflectionText;
        saveReflection();
        alert('Today\'s progress imported successfully!');
    } else {
        // If date not found, append the imported text to current reflection
        const currentReflection = document.getElementById('dailyReflection').value;
        document.getElementById('dailyReflection').value =
            currentReflection + (currentReflection ? '\n\n' : '') + importedText;
        saveReflection();
        alert('Imported data appended to reflections!');
    }
}

// Load saved data on page load
function loadSavedData() {
    const savedData = localStorage.getItem('dailyReflection');
    if (savedData) {
        processImportedData(savedData);
    }
}

// Initialize
loadSavedData();
updateCompletionStatus();
updateProgress();