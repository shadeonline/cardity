import React, { useState } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import StampTaskModal from './StampTaskModal';

const StampCard = ({ maxRewardStamps, progress, rewards, task }) => {
  const [selectedStamp, setSelectedStamp] = useState(null);

  const handleStampPress = (stampKey) => {
    setSelectedStamp(stampKey);
  };
  const handleCloseModal = () => {
    setSelectedStamp(null);
  };

  const renderStampRows = () => {
    const stamps = [];
    const stampsPerRow = 5;

    for (let i = 0; i < Math.ceil(maxRewardStamps / stampsPerRow); i++) {
      const row = [];

      for (let j = 1; j <= stampsPerRow; j++) {
        const stampKey = i * stampsPerRow + j;

        if (stampKey > maxRewardStamps) {
          break;
        }

        const isFilled = stampKey <= progress;
        const reward = rewards[stampKey];

        row.push(
          <TouchableOpacity
            key={stampKey}
            style={styles.stamp}
            onPress={() => handleStampPress(stampKey)}
          >
            {reward && (
              <Image
                source={require('../assets/treasure-chest.png')}
                style={styles.crownImage}
              />
            )}
            <Text>{stampKey}</Text>
            {isFilled && (
              <Image source={require('../assets/stamp.png')} style={styles.stampImage} />
            )}
          </TouchableOpacity>
        );
      }

      stamps.push(
        <View key={i} style={styles.stampRow}>
          {row}
        </View>
      );
    }

    return stamps;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Stamps Collected!</Text>
      {renderStampRows()}

      <StampTaskModal
        selectedStamp={selectedStamp}
        progress={progress}
        task={task}
        onCloseModal={handleCloseModal} 
        rewards= {rewards}/>
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
    marginTop: 10,
  },
  stamp: {
    position: 'relative',
    width: 35,
    height: 35,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
    borderRadius: 25,
    backgroundColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
  },
  crownImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    position: 'absolute',
    top: 0,
    left: 0,
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
