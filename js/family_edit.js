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

        // Show position label, or "Keine Position" if brush_nr is 0
        const positionElement = document.createElement("p");
        positionElement.textContent =
          member.brush_nr === 0
            ? "Keine Position"
            : `Position: ${member.brush_nr}`;
        positionElement.classList.add("member-position");
        positionElement.dataset.brushNr = member.brush_nr; // Store brush_nr for conflict checks

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button-container");

        // Edit button — switches the card into edit mode
        const editBtn = document.createElement("button");
        editBtn.classList.add("edit-btn");
        editBtn.innerHTML = '<i class="ti ti-pencil"></i>';
        editBtn.addEventListener("click", () => editMember(member, memberDiv));

        // Delete button — removes the member after confirmation
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.innerHTML = '<i class="ti ti-trash"></i>';
        deleteBtn.addEventListener("click", () => deleteMember(member.id));

        buttonContainer.appendChild(editBtn);
        buttonContainer.appendChild(deleteBtn);

        memberDiv.appendChild(nameElement);
        memberDiv.appendChild(positionElement);
        memberDiv.appendChild(buttonContainer);
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

// Replaces a member card with inline edit inputs (name, color, position)
function editMember(member, memberDiv) {
  memberDiv.innerHTML = "";
  memberDiv.classList.add("member-box-editing");

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.value = member.name;
  nameInput.classList.add("edit-name-input");

  // Color dropdown — pre-selects the member's current color
  const colorSelect = document.createElement("select");
  ["yellow", "red", "green", "blue", "purple", "pink"].forEach((color) => {
    const option = document.createElement("option");
    option.value = color;
    option.textContent = color.charAt(0).toUpperCase() + color.slice(1);
    if (member.color === color) option.selected = true;
    colorSelect.appendChild(option);
  });

  // Position dropdown — pre-selects the member's current brush position
  const brushSelect = document.createElement("select");
  const positions = [
    { value: 0, label: "Keine Position" },
    { value: 1, label: "Position 1" },
    { value: 2, label: "Position 2" },
    { value: 3, label: "Position 3" },
  ];

  positions.forEach((brush) => {
    const option = document.createElement("option");
    option.value = brush.value;
    option.textContent = brush.label;
    if (member.brush_nr === brush.value) option.selected = true;
    brushSelect.appendChild(option);
  });

  // Prevent selecting a position already taken by another member
  brushSelect.addEventListener("change", () => {
    const selectedPosition = parseInt(brushSelect.value, 10);

    if (selectedPosition !== 0) {
      const allMembers = document.querySelectorAll(".member-box");
      let positionTaken = false;

      allMembers.forEach((memberBox) => {
        const positionElement = memberBox.querySelector(".member-position");
        if (
          positionElement &&
          parseInt(positionElement.dataset.brushNr, 10) === selectedPosition
        ) {
          positionTaken = true;
        }
      });

      if (positionTaken) {
        alert("Diese Position ist schon vergeben!");
        brushSelect.value = member.brush_nr; // Revert to original value
      }
    }
  });

  // POSTs the updated member data to the API, then refreshes the list
  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save";
  saveBtn.classList.add("save-btn");
  saveBtn.addEventListener("click", async () => {
    const updatedMember = {
      member_id: member.id,
      name: nameInput.value,
      color: colorSelect.value,
      brush_nr: parseInt(brushSelect.value, 10),
    };

    console.log("Sending updated member data:", updatedMember);

    try {
      const response = await fetch("../api/members_update.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedMember),
      });

      const result = await response.json();

      if (result.success) {
        loadMembers(); // Refresh list to reflect changes
      } else {
        console.error("SQL Error:", result.error);
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error updating member:", error);
      alert("An error occurred while updating the member.");
    }
  });

  // Cancel discards changes and reloads the original list
  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.classList.add("cancel-btn");
  cancelBtn.addEventListener("click", () => loadMembers());

  memberDiv.appendChild(nameInput);
  memberDiv.appendChild(colorSelect);
  memberDiv.appendChild(brushSelect);
  memberDiv.appendChild(saveBtn);
  memberDiv.appendChild(cancelBtn);
}

// Asks for confirmation, then sends a delete request for the given member ID
async function deleteMember(id) {
  if (!confirm("Mitglied wirklich entfernen?")) return;

  try {
    const response = await fetch("../api/members_delete.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const result = await response.json();

    if (result.status === "success") {
      loadMembers(); // Refresh list after deletion
    } else {
      alert(`Fehler: ${result.message}`);
    }
  } catch (error) {
    console.error("Error deleting member:", error);
    alert("Ein Fehler ist beim Löschen aufgetreten.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadMembers(); // Initial render on page load

  // Toggle the "add member" form visibility
  const addBtn = document.getElementById("addBtn");
  const memberForm = document.getElementById("memberForm");
  addBtn.addEventListener("click", () => {
    memberForm.classList.toggle("hidden");
  });

  const brushSelect = document.getElementById("brush_nr");

  // Prevent selecting an already-taken position in the "add member" form
  brushSelect.addEventListener("change", () => {
    const selectedPosition = parseInt(brushSelect.value, 10);

    if (selectedPosition !== 0) {
      const allMembers = document.querySelectorAll(".member-box");
      let positionTaken = false;

      allMembers.forEach((memberBox) => {
        const positionElement = memberBox.querySelector(".member-position");
        if (
          positionElement &&
          parseInt(positionElement.dataset.brushNr, 10) === selectedPosition
        ) {
          positionTaken = true;
        }
      });

      if (positionTaken) {
        alert("Diese Position ist schon vergeben!");
        brushSelect.value = 0; // Revert to "Keine Position"
      }
    }
  });

  // Reads form inputs and POSTs a new member to the API, then resets the form
  const confirmBtn = document.getElementById("confirmBtn");
  confirmBtn.addEventListener("click", async () => {
    const nameInput = document.getElementById("member_name");
    const colorSelect = document.getElementById("color");

    const newMember = {
      name: nameInput.value,
      color: colorSelect.value,
      brush_nr: parseInt(brushSelect.value, 10),
    };

    try {
      const response = await fetch("../api/members_save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMember),
      });

      const result = await response.json();

      if (result.status === "success") {
        loadMembers();
        memberForm.classList.add("hidden"); // Hide form after successful save
        // Reset form fields to defaults
        nameInput.value = "";
        colorSelect.value = "yellow";
        brushSelect.value = 0;
      } else {
        alert(`Fehler: ${result.message}`);
      }
    } catch (error) {
      console.error("Error adding member:", error);
      alert("Ein Fehler ist beim Hinzufügen aufgetreten.");
    }
  });
});
