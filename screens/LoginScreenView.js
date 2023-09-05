import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc, addDoc, getDoc, query, where } from "firebase/firestore";
import { auth, firestore } from '../firebase'

const LoginScreenView = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigation = useNavigation()

    useEffect(() => {
        const authState = auth.onAuthStateChanged(async user => {
            if (user) {
                try {
                    const userProfileRef = doc(firestore, 'profiles', user.uid);
                    const userProfileDoc = await getDoc(userProfileRef);

                    if (userProfileDoc.exists()) {
                        const userProfile = userProfileDoc.data();

                        if (userProfile.admin) {
                            navigation.navigate("Login")
                            navigation.replace("Admin");
                        } else {
                            navigation.navigate("Login")
                            navigation.replace("Loyalty Cards");
                        }
                    } else {
                        alert("User profile not found.");
                    }
                } catch (error) {
                    console.log("Error fetching user profile:", error);
                }
            }
        });

        return authState;
    }, []);

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('Logged in with:', user.email);
        } catch (error) {
            alert(error.message);
        }
    }



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
                    onPress={handleLogin}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>


                <TouchableOpacity
                    style={[styles.button, styles.buttonGreen]}
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={styles.buttonText}>Create new account</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

export default LoginScreenView

const styles = StyleSheet.create({
    image: {
        height: '30%',
        aspectRatio: 1 / 1
    },
    container: {
        flex: 1,
        justifyContent: 'center',
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
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonGreen: {
        backgroundColor: '#14A44D',
        marginTop: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
})