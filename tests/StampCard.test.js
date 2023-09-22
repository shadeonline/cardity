import React from 'react';
import { render } from 'react-native-testing-library';
import StampCard from '../components/StampCard';

describe('StampCard Component', () => {
  it('matches snapshot', () => {
    // Mock data
    const maxRewardStamps = 10;
    const progress = 5;
    const rewards = {
      1: true,
      2: true,
      // Add more rewards as needed for testing
    };
    const task = "Complete a task to earn a reward";

    // Render the StampCard component with the mock data
    const { toJSON } = render(
      <StampCard
        maxRewardStamps={maxRewardStamps}
        progress={progress}
        rewards={rewards}
        task={task}
      />
    );

    // Use Jest's expect to match the snapshot
    expect(toJSON()).toMatchSnapshot();
  });
});
