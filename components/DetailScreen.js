
import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Dimensions, TouchableOpacity } from 'react-native';

import Card from './Card.js';
import StampCard from './StampCard.js';

const DetailScreen = ({ route }) => {
    const { card } = route.params;

    return (
        <ScrollView>
            <Card
                name={card.name}
                cardId={card.cardId}
                imgUri={card.imgUri}
                card={card}
            />
            <View style={{ padding: 40, backgroundColor: 'white', }}>
                <Text style={styles.heading}>Stamps Collected!</Text>
                <StampCard rows={5} stampsPerRow={6} progress={card.progress} />
            </View>
        </ScrollView>
    );
};

const styles = {
    heading: {
        fontSize: 24,
        marginBottom: 10,
        textAlign: 'center'
    },
};
export default DetailScreen