// Settings page script: elements and current user
const settingsMessage = document.getElementById("settingsMessage");
const settingsFields = document.getElementById("settingsFields");

let currentUser = null;

// show a short message in the settings area
function setMessage(text, isError = false) {
  settingsMessage.textContent = text;
  settingsMessage.style.color = isError ? "#b91c1c" : "#9333ea";
}

// load current user settings from server
async function loadSettings() {
  try {
    const response = await fetch("../api/settings.php", {
      credentials: "include",
    });

    if (response.status === 401) {
      window.location.href = "login.html";
      return;
    }

    const result = await response.json();

    if (result.status !== "success") {
      setMessage(result.message || "Die Kontodaten konnten nicht geladen werden.", true);
      return;
    }

    currentUser = result.data;
    renderSettings();
  } catch (error) {
    console.error("Error loading settings:", error);
    setMessage("Die Kontodaten konnten nicht geladen werden.", true);
  }
}

// send a single setting update to the server
async function updateSetting(field, value) {
  const response = await fetch("../api/settings.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ field, value }),
  });

  if (response.status === 401) {
    window.location.href = "login.html";
    return false;
  }

  const result = await response.json();

  if (result.status !== "success") {
    setMessage(result.message || "Die Änderung konnte nicht gespeichert werden.", true);
    return false;
  }

  setMessage(result.message || "Gespeichert.");
  return true;
}

// create a settings row with display and edit modes
function createRow(field, label, value, inputType, isSecret = false) {
  const row = document.createElement("div");
  row.className = "setting-row";

  const info = document.createElement("div");
  info.className = "setting-info";

  const labelElement = document.createElement("label");
  labelElement.className = "setting-label";
  labelElement.textContent = label;

  const valueElement = document.createElement("p");
  valueElement.className = "setting-value";
  valueElement.textContent = isSecret ? "********" : value || "Nicht gesetzt";

  const actions = document.createElement("div");
  actions.className = "setting-actions";

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "setting-button primary";
  editButton.textContent = "Bearbeiten";

  const renderDisplay = () => {
    row.classList.remove("editing");
    row.innerHTML = "";
    info.innerHTML = "";
    actions.innerHTML = "";

    valueElement.textContent = isSecret ? "********" : value || "Nicht gesetzt";
    info.appendChild(labelElement);
    info.appendChild(valueElement);
    actions.appendChild(editButton);
    row.appendChild(info);
    row.appendChild(actions);
  };

  const renderEdit = () => {
    row.classList.add("editing");
    row.innerHTML = "";
    info.innerHTML = "";
    actions.innerHTML = "";

    const editForm = document.createElement("div");
    editForm.className = "setting-edit-form";

    const input = document.createElement("input");
    input.className = "setting-input";
    input.type = inputType;
    input.placeholder = isSecret ? "Neues Passwort" : label;
    input.value = isSecret ? "" : value || "";

    if (field === "username") {
      input.maxLength = 20;
    }

    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.className = "setting-button primary";
    saveButton.textContent = "Speichern";

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className = "setting-button secondary";
    cancelButton.textContent = "Abbrechen";

    saveButton.addEventListener("click", async () => {
      const newValue = input.value.trim();

      if (!newValue) {
        setMessage("Bitte ein neues Feld ausfüllen.", true);
        return;
      }

      if (field === "username" && newValue.length > 20) {
        alert("Der nutzername darf nicht mehr als 20 Zeichen lang sein");
        return;
      }

      const success = await updateSetting(field, newValue);
      if (success) {
        await loadSettings();
      }
    });

    cancelButton.addEventListener("click", () => {
      renderDisplay();
    });

    editForm.appendChild(input);
    info.appendChild(labelElement);
    info.appendChild(editForm);
    actions.appendChild(saveButton);
    actions.appendChild(cancelButton);
    row.appendChild(info);
    row.appendChild(actions);
  };

  editButton.addEventListener("click", renderEdit);
  renderDisplay();
  return row;
}

function renderSettings() {
  settingsFields.innerHTML = "";

  if (!currentUser) {
    return;
  }

  settingsFields.appendChild(
    createRow("username", "Nutzername", currentUser.username, "text")
  );
  settingsFields.appendChild(
    createRow("email", "E-Mail", currentUser.email, "email")
  );
  settingsFields.appendChild(
    createRow("password", "Passwort", "********", "password", true)
  );
}

document.addEventListener("DOMContentLoaded", () => {
  loadSettings();

  const logoutBtn = document.getElementById("logoutBtn");

  // logout button wiring
  logoutBtn.addEventListener("click", async () => {
    try {
      const response = await fetch("../api/logout.php", {
        method: "POST",
        credentials: "include",
      });

      const result = await response.json();

      if (result.status === "success") {
        window.location.href = "login.html";
      } else {
        setMessage("Logout konnte nicht ausgeführt werden.", true);
      }
    } catch (error) {
      console.error("Error logging out:", error);
      setMessage("Logout konnte nicht ausgeführt werden.", true);
    }
  });
});
