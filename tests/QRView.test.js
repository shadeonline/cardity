import React from 'react';
import { render } from 'react-native-testing-library';
import QRView from '../components/QRView';
import QRCode from 'react-native-qrcode-svg';
import { auth } from '../firebase';

jest.mock('react-native-qrcode-svg', () => {
    // Replace 'QRCode' with the name of the component you're mocking
    const MockedQRCode = () => null;
    return MockedQRCode;
  });

  jest.mock('../firebase', () => ({
    auth: {
      currentUser: {
        uid: 'mockedUserId', // Mock the user's UID here
      },
    },
  }));

describe('QRView Component', () => {
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

        // Render the QRView component with the mock data
        const { toJSON } = render(<QRView card={card} />);

        // Use Jest's expect to match the snapshot
        expect(toJSON()).toMatchSnapshot();
    });
});
