import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, Image } from 'react-native';

import ProgressView from '../components/ProgressView.js';
import RewardView from '../components/RewardView.js';


const Tab = createBottomTabNavigator();

const DetailScreenView = ({ route }) => {
    const { card } = route.params;

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let icon;

                    if (route.name === 'Progress') {
                        icon = focused
                            ? require('../assets/progress.png')
                            : require('../assets/progress.png');
                    } else if (route.name === 'Rewards') {
                        icon = focused
                            ? require('../assets/reward.png')
                            : require('../assets/reward.png');
                    }

                    return <Image source={icon} style={{ width: size, height: size }} />;
                },
                tabBarActiveTintColor: 'blue',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: [{ display: 'flex' }, null],
                headerShown: false,
            })}
        >
            <Tab.Screen name="Progress">
                {() => <ProgressView card={card} />}
            </Tab.Screen>
            <Tab.Screen name="Rewards">
                {() => <RewardView card={card} />}
            </Tab.Screen>
        </Tab.Navigator>
    );
};

const styles = {
    tabContainer: {
        flex: 1,
        backgroundColor: 'white',
        
    },
    heading: {
        fontSize: 24,
        marginBottom: 10,
        textAlign: 'center',
    },
};

export default DetailScreenView;
