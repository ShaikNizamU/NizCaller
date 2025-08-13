import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Dimensions,
  Animated,
  Easing,
  Alert,
  Linking,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import Sound from 'react-native-sound';
import IncomingCallScreen from './src/screens/OngoingCallScreen';
import CallKeep from 'react-native-callkeep';
import RNCallKeep from 'react-native-callkeep';
import Clipboard from '@react-native-clipboard/clipboard';

const { width, height } = Dimensions.get('window');

async function requestCallPermissions() {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      PermissionsAndroid.PERMISSIONS.CALL_PHONE,
      // Android 13+ notifications permission
      ...(Platform.Version >= 33 ? [PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS] : []),
    ]);
    console.log('Permissions granted:', granted);
  } else {
    await messaging().requestPermission();
  }
}


const options = {
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

const App = () => {
  const [showCall, setShowCall] = useState(false);
  const ringtoneRef = useRef<Sound | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    Linking.getInitialURL().then(url => {
      if (url) handleDeepLink(url);
    });

    const sub = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    return () => sub.remove();
  }, []);

  const handleDeepLink = (url) => {
    const params = new URL(url).searchParams;
    if (params.get('status') === 'answered') {
      // Navigate to your in-call screen
      setShowCall(true)
    }
  };

  useEffect(() => {
    requestCallPermissions();

    CallKeep.setup({
      android: {
        alertTitle: 'Permissions required',
        alertDescription: 'This app needs access to phone and microphone',
        cancelButton: 'Cancel',
        okButton: 'OK',
      },
    });
  }, []);

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    getFCMToken();

    RNCallKeep.setup(options);
    RNCallKeep.setAvailable(true);

    // Foreground notification listener
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('📩 Foreground message:', remoteMessage);
      if (remoteMessage.data?.type === 'incoming_call') {
        RNCallKeep.displayIncomingCall(
          remoteMessage.data.uuid,
          remoteMessage.data.caller,
          remoteMessage.data.caller,
          'number', // or 'email'
          true, // hasVideo
        );
      }
    });

    return () => {
      unsubscribe();
      pulseAnim.stopAnimation();
    };
  }, []);

  const getFCMToken = async () => {
    try {
      const token = await messaging().getToken();
      console.log('🔥 FCM Token:', token);
      setFcmToken(token);
      // Send token to your backend if needed
    } catch (error) {
      console.log('❌ Error getting FCM token:', error);
    }
  };

  const copyToClipboard = () => {
    if (fcmToken) {
      Clipboard.setString(fcmToken);
      Alert.alert('Copied', 'FCM token copied to clipboard!');
    }
  };

  const triggerCall = () => {
    const sound = new Sound('ringtone.mp3', Sound.ANDROID, error => {
      if (error) {
        console.log('❌ Failed to load sound:', error);
        return;
      }
      sound.setNumberOfLoops(-1); // loop until answered/rejected
      sound.play();
      ringtoneRef.current = sound;
    });
    setShowCall(true);
  };

  const stopRingtone = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.stop(() => {
        ringtoneRef.current?.release();
        ringtoneRef.current = null;
      });
    }
  };

  // const handleReject = () => {
  //   stopRingtone();
  //   setShowCall(false);
  // };

  const handleEndCall = () => {
  setShowCall(false);
  // Add any additional call termination logic here
};

  return (
    <View style={styles.container}>
      {showCall ? (
        <IncomingCallScreen onEndCall={handleEndCall} />
      ) : (
        <View style={styles.waitingContainer}>
          <Animated.View
            style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]}
          >
            <View style={styles.innerCircle}>
              <Text style={styles.phoneIcon}>📱</Text>
            </View>
          </Animated.View>
          <Text style={styles.title}>Ready for Calls</Text>
          <Text style={styles.subtitle}>Waiting for incoming call...</Text>
          <View style={styles.statusContainer}>
            <View style={styles.statusIndicator} />
            <Text style={styles.statusText}>Connected to server</Text>
          </View>

          {fcmToken && (
            <View style={styles.tokenContainer}>
              <Text style={styles.tokenLabel}>FCM Token:</Text>
              <Text
                style={styles.tokenText}
                selectable
                onPress={copyToClipboard}
              >
                {fcmToken}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  waitingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pulseCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(0, 150, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  innerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#0096ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneIcon: { fontSize: 60 },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: { fontSize: 16, color: '#aaa', marginBottom: 40 },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 70,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  statusText: { color: '#4CAF50', fontSize: 14 },

  // Added styles for FCM token display
  tokenContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    width: '100%',
  },
  tokenLabel: {
    color: '#ccc',
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  tokenText: {
    color: '#00bfff',
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#00bfff',
    borderRadius: 8,
  },
});

export default App;
