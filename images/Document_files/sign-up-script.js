//Handle submission form
const signUpForm = document.querySelector("#sign-up-form");
const signUpButton = document.querySelector("#sign-up");
const welcomeMessage = document.querySelector("#welcome-message-container");
const inputs = signUpForm.querySelectorAll("input[required]");

inputs.forEach(input => input.addEventListener('input',showValid));


function showValid(event){
    const field = event.target;
    let validField = false;
    field.classList.remove("valid-input");

    if(field.validity.valid){
        validField = true;
    }
    //validity.valid works for required and patter mismatch, but not for passwords matching so we need to add this separately
    if(field.type === "password"){
        const password1 = document.querySelector("#password");
        const password2 = document.querySelector("#password2");
        if (password1.value !== password2.value){
             validField = false;
        }
    }
    if(validField){
        field.classList.add("valid-input");
    }
}

signUpButton.addEventListener('click',signUp);

function signUp(event){
    //Remove default messages
    event.preventDefault();
    //Remove error messages if already displayed
    resetErrorMessage();
    let hasInvalidInput = false;

    //Check the validity of the inputs
    for(let input of inputs){
        if(!input.validity.valid){
            displayErrorMessage(input,getErrorMessage(input));
            hasInvalidInput = true;
        }
        //validity.valid works for required and patter mismatch, but not for passwords matching so we need to add this separately
        if(input.type === "password"){
            const password1 = document.querySelector("#password");
            const password2 = document.querySelector("#password2");
            if (password1.value !== password2.value){
                displayErrorMessage(input,"\u26A0 Passwords do not match");
                hasInvalidInput = true;
            }
        }
    }
    //Display welcome message with redirect button to home page
    if (!hasInvalidInput){
        welcomeMessage.style.display = "flex";
    }

}

function resetErrorMessage() {
    const errorMessages = document.querySelectorAll(".error");
    //Remove error messages
    errorMessages.forEach(error => error.style.display = "none");
    //Remove colored borders
    signUpForm.querySelectorAll("input").forEach(input => {
        input.classList.remove("invalid-input");
    })
}

function getErrorMessage(input){
    const errorMessages = {
        required: "\u26A0 This field is required",
        maxlength: `\u26A0 The maximum number of characters is ${input.maxLength}`,
        email: "\u26A0 Please enter a valid email address"
    }

    if (input.validity.valueMissing) { return errorMessages.required; }
    if (input.validity.tooLong) { return errorMessages.maxlength; }
    if (input.validity.typeMismatch) { return errorMessages.email; }
    if (input.validity.patternMismatch) { return errorMessages.patternMismatch;}
}
function displayErrorMessage(input, message){
    input.classList.add("invalid-input");
    const errorMessage = document.createElement("p");
    errorMessage.className = "error";
    errorMessage.textContent = message;
    input.parentNode.appendChild(errorMessage);
}

const closeIcon = document.querySelector(".close-icon");
closeIcon.addEventListener('click',() => welcomeMessage.style.display = "none");