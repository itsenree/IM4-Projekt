// THIS CODE DOES NOT WORK YET

const addBtn = document.getElementById("addBtn");
const memberForm = document.getElementById("memberForm");

addBtn.addEventListener("click", () => {
  memberForm.classList.toggle("hidden");
});

document.getElementById("confirmBtn").addEventListener("click", async () => {
  const data = {
    name: document.getElementById("name").value,
    color: document.getElementById("color").value,
    brush_nr: document.getElementById("brushNr").value,
  };

  const response = await fetch("/add-member", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    alert("Member added!");
  }
});
