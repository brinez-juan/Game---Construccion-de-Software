function inputFieldsListeners(){
    const usernameField = document.getElementById('username');
    usernameField.addEventListener('input', (event) =>{
        const usernameExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; 

        if(!usernameExp.test(usernameField.value)){
            usernameField.style.outlineColor = 'red'
        }
        else {
            usernameField.style.outlineColor = 'green';
        }
})
    const passwordField = document.getElementById('password');
    passwordField.addEventListener('input', (event) => {
        const passwordExp = /[a-zA-Z0-9!@#$%^&*]{8,16}$/
        if(!passwordExp.test(passwordField.value)){
            passwordField.style.outlineColor = 'red'
        }
        else {
            passwordField.style.outlineColor = 'green';
        }
    })
}

function main(){
    inputFieldsListeners(); 
}

main();