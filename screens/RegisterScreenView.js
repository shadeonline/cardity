import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc, addDoc, getDocs, query, where } from "firebase/firestore";
import { auth, firestore } from '../firebase'

const RegisterScreenView = () => {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')


    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                createProfileForUser(user.uid, email, name);
                console.log('Registered with:', user.email);
            })
            .catch(error => alert(error.message))
    };

    const createProfileForUser = async (userUid, email, name) => {
        try {
            const profilesCollection = collection(firestore, "profiles");
            // Generate a new profile document with the user's UID as the document ID
            const profileDocRef = doc(profilesCollection, userUid);
            // Set data for the profile (name, email)
            const profileData = {
                email: email,
                name: name,
                loyaltyCards: []
            };
            // Save the data to the profile document
            await setDoc(profileDocRef, profileData);
            console.log("Profile created for user:", userUid);
        } catch (error) {
            console.error("Error creating profile:", error);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <Image source={require("../assets/Cardity2.png")} style={[styles.image,]} />
            <View style={styles.inputContainer} >
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    autoCapitalize='none'
                />
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={name}
                    onChangeText={text => setName(text)}
                    autoCapitalize='none'
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    secureTextEntry
                    autoCapitalize='none'
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSignUp}
                >
                    <Text style={styles.buttonText}>Create new account</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

export default RegisterScreenView

const styles = StyleSheet.create({
    image: {
        height: '30%',
        aspectRatio: 1 / 1
    },
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    inputContainer: {
        width: '80%'
    },
    input: {
        backgroundColor: '#e8e9ed',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    button: {
        backgroundColor: '#14A44D',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
})