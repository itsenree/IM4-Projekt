document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("../api/protected.php", {
      credentials: "include",
    });

    if (response.status === 401) {
      window.location.href = "login.html";
      return;
    }

    const result = await response.json();

    if (result.status === "success" && result.username) {
      document.getElementById("homeUsername").textContent = result.username;
    }
  } catch (error) {
    console.error("Error loading home user data:", error);
  }
});// ---------------- To do: STREAK LOGIC ----------------

// 1. Für jedes Familienmitglied: Hole alle gespeicherten Sessions
//    --> Jede Session hat ein Datum und eine Dauer (in Sekunden)

// 2. Prüfe pro Tag & pro Mitglied, ob das Tagesziel erreicht wurde
//    --> Mindestens 3 Sessions an diesem Tag
//    --> Jede Session mindestens 120 Sekunden lang
//    --> Wenn beide Bedingungen erfüllt: Tag gilt als "erfolgreich"

// 3. Berechne den persönlichen Streak pro Mitglied
//    --> Starte beim heutigen Tag, gehe tageweise rückwärts
//    --> Zähle aufeinanderfolgende erfolgreiche Tage
//    --> Stoppe sobald ein Tag fehlt oder nicht erfolgreich war

// 4. Berechne den Familienstreak
//    --> Vergleiche alle 4 persönlichen Streaks
//    --> Nimm den kleinsten Wert → das ist der Familienstreak

// 5. Ermittle den Champion der Woche
//    --> Vergleiche alle 4 persönlichen Streaks
//    --> Nimm den grössten Wert → das ist der Champion
