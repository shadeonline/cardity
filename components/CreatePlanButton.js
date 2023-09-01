import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

const CreatePlanButton = ({ text, onPress }) => {
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = screenWidth - 40; // Subtracting padding or margin

  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, { width: cardWidth }]}>
      <Text style={styles.text}>+</Text>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 220,
    backgroundColor: '#e8e9ed',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  text: {
    fontSize: 25,
  },
});

export default CreatePlanButton;
