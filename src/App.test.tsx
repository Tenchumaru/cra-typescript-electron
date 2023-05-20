import { render, screen } from '@testing-library/react';
import './main.mock';
import { App } from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
