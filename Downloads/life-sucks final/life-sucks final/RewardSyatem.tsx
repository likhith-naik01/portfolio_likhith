import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Reward = {
  id: string;
  title: string;
  description: string;
  delayMinutes: number;
  points: number;
  unlocked: boolean;
};

export const useRewardsSystem = () => {
  const [points, setPoints] = useState(0);
  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: '1',
      title: 'Social Media Time',
      description: 'Unlocks 10 minutes of social media browsing.',
      delayMinutes: 15,
      points: 100,
      unlocked: false,
    },
    {
      id: '2',
      title: 'Break Time',
      description: 'Enjoy a 15-minute break.',
      delayMinutes: 5,
      points: 50,
      unlocked: false,
    },
    {
      id: '3',
      title: 'Congratulations Message',
      description: 'Receive a personalized congratulations message.',
      delayMinutes: 0,
      points: 20,
      unlocked: false,
    },
  ]);
  const [pendingRewards, setPendingRewards] = useState<{
    reward: Reward | null;
    unlockTime: number | null;
  }>({ reward: null, unlockTime: null });
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [currentReward, setCurrentReward] = useState<Reward | null>(null);

  useEffect(() => {
    loadRewardsData();
  }, []);

  useEffect(() => {
    saveRewardsData();
  }, [points, rewards, pendingRewards]);

  useEffect(() => {
    const checkPendingRewards = () => {
      if (pendingRewards.reward && pendingRewards.unlockTime) {
        if (Date.now() >= pendingRewards.unlockTime) {
          setCurrentReward(pendingRewards.reward);
          setShowRewardModal(true);
          setPendingRewards({ reward: null, unlockTime: null });
        }
      }
    };

    const interval = setInterval(checkPendingRewards, 5000);
    return () => clearInterval(interval);
  }, [pendingRewards]);

  const loadRewardsData = async () => {
    try {
      const storedPoints = await AsyncStorage.getItem('reward_points');
      const storedRewards = await AsyncStorage.getItem('rewards');
      const storedPendingRewards = await AsyncStorage.getItem('pending_rewards');

      if (storedPoints) setPoints(JSON.parse(storedPoints));
      if (storedRewards) setRewards(JSON.parse(storedRewards));
      if (storedPendingRewards) setPendingRewards(JSON.parse(storedPendingRewards));
    } catch (error) {
      console.error('Failed to load rewards data:', error);
    }
  };

  const saveRewardsData = async () => {
    try {
      await AsyncStorage.multiSet([
        ['reward_points', JSON.stringify(points)],
        ['rewards', JSON.stringify(rewards)],
        ['pending_rewards', JSON.stringify(pendingRewards)],
      ]);
    } catch (error) {
      console.error('Failed to save rewards data:', error);
    }
  };

  const addPoints = (amount: number) => {
    setPoints(prev => prev + amount);
  };

  const claimReward = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    
    if (!reward) return;
    
    if (points >= reward.points) {
      setPoints(prev => prev - reward.points);
      
      if (reward.delayMinutes > 0) {
        // Delay the reward
        const unlockTime = Date.now() + reward.delayMinutes * 60 * 1000;
        setPendingRewards({ reward, unlockTime });
      } else {
        // Immediate reward
        setCurrentReward(reward);
        setShowRewardModal(true);
      }
    }
  };

  const RewardsModal = () => {
    if (!currentReward) return null;
    
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showRewardModal}
        onRequestClose={() => setShowRewardModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reward Unlocked!</Text>
            <Text style={styles.rewardTitle}>{currentReward.title}</Text>
            <Text style={styles.rewardDescription}>{currentReward.description}</Text>
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowRewardModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const RewardsList = () => {
    return (
      <View style={styles.rewardsContainer}>
        <Text style={styles.rewardsTitle}>Available Rewards</Text>
        <Text style={styles.pointsText}>You have {points} points</Text>
        
        {rewards.map(reward => (
          <TouchableOpacity
            key={reward.id}
            style={[
              styles.rewardItem,
              points < reward.points ? styles.rewardDisabled : null
            ]}
            onPress={() => claimReward(reward.id)}
            disabled={points < reward.points}
          >
            <View style={styles.rewardContent}>
              <Text style={styles.rewardItemTitle}>{reward.title}</Text>
              <Text style={styles.rewardItemDescription}>{reward.description}</Text>
              {reward.delayMinutes > 0 && (
                <Text style={styles.delayText}>
                  (Delayed by {reward.delayMinutes} minutes)
                </Text>
              )}
            </View>
            <Text style={styles.pointsRequired}>{reward.points} pts</Text>
          </TouchableOpacity>
        ))}
        
        {pendingRewards.reward && (
          <View style={styles.pendingRewardInfo}>
            <Text style={styles.pendingTitle}>Pending Reward:</Text>
            <Text>{pendingRewards.reward.title}</Text>
            <Text>
              Unlocks in {Math.ceil((pendingRewards.unlockTime! - Date.now()) / 60000)} minutes
            </Text>
          </View>
        )}
      </View>
    );
  };

  return {
    points,
    addPoints,
    RewardsModal,
    RewardsList,
    showRewardModal,
    setShowRewardModal,
  };
};

const styles = StyleSheet.create({
  rewardsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
  },
  rewardsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 10,
  },
  pointsText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  rewardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
  },
  rewardDisabled: {
    opacity: 0.5,
  },
  rewardContent: {
    flex: 1,
  },
  rewardItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  rewardItemDescription: {
    fontSize: 14,
    color: '#666',
  },
  delayText: {
    fontSize: 12,
    color: '#E91E63',
    fontStyle: 'italic',
  },
  pointsRequired: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  pendingRewardInfo: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#FFF9C4',
    borderRadius: 10,
  },
  pendingTitle: {
    fontWeight: 'bold',
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
  rewardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  rewardDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});