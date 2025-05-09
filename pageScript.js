// Display current date
const today = new Date();
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
document.getElementById('currentDate').textContent = today.toLocaleDateString('en-US', options);

// Task completion tracking
const completeButtons = document.querySelectorAll('.complete-btn');
const taskStatus = document.getElementById('taskStatus');
let completedTasks = 0;
const totalTasks = completeButtons.length;

completeButtons.forEach(button => {
    button.addEventListener('click', function () {
        if (!this.classList.contains('completed')) {
            this.classList.add('completed');
            this.textContent = '✓ Completed';
            this.style.backgroundColor = '#2ecc71';
            completedTasks++;
            updateProgress();
        }
    });
});

function updateProgress() {
    taskStatus.innerHTML = `<strong>Progress:</strong> ${completedTasks}/${totalTasks} tasks completed (${Math.round((completedTasks / totalTasks) * 100)}%)`;
}

// Save reflection
document.getElementById('saveReflection').addEventListener('click', function () {
    const reflection = document.getElementById('dailyReflection').value;
    if (reflection.trim() !== '') {
        localStorage.setItem('dailyReflection', reflection);
        alert('Reflection saved locally!');
    }
});

// Download functionality
document.getElementById('downloadBtn').addEventListener('click', function () {
    const reflection =  today.toLocaleDateString('en-US', options)+"\n"+"\n"+document.getElementById('dailyReflection').value;
    const date = new Date();
    const filename = `reflection_${date.toISOString().split('T')[0]}.txt`;

    const blob = new Blob([reflection], { type: 'text/plain' });
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
        const currentText = document.getElementById('dailyReflection').value;

        // Combine imported text with existing text
        document.getElementById('dailyReflection').value =
            currentText + (currentText ? '\n\n' : '') + importedText;

        // Save the combined text
        localStorage.setItem('dailyReflection', document.getElementById('dailyReflection').value);
    };
    reader.readAsText(file);

    // Reset file input to allow re-importing the same file
    e.target.value = '';
});

// Load saved reflection on page load
const savedReflection = localStorage.getItem('dailyReflection');
if (savedReflection) {
    document.getElementById('dailyReflection').value = savedReflection;
}