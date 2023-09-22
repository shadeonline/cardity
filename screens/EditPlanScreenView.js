import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/core';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
} from 'react-native';
import { firebaseEditLoyaltyPlan } from '../firebaseFunctions.js';
import { Ionicons } from '@expo/vector-icons';
import ColorSelector from "../components/ColorSelector.js";

const EditPlanScreenView = ({ route }) => {
    const navigation = useNavigation();



    const { programData } = route.params;
    const [editedDescription, setEditedDescription] = useState(programData.description);
    const [editedCardName, setEditedCardName] = useState(programData.loyaltyCard.cardName);
    const [editedStoreName, setEditedStoreName] = useState(programData.storeName);
    const [editedColor, setEditedColor] = useState(programData.loyaltyCard.color);
    const [editedTask, setEditedTask] = useState(programData.task);

    const formattedRewards = Object.keys(programData.rewards).map((stamps) => ({
        stamps,
        reward: programData.rewards[stamps],
    }));
    const [editedRewards, setEditedRewards] = useState(formattedRewards);

    const addRewardField = () => {
        setEditedRewards([...editedRewards, { stamps: '', reward: '' }]);
    };

    const removeRewardField = (index) => {
        const updatedRewards = [...editedRewards];
        updatedRewards.splice(index, 1);
        setEditedRewards(updatedRewards);
    };

    const handleEditPlan = async () => {
        if (
            !editedCardName ||
            !editedStoreName ||
            !editedDescription ||
            !editedRewards.some((reward) => {
                const stamps = parseInt(reward.stamps);
                return Number.isInteger(stamps) && stamps > 0 && reward.reward;
            })
        ) {
            Alert.alert('Validation Error', 'Please fill in all required fields correctly.');
            return;
        }
        const success = await firebaseEditLoyaltyPlan(
            programData.id,
            editedDescription,
            editedCardName,
            editedStoreName,
            editedColor,
            parseRewardsInput(editedRewards),
            editedTask
        );
        if (success) {
            // Plan created successfully, navigate to a success screen or handle as needed.
            console.log('Plan Edited!');
            navigation.goBack();
        } else {
            // Error occurred while creating the plan
            console.log('Plan not Edited!');
        }
    };

    const parseRewardsInput = () => {
        const parsedRewards = {};
        editedRewards.forEach((reward) => {
            if (reward.stamps && reward.reward) {
                parsedRewards[reward.stamps] = reward.reward;
            }
        });
        return parsedRewards;
    };


    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">

            <Text style={styles.tag}>Card Name:</Text>
            <TextInput
                style={styles.input}
                placeholder="i.e: Stag Nite Bar Card"
                value={editedCardName}
                onChangeText={(text) => setEditedCardName(text)}
            />

            <Text style={styles.tag}>Store Name:</Text>
            <TextInput
                style={styles.input}
                placeholder="i.e: Stag Nite Bar"
                value={editedStoreName}
                onChangeText={(text) => setEditedStoreName(text)}
            />

            <Text style={styles.tag}>Loyalty Plan Description:</Text>
            <TextInput
                style={styles.input}
                placeholder="i.e: Earn great and awesome reward with this plan"
                value={editedDescription}
                onChangeText={(text) => setEditedDescription(text)}
            />

            <Text style={styles.tag}>Task:</Text>
            <TextInput
                style={styles.input}
                placeholder="i.e: Earn great and awesome reward with this plan"
                value={editedTask}
                onChangeText={(text) => setEditedTask(text)}
            />

            <Text style={styles.tag}>Color of loyalty card:</Text>
            <View style={styles.colorPicker}>
                <ColorSelector onColorChange={setEditedColor} selectedColor={editedColor} />
            </View>

            {/* Input fields for rewards */}
            <Text style={styles.tag}>Rewards:</Text>
            {editedRewards.map((reward, index) => (
                <View key={index} style={styles.rewardRow}>
                    <TextInput
                        style={styles.rewardInput}
                        placeholder="Stamps required (i.e: 5)"
                        value={reward.stamps}
                        onChangeText={(text) => {
                            const updatedRewards = [...editedRewards];
                            updatedRewards[index].stamps = text;
                            setEditedRewards(updatedRewards);
                        }}
                    />
                    <TextInput
                        style={styles.rewardInput}
                        placeholder="Reward (i.e: 1 free drink)"
                        value={reward.reward}
                        onChangeText={(text) => {
                            const updatedRewards = [...editedRewards];
                            updatedRewards[index].reward = text;
                            setEditedRewards(updatedRewards);
                        }}
                    />
                    <TouchableOpacity style={styles.removeRewardButton} onPress={() => removeRewardField(index)}>
                        <Ionicons name="ios-trash-outline" size={24} color="red" />
                    </TouchableOpacity>
                </View>
            ))}

            {/* Add Reward button */}
            <TouchableOpacity style={styles.addRewardButton} onPress={addRewardField}>
                <Text style={styles.buttonText}>Add Reward</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.createPlanButton} onPress={handleEditPlan}>
                <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

export default EditPlanScreenView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    heading: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    tag: {
        fontSize: 15,
        marginBottom: 5,
    },
    input: {
        marginBottom: 15,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    colorPicker: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    createPlanButton: {
        backgroundColor: '#0782F9',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    addRewardButton: {
        backgroundColor: '#14A44D',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 60,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    rewardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    rewardInput: {
        flex: 1,
        marginRight: 5,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    removeRewardButton: {
        alignSelf: 'flex-start',
        padding: 10,
        borderRadius: 5,
    },
});
