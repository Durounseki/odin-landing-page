const gitIcon = document.querySelector("#github-page");
const gitURL = "https://github.com/Durounseki/odin-landing-page"
gitIcon.addEventListener('click',() => {
    const newWindow = window.open(gitURL,'_blank');
    newWindow.opener = nul;
} );