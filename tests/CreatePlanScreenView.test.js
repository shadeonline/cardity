import React from 'react';
import { render } from 'react-native-testing-library';
import CreatePlanScreenView from '../screens/CreatePlanScreenView';
import { NavigationContainer } from '@react-navigation/native';

// Custom mock for useNavigation
const mockNavigation = {
  navigate: jest.fn(),
};

jest.mock('../firebaseFunctions', () => ({
    firebaseFetchProfile: jest.fn(),
    firebaseFetchLoyaltyProgramsByUser: jest.fn(),
  }));

// Mock dependencies
jest.mock('@react-navigation/stack', () => ({
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
  firebaseCreateLoyaltyPlan: jest.fn(), // Mock the function you are testing
}));

describe('CreatePlanScreenView Component', () => {
  it('matches snapshot', () => {
    // Mock data
    const profile = {
      name: 'Admin Name',
    };

    // Render the CreatePlanScreenView component with the mock data
    const { toJSON } = render(
      <NavigationContainer>
        <CreatePlanScreenView profile={profile} />
      </NavigationContainer>
    );

    // Use Jest's expect to match the snapshot
    expect(toJSON()).toMatchSnapshot();
  });
});
