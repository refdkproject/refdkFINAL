// LoginPage.test.tsx
import { screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../pages/client/join/LoginPage';
import { expect, describe, it, beforeEach, vi, Mock } from 'vitest';
import '@testing-library/jest-dom';
import { toast } from 'react-toastify';
import { renderWithProviders, resetTestEnv } from './test-utils';
import { authService } from '../services/authService';

// Mock external dependencies
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('../services/authService', () => ({
  authService: {
    login: vi.fn(),
  },
}));

describe('LoginPage Validation', () => {
  beforeEach(() => {
    resetTestEnv();
    renderWithProviders(<LoginPage />);
  });

  it('should show error for invalid email', async () => {
    const emailInput = screen.getByLabelText(/email/i);
    const form = screen.getByRole('button', { name: /sign in/i }).closest('form')!;

    fireEvent.change(emailInput, { target: { value: 'invalid' } });
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please enter a valid email address.');
    });
  });

  it('should handle successful login', async () => {
    const mockResponse = { data: { success: true, data: { id: 1, email: 'test@example.com' } } };
    (authService.login as Mock).mockResolvedValueOnce(mockResponse);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const form = screen.getByRole('button', { name: /sign in/i }).closest('form')!;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'user',
        JSON.stringify(mockResponse.data.data)
      );
      expect(toast.success).toHaveBeenCalledWith('Login successful!', { autoClose: 1500 });
    });
  });

  it('should handle login failure', async () => {
    const mockError = { 
      response: { 
        data: { message: 'Invalid credentials' } 
      } 
    };
    (authService.login as Mock).mockRejectedValueOnce(mockError);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const form = screen.getByRole('button', { name: /sign in/i }).closest('form')!;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
    });
  });
});