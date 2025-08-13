import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const OngoingCallScreen = ({ onEndCall }: { onEndCall: () => void }) => {
  const [callDuration, setCallDuration] = React.useState(0);
  
  // Timer for call duration
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.fullScreen}>
      <View style={styles.callerInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>SN</Text>
        </View>
        <Text style={styles.name}>Shaik Nizam</Text>
        <Text style={styles.callStatus}>{formatTime(callDuration)}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.endCallButton]}
          onPress={onEndCall}
        >
          {/* <Text style={styles.buttonIcon}>✕</Text> */}
          <Text style={styles.buttonText}>End Call</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OngoingCallScreen;

const styles = StyleSheet.create({
  fullScreen: {
    width,
    height,
    backgroundColor: '#0a0a0a',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 9999,
    elevation: 9999,
    paddingVertical: 100,
  },
  callerInfo: {
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarText: {
    fontSize: 48,
    color: '#fff',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  callStatus: {
    fontSize: 18,
    color: '#2ecc71', // Green color for ongoing call timer
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  endCallButton: {
    backgroundColor: '#e74c3c',
  },
  buttonIcon: {
    color: 'white',
    fontSize: 30,
    marginBottom: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
});