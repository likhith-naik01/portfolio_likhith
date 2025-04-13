import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  Alert,
  Modal,
  Animated,
  BackHandler,
  Dimensions,
  Pressable,
  PanResponder
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native';

// Task types
type TaskPriority = 'high' | 'medium' | 'low';
type TaskType = 'easy' | 'moderate' | 'difficult' | 'time-taking';
type Task = { 
  id: string; 
  title: string; 
  completed: boolean; 
  priority: TaskPriority; 
  type: TaskType;
  createdAt: number;
};

export default function YourMainScreen() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [streak, setStreak] = useState(0);
  const [lastActiveDate, setLastActiveDate] = useState('');
  const [lastCompletedDate, setLastCompletedDate] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [isRestMode, setIsRestMode] = useState(false);
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [currentPriority, setCurrentPriority] = useState<TaskPriority>('medium');
  const [currentType, setCurrentType] = useState<TaskType>('moderate');

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;

  const navigation = useNavigation();

  useEffect(() => {
    loadData();
    
    // Handle back button during focus mode
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isFocused) {
        // If in focus mode, return to normal view
        setIsFocused(false);
        return true; // Prevent default behavior
      }
      return false; // Let default behavior happen
    });

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    saveData();
  }, [tasks, streak, lastActiveDate]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isFocused && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (isRestMode && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isFocused, timer, isRestMode, restTimer]);

  // Animation on component mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  // Configure pan responder for swipe delete
  const createPanResponder = (taskId: string) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx < -50) {
          // Swipe left to delete
          deleteTask(taskId);
        }
      },
      onPanResponderRelease: () => {},
    });
  };

  const saveData = async () => {
    try {
      await AsyncStorage.multiSet([
        ['tasks', JSON.stringify(tasks)],
        ['streak', streak.toString()],
        ['lastActiveDate', lastActiveDate],
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save data');
    }
  };

  const loadData = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      const storedStreak = await AsyncStorage.getItem('streak');
      const storedDate = await AsyncStorage.getItem('lastActiveDate');

      if (storedTasks) setTasks(JSON.parse(storedTasks));
      if (storedStreak) setStreak(parseInt(storedStreak));
      if (storedDate) setLastActiveDate(storedDate);
      
      updateStreak();
    } catch (error) {
      Alert.alert('Error', 'Failed to load data');
    }
  };

  const getToday = () => new Date().toISOString().slice(0, 10);

  const updateStreak = () => {
    const today = getToday();
    if (lastActiveDate === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    if (lastActiveDate === yesterdayStr) {
      setStreak(prev => prev + 1);
    } else {
      setStreak(1);
    }

    setLastActiveDate(today);
  };

  const prepareToAddTask = () => {
    if (task.trim() === '') return;
    setShowPriorityModal(true);
  };

  const addTask = () => {
    if (task.trim() === '') return;

    const newTask = { 
      id: uuid.v4(), 
      title: task.trim(), 
      completed: false,
      priority: currentPriority,
      type: currentType,
      createdAt: Date.now()
    };

    const currentDate = new Date().toLocaleDateString();
    if (lastCompletedDate !== currentDate) {
      setLastCompletedDate(currentDate);
    }
    
    // Show task addition animation
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: -30,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    
    setTasks([newTask, ...tasks]);
    setTask('');
    setCurrentPriority('medium');
    setCurrentType('moderate');
  };
  const toggleTaskCompletion = (id: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          return { ...task, completed: !task.completed };
        }
        return task;
      })
    );
    
    // Update these in the YourMainScreen component state
const [moodAnalysisResult, setMoodAnalysisResult] = useState(null);

// Add this function to the YourMainScreen component
const handleTaskSelectFromMood = (taskTitle, taskType = 'moderate') => {
  setTask(taskTitle);
  setCurrentType(taskType);
  // Optionally set priority based on mood
  if (currentMood === 'positive') {
    setCurrentPriority('high');
  } else if (currentMood === 'negative') {
    setCurrentPriority('low');
  } else {
    setCurrentPriority('medium');
  }
};

// Add this function to the YourMainScreen component
const addTaskFromMood = (taskTitle, taskType = 'moderate') => {
  if (taskTitle.trim() === '') return;
  
  let priority: TaskPriority = 'medium';
  if (currentMood === 'positive') {
    priority = 'high';
  } else if (currentMood === 'negative') {
    priority = 'low';
  }
  
  const newTask = { 
    id: uuid.v4().toString(), 
    title: taskTitle.trim(), 
    completed: false,
    priority: priority,
    type: taskType as TaskType,
    createdAt: Date.now()
  };
  
  setTasks([newTask, ...tasks]);
  
  // Add points for creating a task
  addPoints(5);
};

// Update the handleMoodSubmit function
const handleMoodSubmit = (description) => {
  const mood = analyzeMoodDescription(description);
  const suggestion = getMoodBasedSuggestion();
  
  // Animate in the mood result
  Animated.sequence([
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 200,
      useNativeDriver: true,
    }),
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }),
  ]).start();
  
  setMoodAnalysisResult(suggestion);
};

// Then in your render, update the tasks view to include the MoodResultDisplay
{activeView === 'tasks' && (
  <>
    <MoodEntry onMoodSubmit={handleMoodSubmit} />
    
    <MoodResultDisplay 
      moodAnalysisResult={moodAnalysisResult}
      onTaskSelect={handleTaskSelectFromMood}
    />
    
    {/* Your existing TextInput and other UI elements */}
  </>
)}
    // Animate task completion
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const startFocusMode = () => {
    setTimer(25 * 60); // 25 minutes
    setIsFocused(true);
  };
  
  const endFocusMode = () => {
    // Start rest mode for 5 minutes
    setIsFocused(false);
    setIsRestMode(true);
    setRestTimer(5 * 60); // 5 minutes
  };
  
  const endRestMode = () => {
    setIsRestMode(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#ff9800';
    }
  };

  const getTypeIcon = (type: TaskType) => {
    switch (type) {
      case 'easy': return '🌱';
      case 'moderate': return '🌻';
      case 'difficult': return '🌲';
      case 'time-taking': return '⏳';
      default: return '🌻';
    }
  };

  const renderItem = ({ item }: { item: Task }) => {
    const panResponder = createPanResponder(item.id);
    
    return (
      <Animated.View 
        {...panResponder.panHandlers}
        style={{
          transform: [{ translateX: slideAnim }],
          opacity: fadeAnim,
        }}
      >
        <TouchableOpacity 
          onPress={() => toggleTaskCompletion(item.id)} 
          style={[
            styles.taskItem,
            { borderLeftColor: getPriorityColor(item.priority), borderLeftWidth: 5 }
          ]}
        >
          <View style={styles.taskContent}>
            <Text style={[styles.taskText, item.completed && styles.taskDone]}>
              {item.title}
            </Text>
            <View style={styles.taskMeta}>
              <Text style={styles.taskType}>{getTypeIcon(item.type)}</Text>
              <Text style={styles.taskPriority}>
                {item.priority === 'high' ? '⚠️' : item.priority === 'medium' ? '•' : '○'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Add these functions to YourMainScreen component
const handleCreateMoodTask = () => {
    // Focus the task input and show a placeholder suggestion
    const placeholderTasks = {
      'positive': 'Create a challenging task that excites you',
      'negative': 'Add a small, manageable task to feel accomplished',
      'neutral': 'What would you like to accomplish today?'
    };
    
    setTask(placeholderTasks[currentMood] || '');
    
    // You could also automatically open your task creation modal
    // setShowPriorityModal(true);
  };
  
  // Update your rendering to include MoodAwareTaskSystem
  {activeView === 'tasks' && (
    <>
    <MoodEntry onMoodSubmit={handleMoodSubmit} />
    
    <MoodResultDisplay 
      moodAnalysisResult={moodAnalysisResult}
      onTaskSelect={handleTaskSelectFromMood}
    />
    
    <MoodStats 
      tasks={tasks}
      currentMood={currentMood}
    />
    
    <TextInput
      value={task}
      onChangeText={setTask}
      placeholder="Type a task..."
      style={styles.input}
      onSubmitEditing={prepareToAddTask}
      returnKeyType="done"
    />
      
      {/* Your existing TextInput and other UI elements */}
    </>
  )}

  // Focus Mode Screen
  if (isFocused) {
    return (
      <Pressable 
        style={styles.focusContainer} 
        onPress={() => setIsFocused(false)}
      >
        <View style={styles.focusTimerContainer}>
          <Text style={styles.focusTimerText}>{formatTime(timer)}</Text>
          <Text style={styles.focusInstructionText}>Stay focused! Tap anywhere to exit</Text>
          <TouchableOpacity 
            style={styles.endFocusButton}
            onPress={endFocusMode}
          >
            <Text style={styles.endFocusButtonText}>End Focus Session</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    );
  }

  // Rest Mode Screen
  if (isRestMode) {
    return (
      <View style={styles.restContainer}>
        <Text style={styles.restTitle}>Rest Time</Text>
        <Text style={styles.restTimerText}>{formatTime(restTimer)}</Text>
        <Text style={styles.restInstructionText}>
          Great job on your focus session! Take a short break.
        </Text>
        <TouchableOpacity 
          style={styles.endRestButton}
          onPress={endRestMode}
        >
          <Text style={styles.endRestButtonText}>Skip Rest</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
        }
      ]}
    >
      <Text style={styles.title}>Life Sucks 🧠</Text>
      <Text style={styles.streak}>🔥 Streak: {streak} {streak === 1 ? 'day' : 'days'}</Text>

      <TextInput
        value={task}
        onChangeText={setTask}
        placeholder="Type a task..."
        style={styles.input}
        onSubmitEditing={prepareToAddTask}
        returnKeyType="done"
      />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={prepareToAddTask} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Task</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={startFocusMode} style={styles.focusButton}>
          <Text style={styles.buttonText}>Focus (25min)</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ marginTop: 20 }}
      />

      <TouchableOpacity
        style={styles.compareButton}
        onPress={() => navigation.navigate('FriendsComparison')}
      >
        <Text style={{ color: '#fff' }}>👀 See how friends are working</Text>
      </TouchableOpacity>

      {/* Priority Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPriorityModal}
        onRequestClose={() => setShowPriorityModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Task Priority</Text>
            <View style={styles.priorityOptions}>
              <TouchableOpacity 
                style={[styles.priorityOption, styles.highPriority]}
                onPress={() => {
                  setCurrentPriority('high');
                  setShowPriorityModal(false);
                  setShowTypeModal(true);
                }}
              >
                <Text style={styles.priorityText}>High</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.priorityOption, styles.mediumPriority]}
                onPress={() => {
                  setCurrentPriority('medium');
                  setShowPriorityModal(false);
                  setShowTypeModal(true);
                }}
              >
                <Text style={styles.priorityText}>Medium</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.priorityOption, styles.lowPriority]}
                onPress={() => {
                  setCurrentPriority('low');
                  setShowPriorityModal(false);
                  setShowTypeModal(true);
                }}
              >
                <Text style={styles.priorityText}>Low</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Task Type Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showTypeModal}
        onRequestClose={() => setShowTypeModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Task Type</Text>
            <View style={styles.typeOptions}>
              <TouchableOpacity 
                style={[styles.typeOption, styles.easyType]}
                onPress={() => {
                  setCurrentType('easy');
                  setShowTypeModal(false);
                  addTask();
                }}
              >
                <Text style={styles.typeText}>Easy 🌱</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.typeOption, styles.moderateType]}
                onPress={() => {
                  setCurrentType('moderate');
                  setShowTypeModal(false);
                  addTask();
                }}
              >
                <Text style={styles.typeText}>Moderate 🌻</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.typeOption, styles.difficultType]}
                onPress={() => {
                  setCurrentType('difficult');
                  setShowTypeModal(false);
                  addTask();
                }}
              >
                <Text style={styles.typeText}>Difficult 🌲</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.typeOption, styles.timeTakingType]}
                onPress={() => {
                  setCurrentType('time-taking');
                  setShowTypeModal(false);
                  addTask();
                }}
              >
                <Text style={styles.typeText}>Time-taking ⏳</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingTop: 80, 
    paddingHorizontal: 20, 
    backgroundColor: '#fff' 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    color: '#222', 
    textAlign: 'center' 
  },
  streak: { 
    fontSize: 18, 
    color: '#e91e63', 
    textAlign: 'center', 
    marginBottom: 20 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 12, 
    padding: 12, 
    fontSize: 16, 
    backgroundColor: '#f9f9f9' 
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  addButton: { 
    flex: 1,
    backgroundColor: '#222', 
    padding: 12, 
    borderRadius: 12, 
    alignItems: 'center',
    marginRight: 10, 
  },
  addButtonText: { 
    color: '#fff', 
    fontSize: 16 
  },
  focusButton: {
    flex: 1,
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  compareButton: { 
    marginTop: 10, 
    backgroundColor: '#4caf50', 
    padding: 12, 
    borderRadius: 12, 
    alignItems: 'center' 
  },
  taskItem: { 
    padding: 12, 
    marginVertical: 6, 
    borderRadius: 10, 
    backgroundColor: '#f0f0f0',
  },
  taskContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskText: { 
    fontSize: 18, 
    color: '#333',
    flex: 1,
  },
  taskDone: { 
    textDecorationLine: 'line-through', 
    color: '#888' 
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskPriority: {
    fontSize: 16,
    marginLeft: 5,
  },
  taskType: {
    fontSize: 16,
    marginRight: 5,
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
    marginBottom: 20,
  },
  priorityOptions: {
    width: '100%',
  },
  priorityOption: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    alignItems: 'center',
  },
  highPriority: {
    backgroundColor: '#ffcdd2',
  },
  mediumPriority: {
    backgroundColor: '#ffecb3',
  },
  lowPriority: {
    backgroundColor: '#c8e6c9',
  },
  priorityText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  typeOptions: {
    width: '100%',
  },
  typeOption: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    alignItems: 'center',
  },
  easyType: {
    backgroundColor: '#e8f5e9',
  },
  moderateType: {
    backgroundColor: '#fff3e0',
  },
  difficultType: {
    backgroundColor: '#ffebee',
  },
  timeTakingType: {
    backgroundColor: '#e0f7fa',
  },
  typeText: {
    fontSize: 18,
  },
  focusContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusTimerContainer: {
    alignItems: 'center',
  },
  focusTimerText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  focusInstructionText: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 30,
  },
  endFocusButton: {
    backgroundColor: '#e91e63',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  endFocusButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  restContainer: {
    flex: 1,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  restTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#388e3c',
    marginBottom: 20,
  },
  restTimerText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#4caf50',
    marginBottom: 30,
  },
  restInstructionText: {
    fontSize: 18,
    color: '#1b5e20',
    textAlign: 'center',
    marginBottom: 30,
  },
  endRestButton: {
    backgroundColor: '#81c784',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
  },
  endRestButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});