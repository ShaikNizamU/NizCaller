import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const IncomingCallScreen = ({ onReject }: { onReject: () => void }) => {
  return (
    <View style={styles.fullScreen}>
      <View style={styles.callerInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>SN</Text>
        </View>
        <Text style={styles.name}>Shaik Nizam</Text>
        <Text style={styles.callStatus}>Incoming Call</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.acceptButton]}
          onPress={onReject}
        >
          <Text style={styles.buttonIcon}>✓</Text>
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={onReject}
        >
          <Text style={styles.buttonIcon}>✕</Text>
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default IncomingCallScreen;

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
    color: '#aaa',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
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
  acceptButton: {
    backgroundColor: '#2ecc71',
  },
  rejectButton: {
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
