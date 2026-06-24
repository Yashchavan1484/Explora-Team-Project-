function openLogin() {
    closeReg();
    let labels = document.querySelectorAll(".input-box .label");
    labels.forEach(label => {
        label.style.transition = "0.5s";
    });
    document.querySelector(".wrapper").classList.add("show");
}
function closeLogin() {
    let labels = document.querySelectorAll(".wrapper .input-box .label");
    let inputs = document.querySelectorAll(".wrapper .input-box input");

    labels.forEach(label => label.style.transition = "none");
    inputs.forEach(input => input.value = "");
    document.querySelector(".wrapper").classList.remove("show");
}
function openReg() {
    closeLogin();
    let labels = document.querySelectorAll(".input-box .label");
    labels.forEach(label => {
        label.style.transition = "0.5s";
    });
    document.querySelector(".wrapper2").classList.add("show");
}
function closeReg() {
    let labels = document.querySelectorAll(".input-box .label");
    labels.forEach(label => {
        label.style.transition = "none";
    });
    document.querySelector(".wrapper2").classList.remove("show");
}
document.querySelector(".button-login").onclick = function () {
        openLogin();
};
document.querySelector(".back-button").onclick= function () {
    closeLogin();
};
document.querySelector(".register-link").onclick = function () {
    openReg();
};
document.querySelector(".back-button2").onclick= function () {
    closeReg();
};
document.querySelector(".login-link").onclick = function () {
    openLogin();
};