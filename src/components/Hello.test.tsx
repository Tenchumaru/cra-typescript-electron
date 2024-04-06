import { render, screen } from '@testing-library/react';
import { Hello } from './Hello';

it('renders with "hello test" element', () => {
  render(<Hello name="test" />);
  const divElement = screen.getByText(/hello test/i);
  expect(divElement).toBeInTheDocument();
});
