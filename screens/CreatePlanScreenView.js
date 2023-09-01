import React, { useState } from 'react';
import ColorSelector from "../components/ColorSelector.js";
import { ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { auth, firestore } from '../firebase';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';





const CreatePlanScreenView = () => {
    const navigation = useNavigation();

    const [description, setDescription] = useState('');
    const [cardName, setCardName] = useState('');
    const [storeName, setStoreName] = useState('');
    const [color, setColor] = useState('#ffc2c7');
    const [rewards, setRewards] = useState([{ stamps: '', reward: '' }]); // Initial state with one empty reward

    // Function to add a new reward field
    const addRewardField = () => {
        setRewards([...rewards, { stamps: '', reward: '' }]);
    };

    const handleCreatePlan = async () => {
        try {
            // Add new loyalty program document
            const loyaltyProgramRef = collection(firestore, 'loyaltyPrograms');
            const newLoyaltyProgram = {
                description: description,
                loyaltyCard: '', // Leave it empty for now
                rewards: parseRewardsInput(), // Parse the rewards input and store as a map
                storeName: storeName,
            };
            const programDocRef = await addDoc(loyaltyProgramRef, newLoyaltyProgram);

            // Add new loyalty card document
            const loyaltyCardRef = collection(firestore, 'loyaltyCards');
            const newLoyaltyCard = {
                cardName: cardName,
                color: color,
                loyaltyProgram: doc(firestore, `loyaltyPrograms/${programDocRef.id}`), // Create a reference here
            };
            const loyaltyCardDocRef = await addDoc(loyaltyCardRef, newLoyaltyCard);

            // Update the loyaltyCard field in newLoyaltyProgram
            const updatedLoyaltyProgram = {
                ...newLoyaltyProgram,
                loyaltyCard: doc(firestore, `loyaltyCards/${loyaltyCardDocRef.id}`), // Create a reference here
            };
            await setDoc(programDocRef, updatedLoyaltyProgram);

            // Navigate back to admin screen or wherever you want
            navigation.goBack();
            console.log("Plan Created!");
        } catch (error) {
            console.error('Error creating plan:', error);
        }
    };

    // Function to parse rewards input and convert it into an map
    const parseRewardsInput = () => {
        const parsedRewards = {};
        rewards.forEach(reward => {
            if (reward.stamps && reward.reward) {
                // Use the stamps as keys and the reward as the value in the map
                parsedRewards[reward.stamps] = reward.reward;
            }
        });
        return parsedRewards;
    };

    return (
        <View style={styles.container}>
            <ScrollView >
                <Text style={styles.heading}>Create Loyalty Plan</Text>

                <Text style={styles.tag}>Card Name:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="i.e: Stag Nite Bar Card"
                    value={cardName}
                    onChangeText={text => setCardName(text)}
                />

                <Text style={styles.tag}>Store Name:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="i.e: Stag Nite Bar"
                    value={storeName}
                    onChangeText={text => setStoreName(text)}
                />

                <Text style={styles.tag}>Loyalty Plan Description:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="i.e: Earn great and awesome reward with this plan"
                    value={description}
                    onChangeText={text => setDescription(text)}
                />

                <Text style={styles.tag}>Color of loyalty card:</Text>
                <ColorSelector onColorChange={setColor} />

                {/* Input fields for rewards */}
                <Text style={styles.tag}>Rewards:</Text>
                {rewards.map((reward, index) => (
                    <View key={index} style={styles.rewardRow}>
                        <TextInput
                            style={styles.rewardInput}
                            placeholder="Stamps required (i.e: 5)"
                            value={reward.stamps}
                            onChangeText={text => {
                                const updatedRewards = [...rewards];
                                updatedRewards[index].stamps = text;
                                setRewards(updatedRewards);
                            }}
                        />
                        <TextInput
                            style={styles.rewardInput}
                            placeholder="Reward (i.e: 1 free drink)"
                            value={reward.reward}
                            onChangeText={text => {
                                const updatedRewards = [...rewards];
                                updatedRewards[index].reward = text;
                                setRewards(updatedRewards);
                            }}
                        />
                    </View>
                ))}

                {/* Add Reward button */}
                <TouchableOpacity style={styles.addRewardButton} onPress={addRewardField}>
                    <Text style={styles.buttonText}>Add Reward</Text>
                </TouchableOpacity>

            </ScrollView>

            <TouchableOpacity style={styles.createPlanButton} onPress={handleCreatePlan}>
                <Text style={styles.buttonText}>Create Plan</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CreatePlanScreenView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    heading: {
        fontSize: 24,
        marginBottom: 20,
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
    createPlanButton: {
        backgroundColor: '#0782F9',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
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
});
