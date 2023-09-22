import React from 'react';
import { render } from 'react-native-testing-library';
import ColorSelector from '../components/ColorSelector';

describe('ColorSelector Component', () => {
  it('matches snapshot', () => {
    const mockOnColorChange = jest.fn(); // Mock the onColorChange function
    const { toJSON } = render(<ColorSelector onColorChange={mockOnColorChange} />);

    // Use Jest's expect to match the snapshot
    expect(toJSON()).toMatchSnapshot();
  });
});
