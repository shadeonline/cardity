
import React from 'react';
import { render } from 'react-native-testing-library';
import ProgressView from '../components/ProgressView';
import { NavigationContainer } from '@react-navigation/native';

// Mock the Firebase functions used in ProgressView
jest.mock('../firebaseFunctions', () => ({
  firebaseFetchUpdatedProgress: jest.fn(),
  firebaseFetchLoyaltyProgram: jest.fn(),
}));

jest.mock('@react-navigation/stack', () => {
  const actualStack = jest.requireActual('@react-navigation/stack');
  return {
    ...actualStack,
    createStackNavigator: () => ({
      Navigator: ({ children }) => <>{children}</>,
      Screen: ({ children }) => <>{children}</>,
    }),
  };
});

describe('ProgressView Component', () => {
  it('matches snapshot', async () => {
    // Mock data to pass as props to ProgressView
    const card = {
      "cardId": 992847266036,
      "cardName": "The Ice Cream Card",
      "color": undefined,
      "image": "icecreamRestaurant",
      "loyaltyCard": "loyaltyCards/6xHLagIWsk8Z8Z4ndbO4",
      "loyaltyProgram": "loyaltyPrograms/kAdCUvzu63ybzK09VXEI",
      "progress": 5
    };

    // Use waitFor to wait for an asynchronous operation
    const { toJSON } = render(
      <NavigationContainer>
        <ProgressView card={card} />
      </NavigationContainer>
    );


    // Use Jest's expect to match the snapshot after the asynchronous operation
    expect(toJSON()).toMatchSnapshot();
  });
});
