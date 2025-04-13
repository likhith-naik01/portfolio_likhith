import { useState } from 'react';
import Sentiment from 'sentiment';
import { Alert } from 'react-native';

export const useSentimentAnalyzer = () => {
  const sentiment = new Sentiment();
  const [currentMood, setCurrentMood] = useState<'positive' | 'neutral' | 'negative'>('neutral');
  const [moodDescription, setMoodDescription] = useState('');

  const analyzeSentiment = (text: string): 'positive' | 'neutral' | 'negative' => {
    const result = sentiment.analyze(text);
    let mood: 'positive' | 'neutral' | 'negative' = 'neutral';
    
    if (result.score > 2) {
      mood = 'positive';
    } else if (result.score < -2) {
      mood = 'negative';
    }
    
    setCurrentMood(mood);
    return mood;
  };

  const analyzeMoodDescription = (description: string) => {
    setMoodDescription(description);
    const mood = analyzeSentiment(description);
    return mood;
  };

  const getMoodBasedSuggestion = () => {
    switch (currentMood) {
      case 'positive':
        return {
          message: "You're in a great mood! Perfect time to tackle challenging tasks.",
          emoji: "😊",
          suggestedTaskTypes: ["difficult", "time-taking"],
          suggestedTasks: [
            "Start that difficult project you've been putting off",
            "Learn something new and challenging",
            "Help someone else with their tasks"
          ]
        };
      case 'negative':
        return {
          message: "It's okay to feel down. Let's start with something small.",
          emoji: "🌧️",
          suggestedTaskTypes: ["easy", "moderate"],
          suggestedTasks: [
            "Take a short walk outside",
            "Complete a quick, easy task for a win",
            "Practice 5 minutes of mindfulness"
          ]
        };
      default:
        return {
          message: "Ready to be productive today?",
          emoji: "😐",
          suggestedTaskTypes: ["moderate", "time-taking"],
          suggestedTasks: [
            "Organize your workspace",
            "Plan out your day",
            "Set a goal for today"
          ]
        };
    }
  };

  return {
    analyzeSentiment,
    analyzeMoodDescription,
    currentMood,
    moodDescription,
    getMoodBasedSuggestion
  };
};
