// =====================================================
// Global variables
// =====================================================
// chart instance, selected member and current user
let balkenChart = null;
let aktiveMemberId = null;
let aktuellerBenutzername = null;
let flatpickrInstance = null;

// =====================================================
// HILFSFUNKTIONEN
// =====================================================

// format a Date object as YYYY-MM-DD
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// return Monday..Sunday range for the current week
function getCurrentWeekRange() {
  const today = new Date();
  const mondayOffset = (today.getDay() + 6) % 7;

  const start = new Date(today);
  start.setDate(today.getDate() - mondayOffset);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return { start, end };
}

// update displayed active member name in headings
function setActiveName(name) {
  document
    .querySelectorAll(".streakContainer span, .begruessung span")
    .forEach((span) => {
      span.textContent = name;
    });
}

async function loadCurrentUser() {
  try {
    const response = await fetch("../api/protected.php", {
      credentials: "include",
    });

    if (response.status === 401) {
      window.location.href = "login.html";
      return null;
    }

    const result = await response.json();

    if (result.status === "success") {
      return result.username || null;
    }

    return null;
  } catch (error) {
    console.error("Fehler beim Laden des aktuellen Benutzers:", error);
    return null;
  }
}

// Aktuelle Woche direkt setzen (lokal, kein UTC-Bug)
const currentRange = getCurrentWeekRange();

let aktiveDateFrom = formatDate(currentRange.start);
let aktiveDateTo = formatDate(currentRange.end);

// =====================================================
// STREAK LADEN
// =====================================================

// load streak info for a member and show status
async function loadStreak(memberId) {
  try {
    const response = await fetch(
      `../api/brush_streak.php?members_id=${encodeURIComponent(memberId)}`,
    );

    const result = await response.json();

    if (result.status === "success") {
      document.getElementById("anzahlTageStreak").textContent = result.streak;
      const streakStatus = document.getElementById("streakStatus");

      if (streakStatus) {
        streakStatus.textContent = result.message || "";
        streakStatus.hidden = !result.message;
      }
    }
  } catch (error) {
    console.error("Fehler beim Laden des Streaks:", error);
  }
}

// =====================================================
// Flatpickr initialization (date range picker)
// =====================================================

flatpickrInstance = flatpickr("#dateRange01", {
  mode: "range",
  dateFormat: "Y-m-d",

  defaultDate: [currentRange.start, currentRange.end],

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

  onDayCreate(_dObj, _dStr, _fp, dayElem) {
    if (formatDate(dayElem.dateObj) === formatDate(new Date())) {
      dayElem.classList.add("stats-today");
    }
  },
});

// =====================================================
// Load members and populate dropdown
// =====================================================

async function loadMemberButtons() {
  try {
    const response = await fetch("../api/members_load.php", {
      credentials: "include",
    });
    const result = await response.json();

    const select = document.getElementById("mitgliederDropdown");

    select.innerHTML = "";

    if (result.status === "success" && result.data.length > 0) {
      const bevorzugtesMitglied =
        result.data.find((member) => member.name === aktuellerBenutzername) ||
        result.data[0];

      result.data.forEach((member, index) => {
        const option = document.createElement("option");

        option.value = member.id;
        option.textContent = member.name;

        select.appendChild(option);
      });

      select.value = String(bevorzugtesMitglied.id);
      aktiveMemberId = bevorzugtesMitglied.id;
      setActiveName(bevorzugtesMitglied.name);
      loadStreak(bevorzugtesMitglied.id);
      loadChartData(bevorzugtesMitglied.id, aktiveDateFrom, aktiveDateTo);

      select.addEventListener("change", () => {
        const selectedId = select.value;
        const selectedName = select.options[select.selectedIndex].textContent;

        aktiveMemberId = selectedId;

        setActiveName(selectedName);
        loadStreak(selectedId);
        loadChartData(selectedId, aktiveDateFrom, aktiveDateTo);
      });
    } else {
      const option = document.createElement("option");

      option.textContent = "Keine Mitglieder gefunden";
      option.disabled = true;

      select.appendChild(option);
    }
  } catch (error) {
    console.error("Fehler beim Laden der Mitglieder:", error);
  }
}

// =====================================================
// Load chart data for the selected member and date range
// =====================================================

async function loadChartData(memberId, dateFrom, dateTo) {
  try {
    const url =
      `../api/brush_load.php?members_id=${encodeURIComponent(memberId)}` +
      `&date_from=${encodeURIComponent(dateFrom)}` +
      `&date_to=${encodeURIComponent(dateTo)}`;

    const response = await fetch(url);
    const result = await response.json();

    if (result.status !== "success") {
      console.error("Fehler:", result.message);
      return;
    }

    const alleDaten = fillDateRange(dateFrom, dateTo, result.data);

    drawChart(alleDaten);
  } catch (error) {
    console.error("Fehler beim Laden der Chart-Daten:", error);
  }
}

function fillDateRange(dateFrom, dateTo, data) {
  const map = {};

  data.forEach((row) => {
    map[row.tag] = parseInt(row.punkte, 10);
  });

  const result = [];

  const current = new Date(dateFrom);
  const end = new Date(dateTo);

  while (current <= end) {
    const key = formatDate(current); // lokal statt UTC

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

// draw the bar chart and highlight today's label
function drawChart(daten) {
  const labels = daten.map((d) => {
    const date = new Date(d.tag);

    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
    });
  });

  const todayTag = formatDate(new Date());
  const todayIndex = daten.findIndex((d) => d.tag === todayTag);

  const punkte = daten.map((d) => d.punkte);

  const maxPunkte = Math.max(...punkte, 6);

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

            if (ratio >= 0.8) return "rgba(180, 231, 252, 0.85)";
            if (ratio >= 0.4) return "rgba(245, 199, 0, 0.85)";
            if (p > 0) return "rgba(255, 150, 100, 0.85)";

            return "rgba(255, 255, 255, 0.15)";
          }),

          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          bottom: 30,
        },
      },

      plugins: {
        legend: {
          display: false,
        },

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
          },

          grid: {
            color: "rgba(183, 231, 252, 0.15)",
          },
        },

        x: {
          ticks: {
            color: (context) =>
              context.tick.label === labels[todayIndex] ? "#ffffff" : "#b7e7fc",
            maxRotation: 45,
            font: (context) => ({
              family: "Inter, sans-serif",
              size: 12,
              weight: context.tick.label === labels[todayIndex] ? "700" : "400",
            }),
          },

          grid: {
            display: false,
          },
        },
      },
    },
  });
}

// =====================================================
// START
// =====================================================
document.addEventListener("DOMContentLoaded", async () => {
  aktuellerBenutzername = await loadCurrentUser();
  await loadMemberButtons();
});
