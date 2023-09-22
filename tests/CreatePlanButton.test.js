import React from 'react';
import { render } from 'react-native-testing-library';
import CreatePlanButton from '../components/CreatePlanButton';

describe('CreatePlanButton Component', () => {
  it('matches snapshot', () => {
    const { toJSON } = render(<CreatePlanButton text="Create New Plan" onPress={() => {}} />);
    // Use Jest's expect to match the snapshot
    expect(toJSON()).toMatchSnapshot();
  });
});
