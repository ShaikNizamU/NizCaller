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
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import Sound from 'react-native-sound';
import IncomingCallScreen from './src/screens/IncomingCallScreen';

const { width, height } = Dimensions.get('window');

const App = () => {
  const [showCall, setShowCall] = useState(false);
  const ringtoneRef = useRef<Sound | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation for waiting screen
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
      ])
    ).start();

    messaging()
      .getToken()
      .then(token => {
        console.log('🔥 FCM Token:', token);
      });

    requestPermissions();

    const unsubscribe = messaging().onMessage(async () => {
      triggerCall();
    });

    messaging().setBackgroundMessageHandler(async () => {
      triggerCall();
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          triggerCall();
        }
      });

    return () => {
      unsubscribe();
      pulseAnim.stopAnimation();
    };
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
    } else {
      await messaging().requestPermission();
    }
  };

  const triggerCall = () => {
    const sound = new Sound('ringtone.mp3', Sound.ANDROID, error => {
      if (error) {
        console.log('❌ Failed to load sound:', error);
        return;
      }

      sound.setNumberOfLoops(0); // ✅ Play once

      sound.play(success => {
        if (success) {
          console.log('✅ Sound finished playing');
        } else {
          console.log('❌ Sound playback failed');
        }

        ringtoneRef.current = null;
        setShowCall(false); // ✅ Hide call screen after sound ends
      });
    });

    ringtoneRef.current = sound;
    setShowCall(true); // Show the call screen
  };

  const stopRingtone = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.stop(() => {
        ringtoneRef.current?.release();
        ringtoneRef.current = null;
      });
    }
  };

  const handleReject = () => {
    stopRingtone();
    setShowCall(false);
  };

  return (
    <View style={styles.container}>
      {showCall ? (
        <IncomingCallScreen onReject={handleReject} />
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
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
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
  phoneIcon: {
    fontSize: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 40,
  },
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
  statusText: {
    color: '#4CAF50',
    fontSize: 14,
  },
});

export default App;
