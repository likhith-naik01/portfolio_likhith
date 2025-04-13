import React from 'react';
import { View, Text, StyleSheet, Button, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const FriendsComparisonScreen = () => {
  const navigation = useNavigation();

  const data = {
    labels: ['Ali 🐯', 'John 💪', 'Sara 🌸', 'Mira 🧠'],
    datasets: [
      {
        data: [80, 55, 70, 90],
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Friends Progress</Text>
      <View style={styles.chartContainer}>
        <BarChart
          data={data}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          verticalLabelRotation={30}
          fromZero
          showValuesOnTopOfBars
        />
      </View>
      <Button title="🔙 Back to Tasks" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f4f5',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  chartContainer: {
    borderRadius: 16,
    overflow: 'hidden', // This ensures the chart does not get cut off
    marginBottom: 20, // Ensure the chart isn't too close to the button
  },
});

export default FriendsComparisonScreen;
