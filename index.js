import { AppRegistry, Linking } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import RNCallKeep from 'react-native-callkeep';
import App from './App';
import { name as appName } from './app.json';

const callKeepOptions = {
  android: {
    alertTitle: 'Permissions required',
    alertDescription: 'This app needs access to your phone accounts',
    cancelButton: 'Cancel',
    okButton: 'OK',
    additionalPermissions: [],
    foregroundService: {
      channelId: 'com.myapp.call_channel',
      channelName: 'Incoming Calls',
      notificationTitle: 'Incoming Call',
    },
  },
};

RNCallKeep.setup(callKeepOptions);
RNCallKeep.setAvailable(true);

// ✅ Handle "answer call" event
RNCallKeep.addEventListener('answerCall', ({ callUUID }) => {
  console.log('📞 Call answered:', callUUID);

  // Open app via deep link so it works even if killed
  Linking.openURL('nizcaller://call?status=answered');
    RNCallKeep.answerIncomingCall(callUUID);
  RNCallKeep.endCall(callUUID);
});

// Background FCM handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background FCM:', remoteMessage.data);

  if (remoteMessage.data?.type === 'incoming_call') {
    RNCallKeep.displayIncomingCall(
      remoteMessage.data.uuid,
      remoteMessage.data.caller,
      remoteMessage.data.caller,
      'number',
      true
    );
  }
});

AppRegistry.registerComponent(appName, () => App);
