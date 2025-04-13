import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

// Function to determine emoji based on progress
const getStatusEmoji = (progress) => {
  if (progress >= 80) return '🔥'; // On fire
  if (progress >= 70) return '😊'; // Happy
  if (progress >= 50) return '😐'; // Neutral
  return '😓'; // Struggling
};

// Function to determine status text
const getStatusText = (progress) => {
  if (progress >= 80) return 'Excellent';
  if (progress >= 70) return 'Good';
  if (progress >= 50) return 'Average';
  return 'Needs Help';
};

const FriendsComparisonScreen = () => {
  const [friendsProgress, setFriendsProgress] = useState([
    { 
      id: '1',
      name: 'Alice', 
      progress: 80, 
      currentTask: 'Project Documentation',
      lastActive: '2 hours ago',
      notes: [
        {
          id: 'n1',
          content: 'Just finished the API documentation. Feeling accomplished! 📚',
          timestamp: '2 hours ago',
          likes: 12
        },
        {
          id: 'n2',
          content: 'Working on the user guide today. Need coffee! ☕',
          timestamp: '1 day ago',
          likes: 8
        }
      ]
    },
    { 
      id: '2',
      name: 'Bob', 
      progress: 50, 
      currentTask: 'UI Design',
      lastActive: '5 hours ago',
      notes: [
        {
          id: 'n3',
          content: 'Stuck on this navbar design. Any suggestions? 🤔',
          timestamp: '5 hours ago',
          likes: 3
        }
      ]
    },
    { 
      id: '3',
      name: 'Charlie', 
      progress: 75, 
      currentTask: 'Backend Development',
      lastActive: 'Just now',
      notes: [
        {
          id: 'n4',
          content: 'Fixed that pesky bug in the authentication service! 🐛',
          timestamp: 'Just now',
          likes: 15
        },
        {
          id: 'n5',
          content: 'Starting work on the database optimization today.',
          timestamp: '4 hours ago',
          likes: 7
        }
      ]
    },
    { 
      id: '4',
      name: 'David', 
      progress: 60, 
      currentTask: 'Testing',
      lastActive: '1 day ago',
      notes: [
        {
          id: 'n6',
          content: 'Found 3 critical bugs in the payment system. Working on fixes now.',
          timestamp: '1 day ago',
          likes: 9
        }
      ]
    },
  ]);

  const data = {
    labels: friendsProgress.map((friend) => `${friend.name} ${getStatusEmoji(friend.progress)}`),
    datasets: [
      {
        data: friendsProgress.map((friend) => friend.progress),
        color: (opacity = 1) => `rgba(3, 155, 229, ${opacity})`, // Blue
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#e0f7fa',
    backgroundGradientFrom: '#e0f7fa',
    backgroundGradientTo: '#e0f7fa',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    barPercentage: 0.7, // Make bars slightly thinner
  };

  const renderNoteItem = ({ item }) => (
    <View style={styles.noteItem}>
      <Text style={styles.noteContent}>{item.content}</Text>
      <View style={styles.noteFooter}>
        <Text style={styles.noteTimestamp}>{item.timestamp}</Text>
        <View style={styles.likesContainer}>
          <Text style={styles.likesIcon}>❤️</Text>
          <Text style={styles.likesCount}>{item.likes}</Text>
        </View>
      </View>
    </View>
  );

  const renderFriendItem = ({ item }) => (
    <TouchableOpacity style={styles.friendCard}>
      <View style={styles.friendHeader}>
        <Text style={styles.friendName}>{item.name} {getStatusEmoji(item.progress)}</Text>
        <Text style={[styles.statusText, { 
          color: item.progress >= 70 ? '#4caf50' : 
                 item.progress >= 50 ? '#ff9800' : '#f44336' 
        }]}>
          {getStatusText(item.progress)}
        </Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${item.progress}%` }]} />
        <Text style={styles.progressText}>{item.progress}%</Text>
      </View>
      
      <View style={styles.taskInfo}>
        <Text style={styles.taskLabel}>Current Task:</Text>
        <Text style={styles.taskText}>{item.currentTask}</Text>
      </View>
      
      <Text style={styles.lastActive}>Last active: {item.lastActive}</Text>
      
      {/* Public Notes Section */}
      {item.notes && item.notes.length > 0 && (
        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>Public Notes</Text>
          <FlatList
            data={item.notes}
            renderItem={renderNoteItem}
            keyExtractor={note => note.id}
            scrollEnabled={false}
          />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends' Progress</Text>
      
      {/* Smaller chart with straight labels */}
      <View style={styles.chartContainer}>
        <BarChart
          data={data}
          width={screenWidth - 40}
          height={180} // Reduced height
          chartConfig={chartConfig}
          verticalLabelRotation={0} // Straight labels
          horizontalLabelRotation={0} // Ensure horizontal labels are straight too
          style={styles.chart}
          yAxisSuffix="%"
          showValuesOnTopOfBars={true} // Show values on top of bars
        />
      </View>
      
      <Text style={styles.sectionTitle}>Friends Status & Updates</Text>
      <FlatList
        data={friendsProgress}
        renderItem={renderFriendItem}
        keyExtractor={item => item.id}
        style={styles.friendsList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40, // Reduced top padding to move everything up
    paddingHorizontal: 20,
    backgroundColor: '#e0f7fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5, // Reduced margin
    color: '#039be5',
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 5, // Reduced margin
  },
  chart: {
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10, // Reduced margin
    marginBottom: 10,
    color: '#0277bd',
  },
  friendsList: {
    flex: 1,
    marginTop: 5,
  },
  friendCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  friendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  friendName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressContainer: {
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#039be5',
    borderRadius: 10,
  },
  progressText: {
    position: 'absolute',
    right: 10,
    top: 1,
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  taskInfo: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  taskLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 5,
  },
  taskText: {
    fontSize: 14,
  },
  lastActive: {
    fontSize: 12,
    color: '#757575',
    fontStyle: 'italic',
  },
  notesSection: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0277bd',
  },
  noteItem: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  noteContent: {
    fontSize: 14,
    marginBottom: 5,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteTimestamp: {
    fontSize: 12,
    color: '#757575',
    fontStyle: 'italic',
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likesIcon: {
    fontSize: 12,
    marginRight: 3,
  },
  likesCount: {
    fontSize: 12,
    color: '#757575',
  },
});

export default FriendsComparisonScreen;