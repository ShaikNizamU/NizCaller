const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  keyFile: "./serviceAccountKey.json", // Must be placed in the same folder
  scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
});

auth.getAccessToken().then(token => {
  console.log("✅ Access Token:\n", token);
});
