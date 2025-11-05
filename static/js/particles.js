// Mouse particle effect
document.addEventListener("mousemove", (event) => {
    // Throttle particle creation for better performance
    if (!window.lastParticleTime || Date.now() - window.lastParticleTime > 50) {
        window.lastParticleTime = Date.now();
        createParticle(event.clientX, event.clientY);
    }
    
    // Interactive effect for floating shapes
    const floatingShapes = document.querySelectorAll('.floating-shape');
    if (floatingShapes.length > 0) {
        const mouseX = event.clientX / window.innerWidth;
        const mouseY = event.clientY / window.innerHeight;
        
        floatingShapes.forEach((shape, index) => {
            const offsetX = (mouseX - 0.5) * 20 * (index % 3 + 1);
            const offsetY = (mouseY - 0.5) * 20 * (index % 2 + 1);
            shape.style.transform = `translate(${offsetX}px, ${offsetY}px) ${shape.classList.contains('floating-square') ? 'rotate(45deg)' : ''}`;
        });
    }
});

// Function to create particles
function createParticle(mouseX, mouseY) {
    const container = document.querySelector('.slide1');
    if (!container) return;
    
    const particle = document.createElement("div");
    particle.classList.add("particle");

    // Set the initial position of the particle at the mouse coordinates
    particle.style.left = `${mouseX - 5}px`;  // Center the particle
    particle.style.top = `${mouseY - 5}px`;   // Center the particle

    // Random direction and distance for particle movement
    const randomX = (Math.random() - 0.5) * 80;
    const randomY = (Math.random() - 0.5) * 80;

    // Setting the custom properties for the animation
    particle.style.setProperty('--x', `${randomX}px`);
    particle.style.setProperty('--y', `${randomY}px`);

    // Append the particle to the container
    container.appendChild(particle);

    // Remove the particle after animation ends
    setTimeout(() => {
        if (particle.parentNode === container) {
            container.removeChild(particle);
        }
    }, 1000);
}

// Interactive effect for the code lines and geometric patterns
document.addEventListener('mousemove', function(e) {
    // Get the geometric pattern elements
    const geoElements = document.querySelectorAll('.geo-element');
    const codeLines = document.querySelectorAll('.code-line');
    
    if (geoElements.length > 0) {
        // Calculate mouse position relative to the center of the screen
        const mouseX = e.clientX - window.innerWidth / 2;
        const mouseY = e.clientY - window.innerHeight / 2;
        
        // Apply subtle movement to each geometric element based on mouse position
        geoElements.forEach((element, index) => {
            const factor = (6 - index) * 0.005; // More movement for larger elements
            const translateX = mouseX * factor;
            const translateY = mouseY * factor;
            const rotation = element.classList.contains('geo-square') ? 'rotate(45deg)' : '';
            element.style.transform = `translate(${translateX}px, ${translateY}px) ${rotation}`;
        });
    }
    
    if (codeLines.length > 0) {
        // Calculate mouse position relative to the viewport
        const mouseXPercent = e.clientX / window.innerWidth;
        
        // Apply subtle stretching to each code line based on mouse X position
        codeLines.forEach((line, index) => {
            const baseWidth = parseInt(line.style.width);
            const stretchFactor = 1 + ((mouseXPercent - 0.5) * 0.2);
            line.style.width = `${baseWidth * stretchFactor}%`;
        });
    }
});

// Add event listener for scroll to create parallax effect
window.addEventListener('scroll', function() {
    const scrollY = window.scrollY;
    const geoPattern = document.querySelector('.geometric-pattern');
    const floatingShapes = document.querySelectorAll('.floating-shape');
    
    if (geoPattern) {
        geoPattern.style.transform = `translateY(${scrollY * 0.1}px)`;
    }
    
    if (floatingShapes.length > 0) {
        floatingShapes.forEach((shape, index) => {
            const factor = 0.05 + (index * 0.01);
            shape.style.transform = `translateY(${scrollY * factor}px) ${shape.classList.contains('floating-square') ? 'rotate(45deg)' : ''}`;
        });
    }
});

// Create initial particles on page load to attract attention
document.addEventListener('DOMContentLoaded', function() {
    // Create initial particles at random positions
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * (window.innerHeight / 2); // Only in the top half
            createParticle(x, y);
        }, i * 300); // Stagger the creation
    }
});
