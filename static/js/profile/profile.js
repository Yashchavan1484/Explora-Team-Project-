function goBack() {
    window.history.back();
}
function editProfile() {
    let newName = prompt("Enter new name:", "Bhadwe nam rakh jaldi");
    let newBio = prompt("Enter new bio:", "esthetics ka choda");
    if (newName) document.getElementById("username").innerText = newName;
    if (newBio) document.getElementById("user-bio").innerText = newBio;
}