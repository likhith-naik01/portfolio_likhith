
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type FocusModeProps = {
  onFocusComplete: () => void;
  onFocusCancel: () => void;
};

export const FocusMode = ({ onFocusComplete, onFocusCancel }: FocusModeProps) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [distractionBlocked, setDistractionBlocked] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
        
        // Randomly simulate blocking distractions
        if (Math.random() < 0.05) { // 5% chance each second
          setDistractionBlocked(prev => prev + 1);
        }
      }, 1000);
    } else if (timeLeft === 0) {
      setModalVisible(true);
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleComplete = () => {
    setModalVisible(false);
    onFocusComplete();
  };

  const handleCancel = () => {
    setIsActive(false);
    onFocusCancel();
  };

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={['#E3F2FD', '#B3E5FC']} 
        style={styles.gradientContainer}
      >
        <Text style={styles.title}>Focus Mode</Text>
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        
        <TouchableOpacity 
          style={[styles.button, isActive ? styles.stopButton : styles.startButton]} 
          onPress={toggleTimer}
        >
          <Text style={styles.buttonText}>{isActive ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel Session</Text>
        </TouchableOpacity>
        
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>Distractions blocked: {distractionBlocked}</Text>
          <Text style={styles.statsText}>Focus level: {isActive ? 'High' : 'Waiting'}</Text>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Focus Session Complete!</Text>
              <Text style={styles.modalText}>
                Great job! You've completed your focus session.
              </Text>
              <TouchableOpacity style={styles.modalButton} onPress={handleComplete}>
                <Text style={styles.modalButtonText}>Claim Reward</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },
  gradientContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 40,
  },
  timerText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  button: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#2196F3',
  },
  stopButton: {
    backgroundColor: '#E91E63',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
  },
  cancelText: {
    color: '#888',
    fontSize: 16,
  },
  statsContainer: {
    marginTop: 40,
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 10,
    width: '100%',
  },
  statsText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});