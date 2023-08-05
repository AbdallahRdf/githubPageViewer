const usernameInput = document.querySelector("#username");
const form = document.querySelector("#form");
const btn = document.querySelector("#btn");

btn.disabled = false;
usernameInput.value = "";

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  sessionStorage.setItem("username", usernameInput.value);
  try {
    const data = await getData(usernameInput.value);
    sessionStorage.setItem('data', JSON.stringify(data));
    window.location.href = "./html/profile.html";
  } catch (error) {
      console.log("Error fetching data:", error);
      // Handle the error, e.g., display an error message to the user
  }
});

const getData = (username) => {
    spinner();
    return fetch(`https://api.github.com/users/${username}`)
        .then((response) => {
          if (response.status !== 404 && response.status !== 200) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .catch((error) => {
            throw new Error("Error fetching data:", error);
        });
};

const spinner = () => {
  btn.disabled = true;
  btn.innerHTML = ` 
    <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
    <span role="status">Loading...</span>
  `;
}