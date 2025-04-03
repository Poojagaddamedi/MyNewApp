// TestScreen.js
import React, { useState } from 'react';
import { View, ScrollView, Button, Text, StyleSheet } from 'react-native';
import { createTestUsers, cleanupTestUsers } from './testUtilities';

const TestScreen = () => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateUsers = async () => {
    setIsLoading(true);
    const creationResults = await createTestUsers();
    setResults(creationResults);
    setIsLoading(false);
  };

  const handleCleanup = async () => {
    setIsLoading(true);
    const cleanupResults = await cleanupTestUsers();
    setResults(cleanupResults);
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <Button 
        title="Create Test Users" 
        onPress={handleCreateUsers} 
        disabled={isLoading}
      />
      
      <Button
        title="Cleanup Test Users"
        onPress={handleCleanup}
        disabled={isLoading}
        color="red"
      />
      
      <ScrollView style={styles.resultsContainer}>
        {results.map((result, index) => (
          <Text key={index} style={styles.resultText}>
            {result}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  resultsContainer: {
    marginTop: 20,
  },
  resultText: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export default TestScreen;