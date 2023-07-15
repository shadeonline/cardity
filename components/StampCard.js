import React, { useState } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, Modal } from 'react-native';
import StampTaskModal from './StampTaskModal';
const StampCard = ({ rows, stampsPerRow, progress }) => {
  const [selectedStamp, setSelectedStamp] = useState(null);

  const handleStampPress = (stampKey) => {
    setSelectedStamp(stampKey);
    console.log(stampKey)
  };

  const renderStampRows = () => {
    const stamps = [];

    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < stampsPerRow; j++) {
        const stampKey = i * stampsPerRow + j;
        const isFilled = stampKey < progress;
        const isLastStamp = j === stampsPerRow - 1;

        if (isLastStamp) {
          // Add treasure chest image to the last stamp in each row
          row.push(
            <TouchableOpacity
              key={stampKey}
              id='reward'
              style={styles.stamp}
              onPress={() => handleStampPress(stampKey)}
            >
              <Image
                source={require('../assets/treasure-chest.png')}
                style={styles.crownImage}
              />
              {isFilled && (
                <Image source={require('../assets/stamp.png')} style={styles.stampImage} />
              )}
            </TouchableOpacity>
          );
        } else {
          row.push(
            // Add numbers to each stamp and render img on top if stamp is filled
            <TouchableOpacity
              key={stampKey}
              style={styles.stamp}
              onPress={() => handleStampPress(stampKey)}
            >
              <Text>{stampKey + 1}</Text>
              {isFilled && (
                <Image source={require('../assets/stamp.png')} style={styles.stampImage} />
              )}
            </TouchableOpacity>
          );
        }
      }
      stamps.push(
        <View key={i} style={styles.stampRow}>
          {row}
        </View>
      );
    }
    return stamps;
  };

  const handleCloseModal = () => {
    setSelectedStamp(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Stamps Collected!</Text>
      {renderStampRows()}
      <StampTaskModal
        selectedStamp={selectedStamp}
        progress={progress}
        onCloseModal={handleCloseModal} 
        stampsPerRow = {stampsPerRow}/>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    textAlign: 'center',
    fontSize: 25,
    paddingVertical: 10,
  },
  container: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 20,
    justifyContent: 'center',
  },
  stampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stamp: {
    position: 'relative',
    width: 35,
    height: 35,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 12,
    borderRadius: 25,
    backgroundColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
  },
  crownImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  stampImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});

export default StampCard;
