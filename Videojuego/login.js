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

function main(){
    signInFieldsListeners();
    stateButtonEvents();  
}

main();