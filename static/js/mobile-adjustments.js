// mobile-adjustments.js
// Add this script to your pages to improve mobile experience without affecting desktop

document.addEventListener('DOMContentLoaded', function() {
    // Only apply these changes on mobile devices
    function applyMobileAdjustments() {
        // Check if we're on a mobile device
        if (window.innerWidth <= 768) {
            // Adjust background patterns for better mobile appearance
            const geoPattern = document.querySelector('.geometric-pattern');
            if (geoPattern) {
                // Make the geometric pattern less intrusive on mobile
                geoPattern.style.opacity = '0.4';
            }
            
            // Fix home links positioning on mobile
            const homeLinks = document.querySelectorAll('.home-links');
            homeLinks.forEach(linkSection => {
                linkSection.style.margin = '20px auto';
                // Add background to links on index page for better visibility
                const links = linkSection.querySelectorAll('a');
                links.forEach(link => {
                    // Only apply if not already styled
                    if (!link.hasAttribute('data-mobile-styled')) {
                        link.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                        link.style.borderRadius = '8px';
                        link.style.padding = '8px 15px';
                        link.style.marginBottom = '12px';
                        link.style.textAlign = 'center';
                        link.style.display = 'inline-block';
                        link.setAttribute('data-mobile-styled', 'true');
                    }
                });
            });
            
            // Make project cards better on mobile
            const projectCards = document.querySelectorAll('.project-card');
            projectCards.forEach(card => {
                card.style.marginBottom = '20px';
            });
            
            // Switch coursework to single column on mobile
            const coursework = document.querySelector('.coursework');
            if (coursework) {
                coursework.style.columns = '1';
            }
            
            // Add space between skill items
            const skillItems = document.querySelectorAll('.skill-item');
            skillItems.forEach(item => {
                item.style.margin = '5px';
            });
        }
    }
    
    // Run once on page load
    applyMobileAdjustments();
    
    // Also run when window is resized
    window.addEventListener('resize', applyMobileAdjustments);
});