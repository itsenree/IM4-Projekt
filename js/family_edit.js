async function loadMembers() {
  try {
    const response = await fetch("../api/members_load.php");
    const result = await response.json();

    const memberList = document.getElementById("memberList");
    memberList.innerHTML = "";

    if (result.status === "success" && result.data.length > 0) {
      result.data.forEach((member) => {
        const memberDiv = document.createElement("div");
        memberDiv.classList.add("member-box");

        const nameElement = document.createElement("p");
        nameElement.textContent = member.name;
        nameElement.classList.add("member-name");

        if (member.color) {
          memberDiv.classList.add(`member-color-${member.color}`);
        }

        const positionElement = document.createElement("p");
        positionElement.textContent = member.brush_nr === 0 ? "Keine Position" : `Position: ${member.brush_nr}`;
        positionElement.classList.add("member-position");
        positionElement.dataset.brushNr = member.brush_nr; // Set data-brushNr attribute

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button-container");

        const editBtn = document.createElement("button");
        editBtn.classList.add("edit-btn");
        editBtn.innerHTML = '<i class="ti ti-pencil"></i>';
        editBtn.addEventListener("click", () => editMember(member, memberDiv));

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
      const noMembersMessage = document.createElement("p");
      noMembersMessage.textContent = "No members found.";
      noMembersMessage.classList.add("no-members-message");
      memberList.appendChild(noMembersMessage);
    }
  } catch (error) {
    console.error("Error loading members:", error);
  }
}

function editMember(member, memberDiv) {
  // Clear the memberDiv and replace with editable fields
  memberDiv.innerHTML = "";

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.value = member.name;
  nameInput.classList.add("edit-name-input");

  const colorSelect = document.createElement("select");
  ["yellow", "red", "green", "blue", "purple", "pink"].forEach((color) => {
    const option = document.createElement("option");
    option.value = color;
    option.textContent = color.charAt(0).toUpperCase() + color.slice(1);
    if (member.color === color) option.selected = true;
    colorSelect.appendChild(option);
  });

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

  brushSelect.addEventListener("change", () => {
    const selectedPosition = parseInt(brushSelect.value, 10);

    if (selectedPosition !== 0) {
      const allMembers = document.querySelectorAll(".member-box");
      let positionTaken = false;

      allMembers.forEach((memberBox) => {
        const positionElement = memberBox.querySelector(".member-position");
        if (positionElement && parseInt(positionElement.dataset.brushNr, 10) === selectedPosition) {
          positionTaken = true;
        }
      });

      if (positionTaken) {
        alert("Diese Position ist schon vergeben!");
        brushSelect.value = member.brush_nr; // Revert to the previous value
      }
    }
  });

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save";
  saveBtn.classList.add("save-btn");
  saveBtn.addEventListener("click", async () => {
    const updatedMember = {
      member_id: member.id, // Ensure the member ID is included
      name: nameInput.value,
      color: colorSelect.value,
      brush_nr: parseInt(brushSelect.value, 10),
    };

    console.log("Sending updated member data:", updatedMember); // Log the data being sent

    try {
      const response = await fetch("../api/members_update.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedMember),
      });

      const result = await response.json();

      if (result.success) {
        loadMembers();
      } else {
        console.error("SQL Error:", result.error);
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error updating member:", error);
      alert("An error occurred while updating the member.");
    }
  });

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
      loadMembers();
    } else {
      alert(`Fehler: ${result.message}`);
    }
  } catch (error) {
    console.error("Error deleting member:", error);
    alert("Ein Fehler ist beim Löschen aufgetreten.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadMembers();

  const addBtn = document.getElementById("addBtn");
  const memberForm = document.getElementById("memberForm");

  addBtn.addEventListener("click", () => {
    memberForm.classList.toggle("hidden");
  });

  const brushSelect = document.getElementById("brush_nr");
  brushSelect.addEventListener("change", () => {
    const selectedPosition = parseInt(brushSelect.value, 10);

    if (selectedPosition !== 0) {
      const allMembers = document.querySelectorAll(".member-box");
      let positionTaken = false;

      allMembers.forEach((memberBox) => {
        const positionElement = memberBox.querySelector(".member-position");
        if (positionElement && parseInt(positionElement.dataset.brushNr, 10) === selectedPosition) {
          positionTaken = true;
        }
      });

      if (positionTaken) {
        alert("Diese Position ist schon vergeben!");
        brushSelect.value = 0; // Revert to 'Keine Position'
      }
    }
  });

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
        memberForm.classList.add("hidden");
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