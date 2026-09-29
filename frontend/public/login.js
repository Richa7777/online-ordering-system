const signinForm = document.getElementById('signin-form');
const errorMessage = document.getElementById('error-message');
const togglePassword = document.getElementById('toggle-password');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', (e) => {
    e.preventDefault();
    const isHidden = passwordInput.type === 'password';
    passwordInput.type = isHidden ? 'text' : 'password';

    const icon = togglePassword.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
});

signinForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.style.color = '#d33';
    errorMessage.textContent = '';

    const email = document.getElementById('email').value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        errorMessage.textContent = 'Please fill in both fields.';
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            // Backend sends {"error": "Invalid email or password."} for bad credentials (401)
            errorMessage.textContent = data.error || data.message || 'Sign in failed. Please try again.';
            return;
        }

        // Store the logged-in user's info for use across the site.
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', data.id);
        localStorage.setItem('userName', data.name);
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userRole', data.role);

        errorMessage.style.color = 'green';
        errorMessage.textContent = 'Signed in! Redirecting...';

        // If the user was sent here from a locked page, send them back there.
        const redirectTo = localStorage.getItem('redirectAfterLogin') || 'index.html';
        localStorage.removeItem('redirectAfterLogin');

        setTimeout(() => {
            window.location.href = redirectTo;
        }, 800);

    } catch (err) {
        errorMessage.textContent = 'Could not reach the server. Is the backend running?';
        console.error('Login error:', err);
    }
});