
let clickedButton = null;

document.getElementById("loginBtn").addEventListener("click", function () {
    clickedButton = "login";
});

document.getElementById("cancelBtn").addEventListener("click", function () {
    clickedButton = "cancel";
});

document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (clickedButton === "login") {
        if (username === "admin" && password === "1234") {
            // Redirect on successful login
            window.location.href = "index_logged_in.html";
        } else {
            alert("Incorrect username or password.");
        }
    } else if (clickedButton === "cancel") {
        // Redirect to another page
        window.location.href = "Index.html";
    }
});