import React from 'react';
import { render } from 'react-native-testing-library';
import EditPlanScreenView from '../screens/EditPlanScreenView';
import { NavigationContainer } from '@react-navigation/native';

// Custom mock for useNavigation
const mockNavigation = {
    goBack: jest.fn(),
};

// Mock dependencies
jest.mock('@react-navigation/stack', () => ({
    useFocusEffect: jest.fn(),
    useNavigation: () => mockNavigation, // Use the custom mock here
}));

jest.mock('../firebase', () => ({
    auth: {
        currentUser: {
            email: 'admin@example.com', // Mock the user's email here
        },
    },
}));

jest.mock('firebase/auth', () => ({
    signOut: jest.fn(), // Mock the signOut function here
}));

// Mock firebaseFunctions
jest.mock('../firebaseFunctions', () => ({
    firebaseEditLoyaltyPlan: jest.fn(),
}));

describe('EditPlanScreenView Component', () => {
    it('matches snapshot', async () => {
        // Mock data
        const programData = { "description": "Earn free drinks at Stag Bar now!", "id": "n2KSNnpuLIciipIegOzl", "loyaltyCard": { "cardName": "Stag Card", "color": "#792cff", "id": "kyK8L7oqA5SsEHSiZqRH" }, "rewards": { "10": "Free IPA", "5": "Free stout beer" }, "storeName": "Stag bar", "task": "Purchase $10 worth of product at store" }

        // Render the EditPlanScreenView component with the mock data
        const { toJSON } = render(
            <NavigationContainer>
                <EditPlanScreenView route={{ params: { programData } }} />
            </NavigationContainer>
        );

        // Use Jest's expect to match the snapshot
        expect(toJSON()).toMatchSnapshot();
    });
});
