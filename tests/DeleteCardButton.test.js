import React from 'react';
import { render } from 'react-native-testing-library'; // Import render from react-native-testing-library
import DeleteCardButton from '../components/DeleteCardButton';
import { NavigationContainer } from '@react-navigation/native';

jest.mock('../firebaseFunctions', () => ({
  firebaseDeleteCard: jest.fn(),
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


describe('DeleteCardButton Component', () => {
  it('matches snapshot', () => {
    const { toJSON } = render(
      <NavigationContainer>
        <DeleteCardButton card={{"cardId": 992847266036, "cardName": "The Ice Cream Card", "color": undefined, "image": "icecreamRestaurant", "loyaltyCard": "loyaltyCards/6xHLagIWsk8Z8Z4ndbO4", "loyaltyProgram": "loyaltyPrograms/kAdCUvzu63ybzK09VXEI", "progress": 5}} />;
      </NavigationContainer>)
    expect(toJSON()).toMatchSnapshot();
  });
});
