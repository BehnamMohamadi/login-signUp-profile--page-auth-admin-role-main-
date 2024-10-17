renderTable();

// Rendering Functions
async function renderTable() {
  const response = await fetch("http://127.0.0.1:8000/admin/get-all-users");
  const responseBody = await response.json();
  const users = responseBody.data.users;

  thead.innerHTML = "";
  tbody.innerHTML = "";

  const tableColumns = [...tablePattern]
    .map((column) => {
      return `<th>${column}</th>`;
    })
    .join("");

  thead.innerHTML = `<tr>${tableColumns}</tr>`;

  for (const user of users) {
    tbody.innerHTML += `
    <tr onclick="renderReadUser('${user.username}')">
      <td>${user.username}</td>
      <td>${user.firstname}</td>
      <td>${user.lastname}</td>
      <td>${user.gender}</td>
    </tr>`;
  }
}

async function renderReadUser(username) {
  const user = await findUser(username);
  modalHeader.textContent = "User Info";

  modalBody.innerHTML = Object.keys(user)
    .map((property) => `<p><strong>${property}:</strong> ${user[property]}</p>`)
    .join("");

  modalFooter.innerHTML = `
     <button class="button" onclick="deleteUser('${username}')">delete</button>`;

  openModal();
}

async function deleteUser(username) {
  const response = await fetch(`http://127.0.0.1:8000/admin/remove-user/${username}`, {
    method: "delete",
    body: JSON.stringify({
      username,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  closeModal();
  renderTable();
}

async function findUser(username) {
  const response = await fetch(`http://127.0.0.1:8000/admin/get-user/${username}`);
  const responseBody = await response.json();

  return responseBody.data.users;
}
