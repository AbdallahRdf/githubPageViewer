const profileImage = document.querySelector("#profileImage");
const fullName = document.querySelector("#fullName");
const uname = document.querySelector("#uname");
const bio = document.querySelector("#bio");
const followersBtn = document.querySelector("#followers");
const followingBtn = document.querySelector("#following");
const theLocation = document.querySelector("#location");
const blog = document.querySelector("#blog");
const twitterAccount = document.querySelector("#twitterAccount");
const repos = document.querySelector("#repos");
const toProfile = document.querySelector("#linkToProfile");
const form = document.querySelector("#form");
const userName = document.querySelector("#username");
const card = document.querySelector("#card");
const card404 = document.querySelector("#card404");
const h2 = document.querySelector("#h2");
const h4 = document.querySelector("#h4");
const btn = document.querySelector("#btn");

const NotFound = (name) => {
    spinner(true);
    userName.value = "";
    sessionStorage.setItem("username", name);
    card.style.display = "none"
    card404.style.display = "block";
}

//* IIFE to set the page data;
const setData = async (data = null) => {
    if(data === null){
        data = dataFromSessionStorage;
    }
    card.style.display = "block";
    card404.style.display = "none";

    profileImage.src = data.avatar_url; // setting profile avatar;
    fullName.textContent = data?.name; // setting the name;
    uname.textContent = data?.login; // setting the username;
    bio.textContent = data?.bio;    // setting the bio;

    //setting the followers
    followersBtn.textContent = data.followers+' followers';
    followersBtn.href = data.html_url+"?tab=followers";

    //setting the following
    followingBtn.textContent = data.following + " following";
    followingBtn.href = data.html_url + "?tab=following";

    // setting the location
    theLocation.innerHTML = data.location && `<i class="fa-solid fa-location-dot" style="color: #ffffff;"></i> ${data.location}`;

    // setting the blog or portfolio
    blog.innerHTML = data.blog &&`<i class="fa-solid fa-link" style="color: #ffffff;"></i>   ${data.blog}`;
    blog.href = data?.blog;

    // setting twitter account link
    if(data.twitter_username!==null){
        twitterAccount.innerHTML = `<i class="fa-brands fa-twitter" style="color: #ffffff;"></i>   @${data.twitter_username}`;
        twitterAccount.href = `https://twitter.com/${data.twitter_username}`;
    }
    
    //setting the repos
    repos.textContent = data.public_repos + " repos";
    repos.href = data.html_url + "?tab=repositories";

    // setting the link to the profile
    toProfile.style.display = "block";
    toProfile.href = data.html_url;

    //* reseting the input
    userName.value ="";
    spinner(true);
};

//* event listener for the form
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  spinner(false);
  try {
        const data = await getData(userName.value);
        sessionStorage.setItem('data', JSON.stringify(data));
        if (data.message === "Not Found") {
            NotFound(userName.value);
        } else {
            setData(data);
        }
    } catch (error) {
        console.log("Error fetching data:", error);
    }
});

//* getting the data
const getData = (username) => {
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

const spinner = (isSet) => {
    if(isSet){
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-magnifying-glass fa-lg"></i>`;
    }else{
        btn.disabled = true;
        btn.innerHTML = ` 
            <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
            <span class="visually-hidden" role="status">Loading...</span>
        `;
    }
};

btn.disabled = false;
const dataFromSessionStorage = JSON.parse(sessionStorage.getItem("data"));
if (dataFromSessionStorage.message === "Not Found") {
  const username = sessionStorage.getItem("username");
  NotFound(username);
} else {
  setData(dataFromSessionStorage);
}
