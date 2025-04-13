import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

type UsageData = {
  date: string;
  minutes: number;
};

export const useSocialMediaTracker = () => {
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [todayUsage, setTodayUsage] = useState(0);
  const [showUsageLimit, setShowUsageLimit] = useState(false);
  const [usageLimit, setUsageLimit] = useState(60); // Default 60 minutes
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);

  useEffect(() => {
    loadUsageData();
  }, []);

  useEffect(() => {
    saveUsageData();
  }, [usageData, todayUsage, usageLimit]);

  useEffect(() => {
    if (todayUsage >= usageLimit && !isLimitReached) {
      setIsLimitReached(true);
      setShowLimitModal(true);
    }
  }, [todayUsage, usageLimit]);

  const loadUsageData = async () => {
    try {
      const storedUsageData = await AsyncStorage.getItem('social_media_usage');
      const storedTodayUsage = await AsyncStorage.getItem('today_social_media_usage');
      const storedUsageLimit = await AsyncStorage.getItem('social_media_usage_limit');

      if (storedUsageData) setUsageData(JSON.parse(storedUsageData));
      if (storedTodayUsage) setTodayUsage(JSON.parse(storedTodayUsage));
      if (storedUsageLimit) setUsageLimit(JSON.parse(storedUsageLimit));
    } catch (error) {
      console.error('Failed to load usage data:', error);
    }
  };

  const saveUsageData = async () => {
    try {
      await AsyncStorage.multiSet([
        ['social_media_usage', JSON.stringify(usageData)],
        ['today_social_media_usage', JSON.stringify(todayUsage)],
        ['social_media_usage_limit', JSON.stringify(usageLimit)],
      ]);
    } catch (error) {
      console.error('Failed to save usage data:', error);
    }
  };

  const addUsageTime = (minutes: number) => {
    const today = new Date().toISOString().slice(0, 10);
    setTodayUsage(prev => prev + minutes);

    // Update or add today's usage in the usage data array
    const existingEntryIndex = usageData.findIndex(entry => entry.date === today);
    if (existingEntryIndex > -1) {
      const updatedData = [...usageData];
      updatedData[existingEntryIndex].minutes += minutes;
      setUsageData(updatedData);
    } else {
      setUsageData([...usageData, { date: today, minutes }]);
    }
  };

  const resetDailyUsage = () => {
    setTodayUsage(0);
    setIsLimitReached(false);
  };

  const getLastSevenDaysData = () => {
    const today = new Date();
    const lastSevenDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      return date.toISOString().slice(0, 10);
    }).reverse();

    return lastSevenDays.map(date => {
      const entry = usageData.find(d => d.date === date);
      return {
        date,
        minutes: entry ? entry.minutes : 0,
      };
    });
  };

  const UsageLimitModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showLimitModal}
      onRequestClose={() => setShowLimitModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Daily Limit Reached!</Text>
          <Text style={styles.modalText}>
            You've reached your daily social media limit of {usageLimit} minutes.
            Take a break and focus on your tasks instead!
          </Text>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setShowLimitModal(false)}
          >
            <Text style={styles.modalButtonText}>Got it!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const SocialMediaStats = () => {
    const lastSevenDays = getLastSevenDaysData();
    
    const chartData = {
      labels: lastSevenDays.map(d => d.date.slice(5)), // MM-DD format
      datasets: [
        {
          data: lastSevenDays.map(d => d.minutes),
          color: (opacity = 1) => `rgba(233, 30, 99, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };

    const chartConfig = {
      backgroundGradientFrom: '#fff',
      backgroundGradientTo: '#fff',
      color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
      strokeWidth: 2,
      decimalPlaces: 0,
      style: {
        borderRadius: 16,
      },
    };

    return (
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Social Media Usage</Text>
        <View style={styles.usageSummary}>
          <Text style={styles.usageText}>Today: {todayUsage} min</Text>
          <Text style={styles.usageText}>Limit: {usageLimit} min</Text>
          <Text style={[
            styles.usageText, 
            todayUsage > usageLimit * 0.8 ? styles.usageWarning : null
          ]}>
            {Math.max(usageLimit - todayUsage, 0)} min remaining
          </Text>
        </View>

        <View style={styles.chartContainer}>
          <LineChart
            data={chartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        <TouchableOpacity 
          style={styles.setLimitButton}
          onPress={() => setShowUsageLimit(true)}
        >
          <Text style={styles.setLimitText}>Set Daily Limit</Text>
        </TouchableOpacity>

        {showUsageLimit && (
          <View style={styles.limitSelector}>
            <Text style={styles.limitTitle}>Set Daily Usage Limit (minutes)</Text>
            <View style={styles.limitOptions}>
              {[30, 60, 90, 120].map(limit => (
                <TouchableOpacity
                  key={limit}
                  style={[
                    styles.limitOption,
                    usageLimit === limit ? styles.selectedLimit : null,
                  ]}
                  onPress={() => {
                    setUsageLimit(limit);
                    setShowUsageLimit(false);
                  }}
                >
                  <Text style={[
                    styles.limitOptionText,
                    usageLimit === limit ? styles.selectedLimitText : null,
                  ]}>
                    {limit}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  };

  return {
    todayUsage,
    usageLimit,
    addUsageTime,
    resetDailyUsage,
    SocialMediaStats,
    UsageLimitModal,
    isLimitReached,
  };
};

const styles = StyleSheet.create({
  statsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 10,
  },
  usageSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  usageText: {
    fontSize: 16,
    color: '#333',
  },
  usageWarning: {
    color: '#E91E63',
    fontWeight: 'bold',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  chart: {
    borderRadius: 16,
  },
  setLimitButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  setLimitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  limitSelector: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  limitTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  limitOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  limitOption: {
    width: 60,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
    borderRadius: 8,
  },
  selectedLimit: {
    backgroundColor: '#2196F3',
  },
  limitOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedLimitText: {
    color: '#fff',
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
    color: '#E91E63',
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
    paddingVertical: 10,
    borderRadius: 20,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});