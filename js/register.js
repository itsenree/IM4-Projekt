console.log("Register.js ist verbunden!");

document.getElementById("registerForm")
.addEventListener("submit", async (e) => {
    // hier wird hingeschrieben was beim submit passiert
    e.preventDefault();
console.log("Submit");
});