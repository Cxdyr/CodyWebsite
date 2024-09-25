function redirectToGitHub() {
    if (confirm("You're out of coins! Visit my GitHub profile and follow me to support the developer. You'll earn 1000 coins.")) {
        // Set the session flag to grant 1000 coins
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/set-github-flag", true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send();

        // Redirect to GitHub in a new tab
        window.open("https://github.com/Cxdyr", "_blank");

        // Redirect back to the casino page
        window.location.href = "/casino";
    }
}
