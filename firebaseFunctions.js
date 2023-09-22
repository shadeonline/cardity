import { auth, firestore, firebase } from './firebase';
import { collection, getDocs, doc, getDoc, updateDoc, arrayUnion, addDoc, setDoc, query, where } from 'firebase/firestore';

// Function to delete a loyalty card from the user's profile
const firebaseDeleteCard = async (card) => {
    // Delete the specified card from the user's profile.
    // Returns true on successful deletion, false otherwise.
    try {
        const user = auth.currentUser;
        if (user) {
            const profileRef = doc(firestore, "profiles", user.uid);
            const profileSnapshot = await getDoc(profileRef);
            const profileData = profileSnapshot.data();

            // Find the index of the card to delete in the loyaltyCards array
            const cardIndex = profileData.loyaltyCards.findIndex(
                (loyaltyCard) => loyaltyCard.cardId === card.cardId
            );
            if (cardIndex !== -1) {
                // Remove the card from the loyaltyCards array
                profileData.loyaltyCards.splice(cardIndex, 1);

                // Update the user's profile in Firestore
                await updateDoc(profileRef, {
                    loyaltyCards: profileData.loyaltyCards,
                });
                return true; // Deletion was successful
            }
        }
    } catch (error) {
        console.error("Error deleting card:", error);
    }
    return false; // Deletion failed
};

// Function to fetch the updated progress of a loyalty card
const firebaseFetchUpdatedProgress = async (card) => {
    // Fetch and return the updated progress of a loyalty card.
    try {
        const user = auth.currentUser;
        if (user) {
            const profileRef = doc(firestore, "profiles", user.uid);
            const profileSnapshot = await getDoc(profileRef);
            const cardDetails = profileSnapshot.data().loyaltyCards.find(
                (loyaltyCard) => loyaltyCard.cardId === card.cardId
            );
            return cardDetails.progress;
        }
    } catch (error) {
        console.log("Error fetching updated progress:", error);
    }
    return null;
};

// Function to fetch details of a loyalty program
const firebaseFetchLoyaltyProgram = async (card) => {
    // Fetch and return details of a loyalty program associated with a card.
    const loyaltyProgramDocRef = doc(firestore, card.loyaltyProgram);
    try {
        const loyaltyProgramDocSnapshot = await getDoc(loyaltyProgramDocRef);
        if (loyaltyProgramDocSnapshot.exists()) {
            return loyaltyProgramDocSnapshot.data();
        } else {
            console.log("Loyalty program does not exist.");
        }
    } catch (error) {
        console.log("Error fetching loyalty program:", error);
    }
    return null;
};


// Function to fetch loyalty programs and associated data created by a user
const firebaseFetchLoyaltyProgramsByUser = async (uid) => {
    const loyaltyProgramsCollectionRef = collection(firestore, 'loyaltyPrograms');
  
    // Create a query to fetch loyalty programs where createdBy matches the user's UID
    const loyaltyProgramsQuery = query(
        loyaltyProgramsCollectionRef,
        where('createdBy', '==', uid)
    );
  
    try {
        const loyaltyProgramsQuerySnapshot = await getDocs(loyaltyProgramsQuery);
        const loyaltyPrograms = [];
  
        for (const doc of loyaltyProgramsQuerySnapshot.docs) {
            if (doc.exists()) {
                const loyaltyProgramData = doc.data();
  
                // Retrieve the associated loyalty card data
                const loyaltyCardRef = loyaltyProgramData.loyaltyCard;
                const loyaltyCardSnapshot = await getDoc(loyaltyCardRef);
                const loyaltyCardData = loyaltyCardSnapshot.data();
                const rewards = loyaltyProgramData.rewards;
  
                // Include the document IDs
                const loyaltyProgramId = doc.id;
                const loyaltyCardId = loyaltyCardSnapshot.id;
  
                loyaltyPrograms.push({
                    ...loyaltyProgramData,
                    loyaltyCard: { ...loyaltyCardData, id: loyaltyCardId },
                    rewards: rewards,
                    id: loyaltyProgramId,
                });
            }
        }
  
        return loyaltyPrograms;
    } catch (error) {
        console.log('Error fetching loyalty programs:', error);
    }
  
    return [];
};



// Function to fetch user profile along with filtered rewards
const firebaseFetchUserProfileReward = async (card) => {
    // Fetch the user's profile and filter rewards based on the cardId.
    // Returns an object containing the user's profile and filtered rewards.
    try {
        const user = auth.currentUser;
        if (user) {
            const profileRef = doc(firestore, "profiles", user.uid);
            const profileSnapshot = await getDoc(profileRef);

            if (profileSnapshot.exists()) {
                const profileData = profileSnapshot.data();

                // Filter rewards based on the cardId
                const filteredRewards = profileData.rewards.filter(
                    (reward) => reward.cardId == card.cardId
                );
                return { ...profileData, rewards: filteredRewards };
            }
        }
    } catch (error) {
        console.log("Error fetching profile:", error);
    }
    return null;
};

// Function to fetch user profile
const firebaseFetchProfile = async () => {
    // Fetch and return the user's profile.
    try {
        const user = auth.currentUser;
        if (user) {
            const profileRef = doc(firestore, "profiles", user.uid);
            const profileSnapshot = await getDoc(profileRef);

            if (profileSnapshot.exists()) {
                return profileSnapshot.data();
            } else {
                console.log("Profile does not exist");
            }
        }
    } catch (error) {
        console.log("Error fetching profile:", error);
    }
    return null;
};

// Function to create a new loyalty plan
const firebaseCreateLoyaltyPlan = async (description, cardName, storeName, color, rewards, task) => {
    // Create a new loyalty program and card, and associate them.
    // Returns true on success, false on error.
    try {
        // Add new loyalty program document
        const loyaltyProgramRef = collection(firestore, 'loyaltyPrograms');
        const newLoyaltyProgram = {
            description: description,
            loyaltyCard: '', // Leave it empty for now
            rewards: rewards,
            storeName: storeName,
            createdBy: auth.currentUser.uid,
            task: task
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

        return true; // Success
    } catch (error) {
        console.error('Error creating plan:', error);
        return false; // Error occurred
    }
};

const firebaseEditLoyaltyPlan = async (planId, updatedDescription, updatedCardName, updatedStoreName, updatedColor, updatedRewards, updatedTask) => {
    try {
        // Update existing loyalty program document
        const programDocRef = doc(firestore, 'loyaltyPrograms', planId);
        const updatedProgramData = {
            description: updatedDescription,
            storeName: updatedStoreName,
            rewards: updatedRewards,
            task: updatedTask
        };
        await updateDoc(programDocRef, updatedProgramData);

        // Get the associated loyalty card ID from the program
        const programSnapshot = await getDoc(programDocRef);
        const { loyaltyCard } = programSnapshot.data();

        // Update the associated loyalty card document
        const cardDocRef = doc(firestore, 'loyaltyCards', loyaltyCard.id);
        const updatedCardData = {
            cardName: updatedCardName,
            color: updatedColor,
        };
        await updateDoc(cardDocRef, updatedCardData);

        // Update the loyaltyCard field in the loyalty program document
        const updatedLoyaltyProgramData = {
            ...updatedProgramData,
            loyaltyCard: cardDocRef,
        };
        await updateDoc(programDocRef, updatedLoyaltyProgramData);

        return true; // Success
    } catch (error) {
        console.error('Error editing plan:', error);
        return false; // Error occurred
    }
};


// Function to fetch card data for an array of cards
const firebaseFetchCardData = (cards) => {
    // Fetch and return card data for an array of cards.
    const fetchPromises = cards.map((card) => {
        const loyaltyCardRef = doc(firestore, card.loyaltyCard);
        return getDoc(loyaltyCardRef)
            .then((loyaltyCardSnapshot) => {
                if (loyaltyCardSnapshot.exists()) {
                    const loyaltyCardData = loyaltyCardSnapshot.data();
                    const { cardName, image, color } = loyaltyCardData;
                    const updatedCard = {
                        cardId: card.cardId,
                        loyaltyCard: card.loyaltyCard,
                        cardName,
                        image,
                        color,
                        loyaltyProgram: card.loyaltyProgram,
                        progress: card.progress,
                    };
                    return updatedCard;
                } else {
                    console.log(`Loyalty card with reference ${card.loyaltyCard} does not exist.`);
                    return card;
                }
            });
    });

    return Promise.all(fetchPromises)
        .then((updatedCards) => {
            return updatedCards;
        })
        .catch((error) => {
            console.log("Error fetching card data:", error);
            return [];
        });
};

// Function to request and store a push notification token
const firebaseRequestAndStorePushToken = async (userUid) => {
    // Request push notification permissions and store the token in the user's profile.
    try {
        // Check if the pushToken already exists in the profile
        if (!profile.pushToken) {
            // Request push notification permissions
            const { status } = await Notifications.requestPermissionsAsync();
            if (status === 'granted') {
                console.log("Permission Granted");
                const token = (await Notifications.getExpoPushTokenAsync()).data;
                await setDoc(
                    doc(firestore, "profiles", userUid),
                    { pushToken: token },
                    { merge: true }
                );
                console.log("Push Token saved for user:", userUid);
            } else {
                console.warn("Push notification permission not granted.");
            }
        }
    } catch (error) {
        console.error("Error requesting and storing push token:", error);
    }
};


// Function to fetch a list of loyalty programs from Firestore
const firebaseFetchLoyaltyPrograms = async () => {
    // Fetch and return a list of loyalty programs.
    try {
        const loyaltyProgramsCollectionRef = collection(firestore, 'loyaltyPrograms');
        const loyaltyProgramsSnapshot = await getDocs(loyaltyProgramsCollectionRef);

        const loyaltyProgramsData = [];

        for (const docSnapshot of loyaltyProgramsSnapshot.docs) {
            const data = docSnapshot.data();
            const docPath = docSnapshot.ref;
            data.docPath = docPath;
            loyaltyProgramsData.push(data);
        }
        return loyaltyProgramsData;
    } catch (error) {
        console.log("Error fetching loyalty programs:", error);
        return [];
    }
};

// Function to add a loyalty card to the user's profile
const firebaseAddLoyaltyCardToProfile = async (userUid, plan) => {
    // Add a loyalty card to the user's profile, if it doesn't already exist.
    const user = auth.currentUser;
    if (user) {
        try {
            // Fetch the user's profile document
            const profileRef = doc(firestore, "profiles", userUid);
            const profileSnapshot = await getDoc(profileRef);

            if (profileSnapshot.exists()) {
                const profileData = profileSnapshot.data();
                const existingCard = profileData.loyaltyCards.find(card =>
                    card.loyaltyCard === plan.loyaltyCard.path &&
                    card.loyaltyProgram === plan.docPath.path
                );

                if (existingCard) {
                    console.log("Card already exists in user's profile.");
                    alert("This card is already in your profile.");
                    // Handle the scenario where the card already exists in the user's profile
                } else {
                    // Card doesn't exist, add it to the user's profile
                    const card = {
                        loyaltyCard: plan.loyaltyCard.path,
                        loyaltyProgram: plan.docPath.path,
                        cardId: Math.floor(100000000000 + Math.random() * 900000000000),
                        progress: 0
                    };

                    // Update the user's profile with the new card information
                    await updateDoc(profileRef, {
                        loyaltyCards: arrayUnion(card)
                    });

                    alert("Card added to profile successfully");
                }
            }
        } catch (error) {
            alert("Error adding card to profile:", error);
        }
    }
};


// Function to collect a stamp on a loyalty card
const firebaseCollectStamp = async (cardDetails) => {
    // Collect a stamp on a loyalty card and update the user's profile.
    const userProfileRef = doc(firestore, 'profiles', cardDetails.userUID);
    const userProfileDoc = await getDoc(userProfileRef);

    if (!userProfileDoc.exists()) {
        alert(`User profile not found for the scanned card.`);
        return;
    }

    const userProfile = userProfileDoc.data();
    const card = userProfile.loyaltyCards.find(card => card.cardId === cardDetails.cardId);

    if (!card) {
        alert(`Loyalty card not found in user's profile.`);
        return;
    }

    card.progress += 1;

    const loyaltyProgramReference = cardDetails.loyaltyProgram;
    const loyaltyProgramRef = doc(firestore, loyaltyProgramReference);
    const loyaltyProgramDoc = await getDoc(loyaltyProgramRef);
    const loyaltyProgramData = loyaltyProgramDoc.data();

    if (loyaltyProgramData.rewards[card.progress] !== undefined) {
        const qualifiedReward = {
            cardId: card.cardId,
            reward: loyaltyProgramData.rewards[card.progress],
            rewardId: Math.floor(100000000000 + Math.random() * 900000000000),
            loyaltyCard: card.loyaltyCard,
            loyaltyProgram: card.loyaltyProgram,
        };

        userProfile.rewards = [...userProfile.rewards, qualifiedReward];
    }

    await setDoc(userProfileRef, userProfile);
    alert(`You have collected a stamp!`);
};



// Function to collect a reward
const firebaseCollectReward = async (rewardDetails) => {
    // Collect a reward, remove it from the user's profile, and update the profile.
    const userProfileRef = doc(firestore, 'profiles', rewardDetails.userUID);
    const userProfileDoc = await getDoc(userProfileRef);

    if (!userProfileDoc.exists()) {
        alert(`User profile not found for the scanned reward.`);
        return;
    }
    const userProfile = userProfileDoc.data();
    const rewards = userProfile.rewards;
    // Find the index of the reward based on rewardId
    const rewardIndex = rewards.findIndex(
        reward => reward.rewardId === rewardDetails.rewardId
    );
    if (rewardIndex !== -1) {
        // Remove the reward from the array using splice
        rewards.splice(rewardIndex, 1);
        // Update the userProfile with the modified rewards array
        userProfile.rewards = rewards;
        await setDoc(userProfileRef, userProfile);
        alert(`Reward has been redeemed.`);
    }
    else {
        alert(`Error while processing reward QR code.`);
    }
};

export {
    firebaseDeleteCard,
    firebaseFetchUpdatedProgress,
    firebaseFetchLoyaltyProgram,
    firebaseFetchUserProfileReward,
    firebaseFetchProfile,
    firebaseCreateLoyaltyPlan,
    firebaseFetchCardData,
    firebaseRequestAndStorePushToken,
    firebaseFetchLoyaltyPrograms,
    firebaseAddLoyaltyCardToProfile,
    firebaseCollectStamp,
    firebaseCollectReward,
    firebaseFetchLoyaltyProgramsByUser,
    firebaseEditLoyaltyPlan
}