import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const MoodAwareTaskSystem = ({ currentMood, tasks, onTaskCreate }) => {
  const [suggestion, setSuggestion] = useState<{ message: string; action: string } | null>(null);

  useEffect(() => {
    const getMoodSuggestion = () => {
      if (!currentMood) return null;
      
      const completedTasks = tasks.filter(t => t.completed).length;
      const incompleteTasks = tasks.filter(t => !t.completed).length;

      if (currentMood === 'positive') {
        return incompleteTasks > 3 
          ? { message: "Tackle challenging tasks!", action: "Create Difficult Task" }
          : { message: "Start something new!", action: "Create Any Task" };
      }
      
      if (currentMood === 'negative') {
        return completedTasks === 0
          ? { message: "Start with something small", action: "Create Easy Task" }
          : { message: "Complete one more task", action: "Mark Task Complete" };
      }

      return { message: "Ready to be productive?", action: "Create Task" };
    };

    setSuggestion(getMoodSuggestion());
  }, [currentMood, tasks]);

  if (!suggestion) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{suggestion.message}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => onTaskCreate(suggestion.action)}
      >
        <Text style={styles.buttonText}>{suggestion.action}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f4f8',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  button: {
    backgroundColor: '#4a90e2',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MoodAwareTaskSystem;
