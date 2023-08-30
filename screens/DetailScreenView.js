import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProgressView from '../components/ProgressView.js';
import RewardView from '../components/RewardView.js';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import QRView from '../components/QRView.js';


const Tab = createBottomTabNavigator();

const DetailScreenView = ({ route }) => {
    const { card } = route.params;


    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let icon;

                    if (route.name === 'Progress') {
                        icon = focused ? (
                            <FontAwesome5 name="calendar-check" size={size} color={color} />
                        ) : (
                            <FontAwesome5 name="calendar-check" size={size} color={color} />
                        );
                    } 
                    if (route.name === 'QR Code') {
                        icon = focused ? (
                            <Ionicons name="qr-code-outline" size={size} color={color} />
                        ) : (
                            <Ionicons name="qr-code-outline" size={size} color={color} />
                        );
                    } 
                    
                    else if (route.name === 'Rewards') {
                        icon = focused ? (
                            <MaterialIcons name="card-giftcard" size={size} color={color} />
                        ) : (
                            <MaterialIcons name="card-giftcard" size={size} color={color} />
                        );
                    }

                    return icon;
                },
                tabBarActiveTintColor: 'purple',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: { display: 'flex' },
                headerShown: false,
            })}
        >
            <Tab.Screen name="Progress">
                {() => <ProgressView card={card} />}
            </Tab.Screen>
            <Tab.Screen name="Rewards">
                {() => <RewardView card={card} />}
            </Tab.Screen>
            <Tab.Screen name="QR Code">
                {() => <QRView card={card} />}
            </Tab.Screen>
        </Tab.Navigator>
    );
};


export default DetailScreenView;
