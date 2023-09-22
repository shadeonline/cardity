import React from 'react';
import { render } from 'react-native-testing-library';
import AdminScreenView from '../screens/AdminScreenView';
import { NavigationContainer } from '@react-navigation/native';


const mockNavigation = {
  setOptions: jest.fn(),
}; 

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

jest.mock('../firebaseFunctions', () => ({
  firebaseFetchProfile: jest.fn(),
  firebaseFetchLoyaltyProgramsByUser: jest.fn(),
}));

describe('AdminScreenView Component', () => {
  it('matches snapshot', () => {
    // Mock data
    const profile = {
      name: 'Admin Name',
    };
    const loyaltyPrograms = [
      {
        loyaltyCard: {
          cardName: 'Loyalty Card 1',
          color: 'blue',
          id: '1',
        },
        description: 'Description 1',
        rewards: {
          1: 'Reward 1',
          2: 'Reward 2',
        },
        storeName: 'Store 1',
        id: 'program1',
        task: 'Task 1',
      },
      // Add more loyalty programs as needed for testing
    ];

    // Render the AdminScreenView component with the mock data
    const { toJSON } = render(
      <NavigationContainer>
        <AdminScreenView
          profile={profile}
          loyaltyPrograms={loyaltyPrograms}
        />
      </NavigationContainer>
    );

    // Use Jest's expect to match the snapshot
    expect(toJSON()).toMatchSnapshot();
  });
});
