import React from 'react';
import { render, screen } from '@testing-library/react';
import { Hello } from './Hello';

it('renders without crashing', () => {
  const div = document.createElement('div');
  render(<Hello name="test" />, div);
  const divElement = screen.getByText(/hello test/i);
  expect(divElement).toBeInTheDocument();
});
