document.addEventListener('DOMContentLoaded', function() {
    // Select all textarea elements with class 'no-paste' or ID 'responseInput'
    const noPasteElements = document.querySelectorAll('.no-paste, #responseInput');
    
    noPasteElements.forEach(function(element) {
        // Disable paste using the onpaste event
        element.addEventListener('paste', function(e) {
            e.preventDefault();
            
            // Show a message to the user
            const alertMessage = document.createElement('div');
            alertMessage.classList.add('alert', 'alert-warning', 'mt-2');
            alertMessage.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Pasting is not allowed. Please type your response.';
            
            // Insert the message after the textarea
            this.parentNode.insertBefore(alertMessage, this.nextSibling);
            
            // Remove the message after 3 seconds
            setTimeout(function() {
                alertMessage.remove();
            }, 3000);
            
            return false;
        });
        
        // Also disable context menu (right-click) to prevent paste from context menu
        element.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });
        
        // Disable keyboard shortcuts for paste (Ctrl+V or Command+V)
        element.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.keyCode === 86) {
                e.preventDefault();
                return false;
            }
        });
    });
});