// Login Form Handler
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    const errorMessage = document.getElementById('errorMessage');

    // Check against registered users first
    let users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const registeredUser = users.find(user => user.username === username && user.password === password);

    // Simple authentication (in production, this would be server-side)
    if (username === 'admin' && password === 'admin123') {
        // Default admin login
        sessionStorage.setItem('user', JSON.stringify({
            username: username,
            fullname: 'Administrator',
            role: role,
            loginTime: new Date().toISOString()
        }));

        // Redirect to admin dashboard
        window.location.href = 'admin.html';
    } else if (registeredUser) {
        // Registered user login
        sessionStorage.setItem('user', JSON.stringify({
            username: registeredUser.username,
            fullname: registeredUser.fullname,
            role: registeredUser.role,
            email: registeredUser.email,
            loginTime: new Date().toISOString()
        }));

        // Redirect to admin dashboard
        window.location.href = 'admin.html';
    } else {
        // Show error message
        errorMessage.textContent = 'Invalid username or password. Please try again.';
        errorMessage.classList.add('show');

        // Hide error after 3 seconds
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 3000);
    }
});

// Auto-fill demo credentials (for development)
document.addEventListener('DOMContentLoaded', function () {
    // Check if user is already logged in
    const user = sessionStorage.getItem('user');
    if (user) {
        window.location.href = 'admin.html';
    }
});
