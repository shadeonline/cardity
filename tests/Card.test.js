import React from 'react';
import { render } from 'react-native-testing-library';
import Card from '../components/Card'; // Import your Card component

// Mock the useNavigation hook
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

describe('Card Component', () => {
  it('matches snapshot', () => {
    const props = {
      cardName: 'The Ice Cream Card',
      cardId: '992847266036',
      redirect: undefined,
      card: {
        "cardId": 992847266036,
        "cardName": "The Ice Cream Card",
        "color": undefined,
        "image": "icecreamRestaurant",
        "loyaltyCard": "loyaltyCards/6xHLagIWsk8Z8Z4ndbO4",
        "loyaltyProgram": "loyaltyPrograms/kAdCUvzu63ybzK09VXEI",
        "progress": 5
      }, // Provide relevant card data here
      image: 'icecreamRestaurant',
      color: undefined,
    };

    const { toJSON } = render(<Card {...props} />);

    // Use Jest's expect to match the snapshot
    expect(toJSON()).toMatchSnapshot();
  });
});
