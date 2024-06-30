import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // Add this import
import AppFunctional from './AppFunctional';

test('renders initial state correctly', () => {
  render(<AppFunctional />);
  expect(screen.getByText(/Coordinates/)).toHaveTextContent('Coordinates (2, 2)');
  expect(screen.getByText(/You moved 0 times/)).toBeInTheDocument();
});

test('moves the B correctly', () => {
  render(<AppFunctional />);
  fireEvent.click(screen.getByText('UP'));
  expect(screen.getByText(/Coordinates/)).toHaveTextContent('Coordinates (2, 1)');
  expect(screen.getByText(/You moved 1 time/)).toBeInTheDocument(); // Ensure singular "time"
});

test('input changes correctly', () => {
  render(<AppFunctional />);
  const input = screen.getByPlaceholderText('type email');
  fireEvent.change(input, { target: { value: 'test@example.com' } });
  expect(input.value).toBe('test@example.com');
});

test('submits form and resets email', async () => {
  render(<AppFunctional />);
  fireEvent.change(screen.getByPlaceholderText('type email'), { target: { value: 'test@example.com' } });
  fireEvent.click(screen.getByRole('button', { name: /submit/i })); // Update this line

  await waitFor(() => expect(screen.getByPlaceholderText('type email').value).toBe(''));
});
