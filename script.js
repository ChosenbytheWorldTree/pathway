document.addEventListener('DOMContentLoaded', function() {
    
    // Get today's date
    const today = new Date();
    
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
    document.getElementById('currentDate').textContent = formatHeaderDate(today);
    document.getElementById('dateFooter').textContent = formatFooterDate(today);
    
    // Button click handlers
    document.querySelectorAll('.move-btn').forEach(button => {
        const subject = button.parentElement.previousElementSibling.textContent;
        button.addEventListener('click', () => {
            console.log(`Moving to ${subject} for ${formatHeaderDate(today)}`);
            // Add your navigation logic here
        });
    });
});
