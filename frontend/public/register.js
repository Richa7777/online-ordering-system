const signupForm = document.getElementById('signup-form');
const errorMessage = document.getElementById('error-message');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');

// Wires up an eye icon to show/hide a given password field.
function setupPasswordToggle(toggleId, inputEl) {
    const toggle = document.getElementById(toggleId);
    toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const isHidden = inputEl.type === 'password';
        inputEl.type = isHidden ? 'text' : 'password';

        const icon = toggle.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });
}

setupPasswordToggle('toggle-password', passwordInput);
setupPasswordToggle('toggle-confirm-password', confirmPasswordInput);

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.style.color = '#d33';
    errorMessage.textContent = '';

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!name || !email || !password || !confirmPassword) {
        errorMessage.textContent = 'Please fill in all fields.';
        return;
    }

    if (password.length < 6) {
        errorMessage.textContent = 'Password must be at least 6 characters.';
        return;
    }

    if (password !== confirmPassword) {
        errorMessage.textContent = 'Passwords do not match.';
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            // Backend sends back {"error": "..."} for conflicts (409),
            // or validation messages for bad input (400).
            errorMessage.textContent = data.error || data.message || 'Registration failed. Please try again.';
            return;
        }

        errorMessage.style.color = 'green';
        errorMessage.textContent = 'Account created! Redirecting to sign in...';

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 800);

    } catch (err) {
        // This branch fires if the backend isn't running at all, or a network/CORS issue occurred.
        errorMessage.textContent = 'Could not reach the server. Is the backend running?';
        console.error('Registration error:', err);
    }
});