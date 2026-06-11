// Toggle the "add member" form visibility when the add button is clicked
const addBtn = document.getElementById("addBtn");
const memberForm = document.getElementById("memberForm");

addBtn.addEventListener("click", () => {
  memberForm.classList.toggle("hidden");
});

// Fetches all members from the API and renders them into the member list
async function loadMembers() {
  try {
    const response = await fetch("../api/members_load.php");
    const result = await response.json();

    const memberList = document.getElementById("memberList");
    memberList.innerHTML = ""; // Clear current list before re-rendering

    if (result.status === "success" && result.data.length > 0) {
      result.data.forEach((member) => {
        const memberDiv = document.createElement("div");
        memberDiv.classList.add("member-box");

        const nameElement = document.createElement("p");
        nameElement.textContent = member.name;
        nameElement.classList.add("member-name");

        // Apply a color-specific CSS class if the member has a color assigned
        if (member.color) {
          memberDiv.classList.add(`member-color-${member.color}`);
        }

        // Delete button — triggers deleteMember() with this member's ID
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.innerHTML = '<i class="ti ti-trash"></i>';
        deleteBtn.addEventListener("click", () => deleteMember(member.id));

        memberDiv.appendChild(nameElement);
        memberDiv.appendChild(deleteBtn);
        memberList.appendChild(memberDiv);
      });
    } else {
      // No members returned — show a fallback message
      const noMembersMessage = document.createElement("p");
      noMembersMessage.textContent = "No members found.";
      noMembersMessage.classList.add("no-members-message");
      memberList.appendChild(noMembersMessage);
    }
  } catch (error) {
    console.error("Error loading members:", error);
  }
}

// Asks for confirmation, then sends a delete request for the given member ID
async function deleteMember(id) {
  if (!confirm("Mitglied wirklich entfernen? Alle zugehörigen Daten gehen verloren.")) return;

  try {
    const response = await fetch("../api/members_delete.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const result = await response.json();

    if (result.status === "success") {
      loadMembers(); // Refresh the list after deletion
    } else {
      alert(`Fehler: ${result.message}`);
    }
  } catch (error) {
    console.error("Error deleting member:", error);
    alert("Ein Fehler ist beim Löschen aufgetreten.");
  }
}

// Reads form inputs and POSTs a new member to the API on confirm
document.getElementById("confirmBtn").addEventListener("click", async () => {
  const name = document.getElementById("member_name").value;
  const brush_nr = document.getElementById("brush_nr").value;
  const color = document.getElementById("color").value;

  const data = { name, brush_nr, color };

  try {
    const response = await fetch("../api/members_save.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.status === "success") {
      alert("Member saved successfully!");
      loadMembers(); // Refresh the list to include the new member
    } else {
      alert(`Error: ${result.message}`);
    }
  } catch (error) {
    console.error("Error saving member:", error);
    alert("An error occurred while saving the member.");
  }
});

// Initial load on page ready
loadMembers();
