// const axios = require('axios');
const config = {
  headers: {
    "content-type": "application/json",
  },
};
console.log("Here");
window.onload = function () {
    profileLoad();  
};

function profileLoad() {
    let profileF = document.getElementById("profileForm");
    let pImg = document.getElementById("pImg");
    let name = document.getElementById('name');
    let username = document.getElementById('username');
    let email = document.getElementById('email');
    let phone = document.getElementById('phone');
    let passord = document.getElementById('password');
    let clgName = document.getElementById('clgName');
    let state = document.getElementById('state');
    let country = document.getElementById('country');

    let profileData;
    axios.get("//profile-data", config).then(res => res.json()).then(data => profileData = data).catch(err => console.log(err));

    console.log(profileData);
    

}