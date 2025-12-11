// Register Form Handler
document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = document.getElementById('role').value;
    const terms = document.getElementById('terms').checked;
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    // Clear previous messages
    errorMessage.classList.remove('show');
    successMessage.classList.remove('show');

    // Validation
    if (password !== confirmPassword) {
        errorMessage.textContent = 'Passwords do not match!';
        errorMessage.classList.add('show');
        return;
    }

    if (password.length < 6) {
        errorMessage.textContent = 'Password must be at least 6 characters long!';
        errorMessage.classList.add('show');
        return;
    }

    if (!terms) {
        errorMessage.textContent = 'You must agree to the Terms and Conditions!';
        errorMessage.classList.add('show');
        return;
    }

    // Get existing users from localStorage
    let users = JSON.parse(localStorage.getItem('registeredUsers')) || [];

    // Check if username already exists
    const userExists = users.find(user => user.username === username);
    if (userExists) {
        errorMessage.textContent = 'Username already exists! Please choose another.';
        errorMessage.classList.add('show');
        return;
    }

    // Check if email already exists
    const emailExists = users.find(user => user.email === email);
    if (emailExists) {
        errorMessage.textContent = 'Email already registered! Please use another email.';
        errorMessage.classList.add('show');
        return;
    }

    // Create new user object
    const newUser = {
        fullname: fullname,
        email: email,
        username: username,
        password: password, // In production, this should be hashed
        role: role,
        registeredAt: new Date().toISOString()
    };

    // Add to users array
    users.push(newUser);

    // Save to localStorage
    localStorage.setItem('registeredUsers', JSON.stringify(users));

    // Show success message
    successMessage.textContent = 'Registration successful! Redirecting to login...';
    successMessage.classList.add('show');

    // Redirect to login page after 2 seconds
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
});

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', function () {
    const user = sessionStorage.getItem('user');
    if (user) {
        window.location.href = 'admin.html';
    }
});
