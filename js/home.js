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

  loadHomeData();
});

async function loadHomeData() {
  try {
    const response = await fetch("../api/champion_load.php");
    const result = await response.json();

    if (result.status !== "success") return;

    document.getElementById("championName").textContent = result.name;
    document.querySelector("#championScore span").textContent = result.punkte;

    const namen = result.allePunkte.map((m) => m.name);
    const punkte = result.allePunkte.map((m) => parseInt(m.total_punkte));

    const max = Math.max(...punkte, 1);

    const ctx = document.getElementById("familienChart").getContext("2d");

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: namen,
        datasets: [
          {
            label: "Punkte",
            data: punkte,
            backgroundColor: punkte.map((p) => {
              const ratio = p / max;
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
            title: {
              display: true,
              text: "Punkte",
              color: "#b7e7fc",
            },
            ticks: { stepSize: 1, color: "#b7e7fc" },
            grid: { color: "rgba(183, 231, 252, 0.15)" },
          },
          x: {
            ticks: { color: "#b7e7fc" },
            grid: { display: false },
          },
        },
      },
    });
  } catch (error) {
    console.error("Fehler beim Laden der Home-Daten:", error);
  }
}
