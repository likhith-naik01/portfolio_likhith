import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  Alert,
  ScrollView,
  Animated,
  Modal,
  Pressable,
  BackHandler
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Dimensions } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

// Import our components
import { FocusMode } from './FocusMode';
import FriendsComparisonScreen from './FriendsComparisonScreen';
// Custom hooks (would need to be implemented)
import { useSocialMediaTracker } from './SocialMediaTracker';
import { useRewardsSystem } from './RewardSyatem';
import { useSentimentAnalyzer } from './SentimentalAnalyzer';

const screenWidth = Dimensions.get("window").width;
const Stack = createStackNavigator();

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

// MoodSuggestion type
type MoodSuggestion = {
  message: string;
  suggestedTasks: string[];
};

// MoodAnalysisResult type
type MoodAnalysisResult = {
  emoji: string;
  message: string;
  suggestedTasks: string[];
};
// Mood Entry Component
const MoodEntry = ({ onMoodSubmit }: { onMoodSubmit: (description: string) => void }) => {
  const [moodDescription, setMoodDescription] = useState('');
  const [showMoodInput, setShowMoodInput] = useState(false);
  
  const handleMoodSubmit = () => {
    if (moodDescription.trim()) {
      onMoodSubmit(moodDescription);
      setMoodDescription('');
      setShowMoodInput(false);
    }
  };
  
  return (
    <View style={styles.moodContainer}>
      <TouchableOpacity 
        style={styles.moodButton}
        onPress={() => setShowMoodInput(!showMoodInput)}
      >
        <Text style={styles.moodButtonText}>
          {showMoodInput ? "Close" : "How's Your Mood?"}
        </Text>
      </TouchableOpacity>
      
      {showMoodInput && (
        <View style={styles.moodInputContainer}>
          <TextInput
            value={moodDescription}
            onChangeText={setMoodDescription}
            placeholder="Describe how you're feeling right now..."
            style={styles.moodInput}
            multiline={true}
            numberOfLines={3}
          />
          <TouchableOpacity 
            style={styles.moodSubmitButton}
            onPress={handleMoodSubmit}
          >
            <Text style={styles.moodSubmitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// Mood Result Display Component
const MoodResultDisplay = ({ result }: { result: MoodAnalysisResult | null }) => {
  if (!result) return null;

  return (
    <View style={styles.moodResultContainer}>
      <View style={styles.moodEmojiContainer}>
        <Text style={styles.moodEmoji}>{result.emoji}</Text>
      </View>
      <Text style={styles.moodResultText}>{result.message}</Text>
      {result.suggestedTasks.length > 0 && (
        <View style={styles.moodSuggestedTasks}>
          <Text style={styles.moodSuggestedTaskTitle}>Suggested Activities:</Text>
          {result.suggestedTasks.map((task, index) => (
            <TouchableOpacity
              key={index}
              style={styles.moodSuggestedTaskItem}
            >
              <Text style={styles.moodSuggestedTaskText}>{task}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};
const YourMainScreen = ({ navigation }) => {
  // Basic task state
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [streak, setStreak] = useState(0);
  const [lastActiveDate, setLastActiveDate] = useState('');
  const [lastCompletedDate, setLastCompletedDate] = useState<string | null>(null);
  
  // Priority and type modals
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [currentPriority, setCurrentPriority] = useState<TaskPriority>('medium');
  const [currentType, setCurrentType] = useState<TaskType>('moderate');
  
  // Pomodoro timer & focus state
  const [timer, setTimer] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [isRestMode, setIsRestMode] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [moodAnalysisResult, setMoodAnalysisResult] = useState<MoodAnalysisResult | null>(null);
  
  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(100))[0];
  
  // Integration of custom hooks
  const { 
    todayUsage, 
    addUsageTime, 
    SocialMediaStats, 
    UsageLimitModal,
    isLimitReached 
  } = useSocialMediaTracker();
  
  const {
    points,
    addPoints,
    RewardsModal,
    RewardsList,
    showRewardModal
  } = useRewardsSystem();
  
  // Task input sentiment analysis
  const [moodSuggestion, setMoodSuggestion] = useState<MoodSuggestion>({
    message: '',
    suggestedTasks: []
  });

  // Active view state
  const [activeView, setActiveView] = useState<'tasks' | 'social' | 'rewards'>('tasks');

  useEffect(() => {
    loadData();
    
    // Animation on component mount
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

  const { analyzeSentiment, currentMood, getMoodBasedSuggestion } = useSentimentAnalyzer();
  
  const handleMoodSubmit = (description: string) => {
    // Implement the mood analysis logic
    const mood = analyzeSentiment(description);
    const suggestion = getMoodBasedSuggestion();
    setMoodAnalysisResult({
      emoji: '😊', // Default emoji, should be based on analysis
      message: `Based on your mood, we think you might be feeling ${mood}`,
      suggestedTasks: ['Take a short walk', 'Meditate for 5 minutes', 'Write in a journal']
    });
  };

  // Analyze mood when task changes
  useEffect(() => {
    if (task.length > 5) {
      const mood = analyzeSentiment(task);
      setMoodSuggestion(getMoodBasedSuggestion());
    }
  }, [task]);

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
      id: uuid.v4().toString(), 
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
    
    // Add points for creating a task
    addPoints(5);
  };
  
  const toggleTaskCompletion = (id: string) => {
    setTasks(prev => {
      const updatedTasks = prev.map(task => {
        if (task.id === id) {
          const newCompletedState = !task.completed;
          
          // Add points when task is completed
          if (newCompletedState) {
            addPoints(10);
          }
          
          return { ...task, completed: newCompletedState };
        }
        return task;
      });
      return updatedTasks;
    });
    
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

  const startFocusMode = () => {
    setTimer(25 * 60); // 25 minutes
    setIsFocused(true);
    setIsTimerActive(true);
  };

  const handleFocusComplete = () => {
    setIsFocused(false);
    setIsRestMode(true);
    setRestTimer(5 * 60); // 5 minutes rest
    // Give reward points for completing a pomodoro session
    addPoints(25);
    Alert.alert(
      "Great job!", 
      "You've completed a focus session and earned 25 points!"
    );
  };

  const handleFocusCancel = () => {
    setIsFocused(false);
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
      case 'easy': return '☘️';
      case 'moderate': return '💛';
      case 'difficult': return '🔺';
      case 'time-taking': return '⏳';
      default: return '🌻';
    }
  };
  const renderItem = ({ item }: { item: Task }) => {
    // Reference to the swipeable component
    let swipeableRef: Swipeable | null = null;
    
    // Function to delete task
    const deleteTask = (id: string) => {
      setTasks(prev => prev.filter(task => task.id !== id));
      // Close swipeable after delete
      if (swipeableRef) {
        swipeableRef.close();
      }
    };
    
    // Render right actions (delete button)
    const renderRightActions = (id: string) => {
      return (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteTask(id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      );
    };
    
    return (
      <Swipeable
        ref={ref => { swipeableRef = ref }}
        renderRightActions={() => renderRightActions(item.id)}
        overshootRight={false}
      >
        <Animated.View 
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
                  {item.priority === 'high' ? '🔴' : item.priority === 'medium' ? '•' : '○'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </Swipeable>
    );
  };

  // Use FocusMode component when in focus mode
  if (isFocused) {
    return <FocusMode onFocusComplete={handleFocusComplete} onFocusCancel={handleFocusCancel} />;
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
        { opacity: fadeAnim }
      ]}
    >
      <Text style={styles.title}>Life Sucks 🧠</Text>
      <Text style={styles.streak}>🔥 Streak: {streak} {streak === 1 ? 'day' : 'days'}</Text>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeView === 'tasks' && styles.activeTabButton]}
          onPress={() => setActiveView('tasks')}
        >
          <Text style={[styles.tabText, activeView === 'tasks' && styles.activeTabText]}>Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeView === 'social' && styles.activeTabButton]}
          onPress={() => setActiveView('social')}
        >
          <Text style={[styles.tabText, activeView === 'social' && styles.activeTabText]}>Social</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeView === 'rewards' && styles.activeTabButton]}
          onPress={() => setActiveView('rewards')}
        >
          <Text style={[styles.tabText, activeView === 'rewards' && styles.activeTabText]}>Rewards</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.contentContainer}>
        {activeView === 'tasks' && (
          <>
            {/* Mood Entry */}
            <MoodEntry onMoodSubmit={handleMoodSubmit} />

            {/* Display Mood Analysis Result */}
            <MoodResultDisplay result={moodAnalysisResult} />

            <TextInput
              value={task}
              onChangeText={setTask}
              placeholder="Type a task..."
              style={styles.input}
              onSubmitEditing={prepareToAddTask}
              returnKeyType="done"
            />

            {moodSuggestion.message !== '' && task.length > 5 && (
              <View style={styles.moodSuggestionContainer}>
                <Text style={styles.moodMessage}>{moodSuggestion.message}</Text>
                {moodSuggestion.suggestedTasks.length > 0 && (
                  <View style={styles.suggestedTasksContainer}>
                    <Text style={styles.suggestedTasksTitle}>Suggested tasks:</Text>
                    {moodSuggestion.suggestedTasks.map((suggestedTask, index) => (
                      <TouchableOpacity 
                        key={index} 
                        style={styles.suggestedTask}
                        onPress={() => setTask(suggestedTask)}
                      >
                        <Text style={styles.suggestedTaskText}>{suggestedTask}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}

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
              scrollEnabled={false}
              nestedScrollEnabled
            />

            <TouchableOpacity
              style={styles.friendsButton}
              onPress={() => navigation.navigate('FriendsComparison')}
            >
              <Text style={styles.buttonText}>See How Friends Are Doing</Text>
            </TouchableOpacity>
          </>
        )}

        {activeView === 'social' && <SocialMediaStats />}
        {activeView === 'rewards' && <RewardsList />}
      </ScrollView>
      
      {/* Modals */}
      <UsageLimitModal />
      <RewardsModal />
      
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
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  streak: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  taskItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  taskContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskText: {
    flex: 1,
    fontSize: 16,
  },
  taskDone: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskType: {
    marginRight: 8,
    fontSize: 16,
  },
  taskPriority: {
    fontSize: 18,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  focusButton: {
    backgroundColor: '#2196f3',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
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
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  priorityOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  priorityOption: {
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  priorityText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  highPriority: {
    backgroundColor: '#f44336',
  },
  mediumPriority: {
    backgroundColor: '#ff9800',
  },
  lowPriority: {
    backgroundColor: '#4caf50',
  },
  typeOptions: {
    width: '100%',
  },
  typeOption: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
  },
  typeText: {
    fontWeight: 'bold',
  },
  easyType: {
    backgroundColor: '#e0f7fa',
  },
  moderateType: {
    backgroundColor: '#e8f5e9',
  },
  difficultType: {
    backgroundColor: '#fff3e0',
  },
  timeTakingType: {
    backgroundColor: '#fbe9e7',
  },
  restContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    padding: 20,
  },
  restTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  restTimerText: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  restInstructionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  endRestButton: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  endRestButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
  },
  activeTabButton: {
    borderBottomColor: '#2196f3',
  },
  tabText: {
    fontSize: 16,
    color: '#757575',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: '#2196f3',
  },
  contentContainer: {
    flex: 1,
  },
  moodSuggestionContainer: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  moodMessage: {
    fontSize: 16,
    marginBottom: 10,
  },
  suggestedTasksContainer: {
    marginTop: 5,
  },
  suggestedTasksTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  suggestedTask: {
    backgroundColor: '#bbdefb',
    padding: 8,
    borderRadius: 4,
    marginVertical: 3,
  },
  suggestedTaskText: {
    fontSize: 14,
  },
  friendsButton: {
    backgroundColor: '#9c27b0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  moodContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  moodButton: {
    backgroundColor: '#673ab7',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  moodButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  moodInputContainer: {
    marginTop: 15,
  },
  moodInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  moodSubmitButton: {
    backgroundColor: '#5e35b1',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  moodSubmitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  moodResultContainer: {
    marginTop: 15,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#ede7f6',
  },
  moodEmojiContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  moodEmoji: {
    fontSize: 40,
    marginBottom: 5,
  },
  moodResultText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  moodSuggestedTasks: {
    marginTop: 10,
  },
  moodSuggestedTaskTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 14,
  },
  moodSuggestedTaskItem: {
    backgroundColor: '#d1c4e9',
    padding: 10,
    borderRadius: 6,
    marginVertical: 4,
  },
  moodSuggestedTaskText: {
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});

// Define the App component
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="YourMainScreen">
        <Stack.Screen 
          name="YourMainScreen" 
          component={YourMainScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="FriendsComparison" 
          component={FriendsComparisonScreen} 
          options={{ title: "Friends' Progress" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;