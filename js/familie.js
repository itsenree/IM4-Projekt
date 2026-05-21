const addBtn = document.getElementById("addBtn");
const memberForm = document.getElementById("memberForm");

addBtn.addEventListener("click", () => {
  memberForm.classList.toggle("hidden");
});

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

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.innerHTML = '<i class="ti ti-trash"></i>';
        deleteBtn.addEventListener("click", () => deleteMember(member.id));

        memberDiv.appendChild(nameElement);
        memberDiv.appendChild(deleteBtn);
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
      loadMembers();
    } else {
      alert(`Error: ${result.message}`);
    }
  } catch (error) {
    console.error("Error saving member:", error);
    alert("An error occurred while saving the member.");
  }
});

loadMembers();
