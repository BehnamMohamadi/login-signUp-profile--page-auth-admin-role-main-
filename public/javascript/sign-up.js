//render login page
const loginBtn = document.querySelector(".login-button");

//fetch sign up page
const signUpBtn = document.querySelector("#input-sign-up");

signUpBtn.addEventListener("click", async (e) => {
  const userInfo = {
    firstname: document.querySelector("#firstNameInput").value,
    lastname: document.querySelector("#lastNameInput").value,
    username: document.querySelector("#userNameInput").value,
    password: document.querySelector("#passwordInput").value,
    gender: document.querySelector("#genderInput").value,
  };
  console.log(userInfo);

  const response = await fetch("http://127.0.0.1:8000/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInfo),
  });
  const data = await response.json();
  console.log(response);
  console.log(data);

  if (response.ok) {
    alert("sign up successful");
  } else {
    alert("sign up failed");
  }
});

loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  window.location.href = "http://127.0.0.1:8000/auth/login";
});
