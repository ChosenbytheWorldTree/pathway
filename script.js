document.addEventListener('DOMContentLoaded', function() {
  // Initialize
  const subjects = [
    "ENGLISH", "ALGORITHMS", "PYTHON", "ROBOTICS",
    "MATH", "PHISICS", "PROJECT", "PORTFOLIO", "TEST", "PREP"
  ];
  
  // 1. Progress Tracking
  function updateProgress() {
    const completed = subjects.filter(sub => 
      localStorage.getItem(`completed_${sub}`) === 'true').length;
    const percent = Math.round((completed / subjects.length) * 100);
    
    document.querySelector('.progress-percent').textContent = `${percent}%`;
    document.querySelector('.progress-fill').style.strokeDashoffset = 314 - (3.14 * percent);
  }
  
  // 2. Streak Counter
  function updateStreak() {
    const lastCompleted = localStorage.getItem('lastCompletedDate');
    const today = new Date().toDateString();
    
    if (lastCompleted === today) return;
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const streak = lastCompleted === yesterday.toDateString() 
      ? parseInt(localStorage.getItem('streak') || 0) + 1 
      : 1;
    
    localStorage.setItem('streak', streak);
    localStorage.setItem('lastCompletedDate', today);
    document.getElementById('streak').textContent = streak;
  }
  
  // 3. Task Completion
  subjects.forEach((subject, index) => {
    const btn = document.querySelectorAll('.complete-btn')[index];
    btn.addEventListener('click', function() {
      const isCompleted = localStorage.getItem(`completed_${subject}`) === 'true';
      localStorage.setItem(`completed_${subject}`, !isCompleted);
      updateProgress();
      updateStreak();
    });
  });
  
  // 4. Pomodoro Timer
  document.querySelector('.start-timer').addEventListener('click', function() {
    let minutes = 25;
    let seconds = 0;
    
    const timer = setInterval(() => {
      document.querySelector('.timer').textContent = 
        `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
      
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(timer);
          alert("Time's up! Take a 5 minute break");
          return;
        }
        minutes--;
        seconds = 59;
      } else {
        seconds--;
      }
    }, 1000);
  });
  
  // 5. Load Motivational Quote
  fetch('https://api.quotable.io/random?tags=motivational')
    .then(response => response.json())
    .then(data => {
      document.getElementById('quote').innerHTML = `
        <p>"${data.content}"</p>
        <small>- ${data.author}</small>
      `;
    });
  
  // Initialize displays
  updateProgress();
  updateStreak();
});