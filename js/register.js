// register.js
const authMessage = document.getElementById("authMessage");
const registerButton = document.querySelector("#registerForm button[type='submit']");

let redirectTimer = null;

function setAuthMessage(text, isError = false) {
  authMessage.textContent = text;
  authMessage.classList.toggle("error", isError);
  authMessage.classList.toggle("success", !isError);
}

// register form: create account and auto-add member
document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    clearTimeout(redirectTimer);

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username.length > 20) {
      setAuthMessage("Der Nutzername darf nicht mehr als 20 Zeichen lang sein.", true);
      return;
    }

    registerButton.disabled = true;

    try {
      const response = await fetch("../api/register.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
      const result = await response.json();

      if (result.status === "success") {
        setAuthMessage("Registrierung erfolgreich. Du wirst weitergeleitet...");
        redirectTimer = setTimeout(() => {
          window.location.href = "../pages/login.html";
        }, 900);
      } else {
        setAuthMessage(result.message || "Registrierung fehlgeschlagen.", true);
      }
    } catch (error) {
      console.error("Error:", error);
      setAuthMessage("Etwas ist schiefgelaufen.", true);
    } finally {
      registerButton.disabled = false;
    }
  });
