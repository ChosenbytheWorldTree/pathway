document.addEventListener('DOMContentLoaded', function() {
    // Initialize with May 9, 2025 as in the original design
    let currentDate = new Date(2025, 4, 9);
    // DOM elements
    const currentDateElement = document.getElementById('currentDate');
    const dateFooterElement = document.getElementById('dateFooter');
    const prevDayButton = document.getElementById('prevDay');
    const nextDayButton = document.getElementById('nextDay');
    const todayButton = document.getElementById('today');
    const moveButtons = document.querySelectorAll('.move-btn');
    
    // Format date for header (e.g., "9 MAY 2025")
    function formatHeaderDate(date) {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-US', options).toUpperCase();
    }
    
    // Format date for footer (e.g., "09.05.2025")
    function formatFooterDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }
    
    // Update the displayed dates
    function updateDates() {
        currentDateElement.textContent = formatHeaderDate(currentDate);
        dateFooterElement.textContent = formatFooterDate(currentDate);
    }

    updateDates();
});