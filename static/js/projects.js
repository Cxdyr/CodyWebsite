document.addEventListener("DOMContentLoaded", function() {
    const projectsContainer = document.getElementById("projects-container");
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get("id");
    
    // Determine if we're on the project detail page
    const isProjectDetailPage = window.location.pathname.includes("project.html");
    const isProjectsListPage = projectsContainer !== null;

    fetch("static/projects.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(projects => {
            if (isProjectDetailPage && projectId) {
                loadProjectDetails(projects, projectId);
            } else if (isProjectsListPage) {
                loadProjectsList(projects, projectsContainer);
            }
        })
        .catch(error => {
            console.error("Error loading projects:", error);
            if (isProjectDetailPage) {
                document.body.innerHTML = "<h1>Error: Could not load project details</h1><a href='projects.html' class='link-box'>Back to Projects</a>";
            } else if (isProjectsListPage) {
                projectsContainer.innerHTML = "<h3>Error loading projects. Please try again later.</h3>";
            }
        });
});

// Function to determine icon based on project title
function getProjectIconClass(title) {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes("web") || lowerTitle.includes("website")) {
        return "fas fa-globe";
    } else if (lowerTitle.includes("python")) {
        return "fab fa-python";
    } else if (lowerTitle.includes("c++")) {
        return "fab fa-cuttlefish";
    } else if (lowerTitle.includes("js") || lowerTitle.includes("javascript")) {
        return "fab fa-js";
    } else if (lowerTitle.includes("chat")) {
        return "fas fa-comment-dots";
    } else if (lowerTitle.includes("game")) {
        return "fas fa-gamepad";
    } else if (lowerTitle.includes("fitness")) {
        return "fas fa-dumbbell";
    } else if (lowerTitle.includes("tracker")) {
        return "fas fa-chart-line";
    } else if (lowerTitle.includes("scraper")) {
        return "fas fa-spider";
    } else if (lowerTitle.includes("machine learning") || lowerTitle.includes("ai")) {
        return "fas fa-brain";
    } else {
        return "fas fa-code";
    }
}

// Function to load project details
function loadProjectDetails(projects, projectId) {
    const project = projects.find(p => p.id === projectId);
    
    if (!project) {
        document.body.innerHTML = "<h1>Error: Project not found</h1><a href='projects.html' class='link-box'>Back to Projects</a>";
        return;
    }
    
    // Set the project title and name
    document.title = project.title + " | Cody Rabie";
    document.getElementById("project-name").textContent = project.title;
    
    // Set the project description and details
    document.getElementById("project-description").textContent = project.description;
    document.getElementById("project-details").textContent = project.details;
    
    // Update the icon in the header
    const iconClass = getProjectIconClass(project.title);
    const projectIcon = document.querySelector(".project-icon");
    if (projectIcon) {
        projectIcon.className = iconClass + " project-icon";
    }
    
    // Set GitHub link
    const githubLink = document.getElementById("github-link");
    if (project.gitpage && project.gitpage.trim() !== "") {
        githubLink.href = project.gitpage;
        githubLink.style.display = "inline-block";
    } else {
        githubLink.style.display = "none";
    }

    // Handle URL/iframe display logic
    const iframeContainer = document.getElementById("iframe-container");
    const projectIframe = document.getElementById("project-iframe");
    const redirectLink = document.getElementById("redirect-url");

    if (!project.url || project.url.trim() === "") {
        // No URL provided, hide both iframe and redirect link
        iframeContainer.style.display = "none";
        redirectLink.style.display = "none";
    } else if (project.url.includes("youtube.com") || project.url.includes("embed")) {
        // YouTube video or embeddable content
        projectIframe.src = project.url;
        iframeContainer.style.display = "block";
        redirectLink.style.display = "none";
    } else {
        // Direct website link
        iframeContainer.style.display = "none";
        redirectLink.href = project.url;
        redirectLink.style.display = "inline-block";
    }
}

// Function to load projects list
function loadProjectsList(projects, container) {
    // Clear any existing content
    container.innerHTML = "";
    
    // Create project cards
    projects.forEach(project => {
        const projectCard = document.createElement("div");
        projectCard.className = "project-card";
        
        // Determine icon based on project technologies
        const iconClass = getProjectIconClass(project.title);
        
        projectCard.innerHTML = `
            <div class="project-image">
                <i class="${iconClass}"></i>
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description.substring(0, 150)}${project.description.length > 150 ? '...' : ''}</p>
                <a href="project.html?id=${project.id}" class="project-link">View Project</a>
            </div>
        `;
        
        container.appendChild(projectCard);
    });
}