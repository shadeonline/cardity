import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/core';

const ColorSelector = ({ onColorChange }) => {
  const colors = [ '#2541b2', '#1768ac', '#06bee1','#ffc2c7', '#ffb1f2', '#dd9eff','#c966ff', '#792cff'];

  // Initialize selectedColor with the first color
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  return (
    <View style={styles.colorSelector}>
      {colors.map((color, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.colorButton,
            { backgroundColor: color, borderColor: color === selectedColor ? 'green' : 'transparent' },
          ]}
          onPress={() => {
            setSelectedColor(color); // Update selectedColor when a color is pressed
            onColorChange(color);
          }}
        />
      ))}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  tag: {
    fontSize: 15,
    marginBottom: 5,
  },
  colorSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 20,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 5,
  },
});


export default ColorSelector;