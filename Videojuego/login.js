function signInFieldsListeners(){
    const usernameField = document.getElementById('sign-mail');
    usernameField.addEventListener('input', (event) =>{
        const usernameExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; 

        if(!usernameExp.test(usernameField.value)){
            usernameField.style.outlineColor = 'red'
        }
        else {
            usernameField.style.outlineColor = 'green';
        }
    })
    const passwordField = document.getElementById('sign-password');
    passwordField.addEventListener('input', (event) => {
        const passwordExp = /[a-zA-Z0-9!@#$%^&*]{8,}$/
        if(!passwordExp.test(passwordField.value)){
            passwordField.style.outlineColor = 'red'
        }
        else {
            passwordField.style.outlineColor = 'green';
        }
    })
}

function stateButtonEvents(){
    $('#sign-button').click(function(){
        $('.login-menu').fadeOut();
        $('.sign-menu').fadeIn();
        $('.login-menu input').val('')
    })
    $('#log-button').click(function(){
        $('.sign-menu').fadeOut();
        $('.login-menu').fadeIn();
        $('.sign-menu input').val('')
    })
}

function registerSubmitListener(){
    const submitButton = document.getElementById('sign-submit');
    const messageEl = document.getElementById('sign-message');

    submitButton.addEventListener('click', async (event) => {
        event.preventDefault();
        messageEl.style.color = '';
        messageEl.textContent = 'Creating account…';

        const email = document.getElementById('sign-mail').value.trim();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('sign-password').value;

        if (!email || !username || !password) {
            messageEl.style.color = 'red';
            messageEl.textContent = 'All fields are required.';
            return;
        }

        try {
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                messageEl.style.color = 'red';
                messageEl.textContent = data.message || 'Registration failed.';
                return;
            }

            localStorage.setItem('authToken', data.token);
            localStorage.setItem('authUser', JSON.stringify(data.user));

            messageEl.style.color = 'green';
            messageEl.textContent = 'Account created! Redirecting…';
            window.location.href = 'game.html';
        } catch (err) {
            messageEl.style.color = 'red';
            messageEl.textContent = 'Network error. Please try again.';
            console.error('Register request failed:', err);
        }
    });
}

function loginSubmitListener(){
    const submitButton = document.getElementById('login-submit');
    const messageEl = document.getElementById('login-message');

    submitButton.addEventListener('click', async (event) => {
        event.preventDefault();
        messageEl.style.color = '';
        messageEl.textContent = 'Signing in…';

        const identifier = document.getElementById('mail').value.trim();
        const password = document.getElementById('password').value;

        if (!identifier || !password) {
            messageEl.style.color = 'red';
            messageEl.textContent = 'Email/username and password are required.';
            return;
        }

        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, password })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                messageEl.style.color = 'red';
                messageEl.textContent = data.message || 'Login failed.';
                return;
            }

            localStorage.setItem('authToken', data.token);
            localStorage.setItem('authUser', JSON.stringify(data.user));

            messageEl.style.color = 'green';
            messageEl.textContent = 'Welcome back. Redirecting…';
            window.location.href = 'game.html';
        } catch (err) {
            messageEl.style.color = 'red';
            messageEl.textContent = 'Network error. Please try again.';
            console.error('Login request failed:', err);
        }
    });
}

function main(){
    signInFieldsListeners();
    stateButtonEvents();
    registerSubmitListener();
    loginSubmitListener();
}

main();