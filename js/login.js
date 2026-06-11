// login.js
const authMessage = document.getElementById("authMessage");
const loginButton = document.querySelector("#loginForm button[type='submit']");

let redirectTimer = null;

function setAuthMessage(text, isError = false) {
  authMessage.textContent = text;
  authMessage.classList.toggle("error", isError);
  authMessage.classList.toggle("success", !isError);
}

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  clearTimeout(redirectTimer);

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  loginButton.disabled = true;

  try {
    const response = await fetch("/api/login.php", {
      method: "POST",
      // credentials: 'include', // uncomment if front-end & back-end are on different domains
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json();

    if (result.status === "success") {
      setAuthMessage("Login erfolgreich. Du wirst weitergeleitet...");
      redirectTimer = setTimeout(() => {
        window.location.href = "home.html";
      }, 900);
    } else {
      setAuthMessage(result.message || "Login fehlgeschlagen.", true);
    }
  } catch (error) {
    console.error("Error:", error);
    setAuthMessage("Etwas ist schiefgelaufen.", true);
  } finally {
    loginButton.disabled = false;
  }
});
