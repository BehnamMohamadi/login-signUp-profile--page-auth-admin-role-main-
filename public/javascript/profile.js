const modalHeader = document.querySelector(".modal-header > h2");
const modalBody = document.querySelector(".modal-body");
const modalFooter = document.querySelector(".modal-footer");

const modal = document.getElementById("modal");
const closeButton = document.getElementsByClassName("close")[0];
const modalButton = document.getElementById("myBtn");

const updateBtn = document.querySelector("#update-button");
const logOutBtn = document.querySelector("#log-out-button");
const userNameTitle = document.querySelector(".userNameTitle");
const firstNameTitle = document.querySelector(".firstNameTitle");
const lastNameTitle = document.querySelector(".lastNameTitle");
const genderTitle = document.querySelector(".genderTitle");

const usernameInURL = window.location.pathname.split("/").pop();

document.addEventListener("DOMContentLoaded", async () => {
  renderProfile(usernameInURL);
});

async function renderProfile(renderUserName) {
  try {
    const response = await fetch(`/auth/profile/${renderUserName}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "",
    });
    if (!response.ok) {
      throw new Error("error");
    }

    const { firstname, lastname, username, gender } = await response.json();

    firstNameTitle.innerHTML = firstname;
    lastNameTitle.innerHTML = lastname;
    userNameTitle.innerHTML = username;
    genderTitle.innerHTML = gender;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

updateBtn.addEventListener("click", async () => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/auth/get-user/${usernameInURL}`);
    const responseAsJson = await response.json();

    const user = responseAsJson.data.user;
    console.log(user);

    //http://127.0.0.1:8000/auth/get-user/:username

    modalHeader.textContent = "Edit user Info";

    modalBody.innerHTML = Object.keys(user)
      .slice(0, -1)
      .map((property) => {
        return `<strong>${property}:</strong> 
        <input type="text" id="${property}"  class="update-inputs" value="${user[property]}" placeholder="${property}" /> 
        </br></br>
        `;
      })
      .join("");

    modalFooter.innerHTML = `
      <button class="button" onclick="updateUser('${user.username}')">Save</button>`;

    openModal();
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
});

async function updateUser(username) {
  const updateInputs = document.querySelectorAll(".update-inputs");

  for (const input of updateInputs) {
    if (input.value.trim() === "") return alert("invalid input");
  }

  const data = Array.from(updateInputs).map((input) => ({
    id: input.id,
    value: input.value,
  }));

  const response = await fetch(
    `http://127.0.0.1:8000/auth/profile/update-user/${username}`,
    {
      method: "PUT",
      body: JSON.stringify({
        data: data,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorResponse = await response.json();
    console.error("Error updating user:", errorResponse);
    return alert("Error updating user: " + errorResponse.data.message);
  }

  closeModal();
  window.location.href = `http://127.0.0.1:8000/auth/profile/${data[2].value}`;
}

logOutBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const response = await fetch(
    `http://127.0.0.1:8000/auth/profile/logout/${usernameInURL}`,
    {
      method: "PUT",
      body: JSON.stringify({
        data: { isLoggedIn: false },
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorResponse = await response.json();
    console.error("Error updating user:", errorResponse);
    return alert("Error updating user: " + errorResponse.data.message);
  }

  window.location.href = "http://127.0.0.1:8000/auth/login";
});

function openModal() {
  modal.style.display = "block";
}

function closeModal() {
  resetModal();
  modal.style.display = "none";
}

function resetModal() {
  modalHeader.textContent = "DEFAULT";
  modalBody.innerHTML = "";
  modalFooter.innerHTML = "";
}

closeButton.onclick = closeModal;
