// =====================================================
// GLOBALE VARIABLEN
// =====================================================

let balkenChart = null;
let aktiveMemberId = null;
let aktiveDateFrom = null;
let aktiveDateTo = null;

// =====================================================
// HILFSFUNKTIONEN
// =====================================================

function setActiveName(name) {
  document
    .querySelectorAll(".streakContainer span, .begruessung span")
    .forEach((span) => {
      span.textContent = name;
    });
}

// =====================================================
// Funktion für den Streak, die beim Wechsel des aktiven Members aufgerufen wird
// =====================================================

async function loadStreak(memberId) {
  try {
    const response = await fetch(
      `../api/brush_streak.php?members_id=${encodeURIComponent(memberId)}`,
    );
    const result = await response.json();

    if (result.status === "success") {
      document.getElementById("anzahlTageStreak").textContent = result.streak;
    }
  } catch (error) {
    console.error("Fehler beim Laden des Streaks:", error);
  }
}

// =====================================================
// FLATPICKR DAYPICKER INITIALISIEREN
// =====================================================

flatpickr("#dateRange01", {
  mode: "range",
  dateFormat: "Y-m-d",
  locale: {
    rangeSeparator: " → ",
    weekdays: {
      shorthand: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
      longhand: [
        "Sonntag",
        "Montag",
        "Dienstag",
        "Mittwoch",
        "Donnerstag",
        "Freitag",
        "Samstag",
      ],
    },
    months: {
      shorthand: [
        "Jan",
        "Feb",
        "Mär",
        "Apr",
        "Mai",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Okt",
        "Nov",
        "Dez",
      ],
      longhand: [
        "Januar",
        "Februar",
        "März",
        "April",
        "Mai",
        "Juni",
        "Juli",
        "August",
        "September",
        "Oktober",
        "November",
        "Dezember",
      ],
    },
  },
  onChange(selectedDates, dateStr, instance) {
    if (selectedDates.length === 2) {
      aktiveDateFrom = instance.formatDate(selectedDates[0], "Y-m-d");
      aktiveDateTo = instance.formatDate(selectedDates[1], "Y-m-d");

      if (aktiveMemberId) {
        loadChartData(aktiveMemberId, aktiveDateFrom, aktiveDateTo);
      }
    }
  },
});

// =====================================================
// MEMBER-BUTTONS LADEN
// =====================================================

async function loadMemberButtons() {
  try {
    const response = await fetch("../api/members_load.php");
    const result = await response.json();

    const container = document.getElementById("mitgliederButtons");
    container.innerHTML = "";

    if (result.status === "success" && result.data.length > 0) {
      result.data.forEach((member, index) => {
        const btn = document.createElement("button");
        btn.textContent = member.name;
        btn.dataset.id = member.id;

        btn.addEventListener("click", () => {
          // Aktiven Button hervorheben
          container
            .querySelectorAll("button")
            .forEach((b) => b.classList.remove("aktiv-member"));
          btn.classList.add("aktiv-member");

          // Name im Streak-Titel aktualisieren
          setActiveName(member.name);
          aktiveMemberId = member.id;
          loadStreak(member.id);
          if (aktiveDateFrom && aktiveDateTo) {
            loadChartData(aktiveMemberId, aktiveDateFrom, aktiveDateTo);
          }
        });

        container.appendChild(btn);

        // Ersten Member standardmässig auswählen
        if (index === 0) {
          btn.classList.add("aktiv-member");
          aktiveMemberId = member.id;
          setActiveName(member.name);
          loadStreak(member.id);
          waitForDateAndLoad(member.id);
        }
      });

      if (result.data.length > 3) {
        container.classList.add("viele-mitglieder");
      } else {
        container.classList.remove("viele-mitglieder");
      }
    } else {
      container.innerHTML =
        "<p style='color:#b7e7fc'>Keine Mitglieder gefunden.</p>";
    }
  } catch (error) {
    console.error("Fehler beim Laden der Mitglieder:", error);
  }
}

// Wartet kurz, bis Flatpickr die Daten gesetzt hat
function waitForDateAndLoad(memberId) {
  const interval = setInterval(() => {
    if (aktiveDateFrom && aktiveDateTo) {
      clearInterval(interval);
      loadChartData(memberId, aktiveDateFrom, aktiveDateTo);
    }
  }, 50);
}

// =====================================================
// CHART DATEN LADEN & ZEICHNEN
// =====================================================

async function loadChartData(memberId, dateFrom, dateTo) {
  try {
    const url = `../api/brush_load.php?members_id=${encodeURIComponent(memberId)}&date_from=${encodeURIComponent(dateFrom)}&date_to=${encodeURIComponent(dateTo)}`;
    const response = await fetch(url);
    const result = await response.json();

    if (result.status !== "success") {
      console.error("Fehler:", result.message);
      return;
    }

    // Alle Tage im Zeitraum auffüllen (auch Tage ohne Eintrag = 0 Punkte)
    const alleDaten = fillDateRange(dateFrom, dateTo, result.data);

    drawChart(alleDaten);
  } catch (error) {
    console.error("Fehler beim Laden der Chart-Daten:", error);
  }
}

// Füllt fehlende Tage mit 0 auf
function fillDateRange(dateFrom, dateTo, data) {
  const map = {};
  data.forEach((row) => {
    map[row.tag] = parseInt(row.punkte, 10);
  });

  const result = [];
  const current = new Date(dateFrom);
  const end = new Date(dateTo);

  while (current <= end) {
    const key = current.toISOString().split("T")[0];
    result.push({
      tag: key,
      punkte: map[key] ?? 0,
    });
    current.setDate(current.getDate() + 1);
  }

  return result;
}

// =====================================================
// CHART ZEICHNEN
// =====================================================

function drawChart(daten) {
  const labels = daten.map((d) => {
    const date = new Date(d.tag);
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
    });
  });

  const punkte = daten.map((d) => d.punkte);
  const maxPunkte = Math.max(...punkte, 6); // mindestens 6, sonst dynamisch

  const ctx = document.getElementById("balkenChart").getContext("2d");

  if (balkenChart) {
    balkenChart.destroy();
  }

  balkenChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Punkte",
          data: punkte,
          backgroundColor: punkte.map((p) => {
            const ratio = maxPunkte > 0 ? p / maxPunkte : 0;
            if (ratio >= 0.8) return "rgba(180, 231, 252, 0.85)"; // fast voll: hellblau
            if (ratio >= 0.4) return "rgba(245, 199, 0, 0.85)"; // mittel: gelb
            if (p > 0) return "rgba(255, 150, 100, 0.85)"; // wenig: orange
            return "rgba(255, 255, 255, 0.15)"; // nichts: transparent
          }),
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) =>
              ` ${ctx.parsed.y} Punkt${ctx.parsed.y !== 1 ? "e" : ""}`,
          },
        },
      },
      scales: {
        y: {
          min: 0,
          max: 6,
          title: {
            display: true,
            text: "Erreichte Punkte",
            color: "#b7e7fc",
          },
          ticks: {
            stepSize: 1,
            color: "#b7e7fc",
            callback: (val) => val,
          },
          grid: { color: "rgba(183, 231, 252, 0.15)" },
        },
        x: {
          ticks: { color: "#b7e7fc", maxRotation: 45 },
          grid: { display: false },
        },
      },
    },
  });
}

// =====================================================
// START
// =====================================================

loadMemberButtons();
