import React from 'react';
import { render } from 'react-native-testing-library';
import { NavigationContainer } from '@react-navigation/native';
import AddCard from '../components/AddCard';


describe('CreateTaskButton', () => {
  it('matches snapshot', () => {
    const { toJSON } = render(
      <NavigationContainer>
        <AddCard />
      </NavigationContainer>
    );

    // Use Jest's expect to match the snapshot
    expect(toJSON()).toMatchSnapshot();
  });
});