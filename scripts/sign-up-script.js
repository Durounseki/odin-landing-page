const signUpForm = document.querySelector("#sign-up-form");
const signUpButton = document.querySelector("#sign-up");
const welcomeMessage = document.querySelector("#welcome-message-container");

signUpButton.addEventListener('click',signUp);

function signUp(event){
    event.preventDefault();
    resetErrorMessage();
    let hasInvalidInput = false;
    const requiredInputs = signUpForm.querySelectorAll("input[required]");

    for(let input of requiredInputs){
        if(!input.validity.valid){
            displayErrorMessage(input);
            hasInvalidInput = true;
        }
    }

    if (!hasInvalidInput){
        welcomeMessage.style.display = "block";
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

function displayErrorMessage(input){
    input.classList.add("invalid-input");
    const errorMessage = document.createElement("p");
    errorMessage.className = "error";
    errorMessage.textContent = "\u26A0 This field is required";
    input.parentNode.appendChild(errorMessage);
}

const closeIcon = document.querySelector(".close-icon");
closeIcon.addEventListener('click',() => welcomeMessage.style.display = "none");