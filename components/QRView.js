import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';


const QRView = ({ card }) => {
    const cardDetails = 'cardity:' + JSON.stringify(card);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>QR Code for {card.cardName}</Text>
            <Text>{cardDetails}</Text>

            <QRCode
                value={cardDetails}
                size={200}
                color="black"
                backgroundColor="white"
            />
        </View>
    );
};

export default QRView;

