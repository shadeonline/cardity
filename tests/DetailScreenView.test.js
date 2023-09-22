import React from 'react';
import { render } from 'react-native-testing-library';
import DetailScreenView from '../screens/DetailScreenView';
import { NavigationContainer } from '@react-navigation/native';

// Create a mock function for navigation.setOptions
const mockSetOptions = jest.fn();

// Mock components
jest.mock('../components/DeleteCardButton.js', () => ({
  __esModule: true,
  default: jest.fn(), // Mock the DeleteCardButton component
}));

jest.mock('../components/ProgressView.js', () => ({
  __esModule: true,
  default: jest.fn(), // Mock the ProgressView component
}));

jest.mock('../components/RewardView.js', () => ({
  __esModule: true,
  default: jest.fn(), // Mock the RewardView component
}));

jest.mock('../components/QRView.js', () => ({
  __esModule: true,
  default: jest.fn(), // Mock the QRView component
}));

// Mock dependencies
jest.mock('@react-navigation/stack', () => ({
  useFocusEffect: jest.fn(),
  useNavigation: () => ({
    setOptions: mockSetOptions, // Use the mock function here
  }),
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

describe('DetailScreenView Component', () => {
  it('matches snapshot', async () => {
    // Mock data
    const card = {
      // Mock card data here
    };

    // Render the DetailScreenView component with the mock data
    const { toJSON } = render(
      <NavigationContainer>
        <DetailScreenView route={{ params: { card } }} />
      </NavigationContainer>
    );

    // Use Jest's expect to match the snapshot
    expect(toJSON()).toMatchSnapshot();
  });
});
