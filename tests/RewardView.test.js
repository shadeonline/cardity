import React from 'react';
import { render } from 'react-native-testing-library';
import RewardView from '../components/RewardView';
import { auth } from '../firebase';
import { NavigationContainer } from '@react-navigation/native';

jest.mock('../firebaseFunctions', () => ({
  firebaseFetchUserProfileReward: jest.fn(),
}));

jest.mock('../firebase', () => ({
  auth: {
    currentUser: {
      uid: 'mockedUserId',
    },
  },
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

describe('RewardView Component', () => {
  it('matches snapshot', () => {
    // Mock card data
    const card = {
      "cardId": 992847266036,
      "cardName": "The Ice Cream Card",
      "color": undefined,
      "image": "icecreamRestaurant",
      "loyaltyCard": "loyaltyCards/6xHLagIWsk8Z8Z4ndbO4",
      "loyaltyProgram": "loyaltyPrograms/kAdCUvzu63ybzK09VXEI",
      "progress": 5
    };

    // Render the RewardView component with the mock data
    const { toJSON } = render(
      <NavigationContainer>
        <RewardView card={card} />
      </NavigationContainer>);

    // Use Jest's expect to match the snapshot
    expect(toJSON()).toMatchSnapshot();
  });
});
