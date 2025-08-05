# 📞 React Native Incoming Call Simulation App

This React Native app simulates an **incoming call** triggered via **Firebase Cloud Messaging (FCM)**.  
It displays a call screen with a ringtone when a push notification is received — even when the app is in background or killed.

> 🔔 **No vibration is included** in this version — only the ringtone plays once.

---

## ✅ Features

- 🔔 Trigger call screen via push notification (FCM)
- 🔊 Ringtone plays **once** automatically
- 📞 Call UI with Accept and Reject buttons
- 🚫 Works even when app is **killed**
- 🔒 Notification click opens app and triggers call
- 🔥 Firebase v1 API integration with access token support
- 🧪 Displays the FCM token on screen for easy testing

---

## 📦 Tech Stack

- React Native (CLI)
- `@react-native-firebase/messaging`
- `react-native-sound` (for ringtone playback)
- Firebase Cloud Messaging (HTTP v1 API)

---



### 🔄 Use Your Own Firebase Key (For Other Users)

- They should:
  - Create your own Firebase project
  - Download your own `serviceAccountKey.json` as shown above
  - Replace the placeholder file in the project root

> ✅ This allows you to send push notifications using **your own Firebase project** safely

---

### 🔹 Step 2: Generate Access Token

Use the included script `getToken.js`:

```js
const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  keyFile: "./serviceAccountKey.json",
  scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
});

auth.getAccessToken().then(token => {
  console.log("✅ Access Token:", token);
});


▶️ Run it in terminal:

node getToken.js

This will print your access token. Copy it.


📤 Send Push Notification (via Postman or cURL)
🔸 Method
POST https://fcm.googleapis.com/v1/projects/YOUR_PROJECT_ID/messages:send
Replace YOUR_PROJECT_ID with your Firebase project ID.


🔸 Headers
Key	            Value
Authorization	Bearer YOUR_ACCESS_TOKEN
Content-Type	application/json


🔸 Body (JSON)
{
  "message": {
    "token": "DEVICE_FCM_TOKEN_HERE",
    "notification": {
      "title": "Incoming Call",
      "body": "Shaik Nizam is calling..."
    },
    "data": {
      "type": "incoming_call"
    },
    "android": {
      "priority": "high",
      "notification": {
        "click_action": "FLUTTER_NOTIFICATION_CLICK",
        "sound": "default"
      }
    }
  }
}

✅ Once sent:

Notification will appear on the device

Tapping it will open the app

The app will play ringtone and show incoming call screen


🙋‍♂️ Author
Shaik Nizam
React Native Developer
