import React from 'react';
import { Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { auth } from '../firebase';

const QRView = ({ card }) => {
    const userUID = auth.currentUser?.uid;
    const cardDetails = 'cardity:'+JSON.stringify({ ...card, userUID });
    console.log(cardDetails);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
            <Text>{card.cardName}</Text>
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
