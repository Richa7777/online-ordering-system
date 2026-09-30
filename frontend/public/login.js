
const signinForm = document.getElementById('signin-form');
const errorMessage = document.getElementById('error-message');
const togglePassword = document.getElementById('toggle-password');
const passwordInput = document.getElementById('password');


// =========================
// PASSWORD SHOW / HIDE
// =========================

togglePassword.addEventListener('click', (e) => {
    e.preventDefault();

    const isHidden = passwordInput.type === 'password';

    passwordInput.type = isHidden ? 'text' : 'password';

    const icon = togglePassword.querySelector('i');

    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
});


// =========================
// LOGIN
// =========================

signinForm.addEventListener('submit', async (e) => {

    e.preventDefault();

    errorMessage.style.color = '#d33';
    errorMessage.textContent = '';


    const email = document.getElementById('email').value.trim();
    const password = passwordInput.value;
    const role = document.getElementById('role').value;


    // -------------------------
    // BASIC VALIDATION
    // -------------------------

    if (!email || !password || !role) {

        errorMessage.textContent =
            'Please fill in all fields.';

        return;
    }


    try {

        const response = await fetch('http://127.0.0.1:8080/api/auth/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
                role
            })
        });

        const contentType =
            response.headers.get('content-type') || '';

        let data = {};

        if (contentType.includes('application/json')) {
            data = await response.json();
        }

        if (!response.ok) {

            errorMessage.textContent =
                data.error ||
                data.message ||
                'Sign in failed. Please check your details.';

            return;
        }

        errorMessage.style.color = 'green';

        errorMessage.textContent =
            'Signed in! Redirecting...';


        const dashboards = {

            CUSTOMER: '../customer/index.html',

            RIDER: '../rider/index.html',

            ADMIN: '../admin/index.html'

        };


        const redirectTo =
            dashboards[data.role] || '../index.html';


        setTimeout(() => {

            window.location.href = redirectTo;

        }, 800);


    } catch (err) {

        errorMessage.style.color = '#d33';

        errorMessage.textContent =
            'Could not reach the server. Is the backend running?';

        console.error(
            'Login error:',
            err
        );

    }

});
