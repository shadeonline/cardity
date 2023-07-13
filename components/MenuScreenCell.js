import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Cell, Section, TableView, Separator } from 'react-native-tableview-simple';

const MenuScreenCell = ({ content, key }) => {
    const [counter, setCounter] = useState(0);

    const incrementCounter = () => {
        setCounter(counter + 1);
    };

    const decrementCounter = () => {
        if (counter > 0) {
            setCounter(counter - 1);
        }
    };

    return (
        <Cell
            key={key}
            contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', height: 290, width: '100%', backgroundColor: 'transparent', highlightColor: "#ccc" }}
            cellContentView={
                <View>
                    <Text>{content.title}</Text>
                    {content.imgUri ? (
                        <Image source={content.imgUri} style={[styles.image, { height: '70%', aspectRatio: 15 / 9 }]} />
                    ) : (
                        <Image source={require('../assets/placeholder.jpg')} style={[styles.image, { height: '70%', aspectRatio: 15 / 9 }]} />
                    )}
                    <View style={styles.counterContainer}>
                        <TouchableOpacity onPress={decrementCounter} style={styles.counterButton}>
                            <Text style={styles.counterButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.counterText}>{counter}</Text>
                        <TouchableOpacity onPress={incrementCounter} style={styles.counterButton}>
                            <Text style={styles.counterButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
        />
    );
};
const styles = {
    counterContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
    },
    counterButtonText: {
      fontSize: 18,
      fontWeight: 'bold',
      paddingHorizontal: 10,
      paddingVertical: 5,
      backgroundColor: '#ccc',
      borderRadius: 5,
      marginHorizontal: 5,
    },
  };
export default MenuScreenCell;