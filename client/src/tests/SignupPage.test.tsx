// SignupPage.test.tsx
import { screen, fireEvent, waitFor } from '@testing-library/react';
import SignupPage from '../pages/client/join/SignupPage';
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
    register: vi.fn(),
  },
}));

describe('SignupPage Validation', () => {
  beforeEach(() => {
    resetTestEnv();
    renderWithProviders(<SignupPage role="volunteer" />);
  });

  it('should show error for invalid email', async () => {
    const emailInput = screen.getByLabelText(/email/i);
    const form = screen.getByRole('button', { name: /sign up/i }).closest('form')!;

    fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Please enter a valid email address (e.g., abc@gmail.com).'
      );
    });
  });

  it('should show error for short password', async () => {
    const passwordInput = screen.getByLabelText(/password/i);
    const form = screen.getByRole('button', { name: /sign up/i }).closest('form')!;

    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Password must be at least 6 characters long.'
      );
    });
  });

  it('should show error for invalid phone number', async () => {
    const phoneInput = screen.getByLabelText(/contact number/i);
    const form = screen.getByRole('button', { name: /sign up/i }).closest('form')!;

    fireEvent.change(phoneInput, { target: { value: '+96612345' } });
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Phone number must start with +966 and contain 9 to 12 digits.'
      );
    });
  });

  it('should show error for invalid name format', async () => {
    const nameInput = screen.getByLabelText(/name/i);
    const form = screen.getByRole('button', { name: /sign up/i }).closest('form')!;

    fireEvent.change(nameInput, { target: { value: 'John123' } });
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Name is required and should contain only letters and spaces.'
      );
    });
  });

  it('should handle successful registration', async () => {
    const mockResponse = { 
      data: { 
        success: true, 
        message: 'Registration successful!' 
      } 
    };
    (authService.register as Mock).mockResolvedValueOnce(mockResponse);

    // Fill in all required fields
    fireEvent.change(screen.getByLabelText(/name/i), { 
      target: { value: 'John Doe' } 
    });
    fireEvent.change(screen.getByLabelText(/email/i), { 
      target: { value: 'john@gmail.com' } 
    });
    fireEvent.change(screen.getByLabelText(/password/i), { 
      target: { value: 'password123' } 
    });
    fireEvent.change(screen.getByLabelText(/contact number/i), { 
      target: { value: '+966123456789' } 
    });
    fireEvent.change(screen.getByLabelText(/birth date/i), { 
      target: { value: '1990-01-01' } 
    });

    const form = screen.getByRole('button', { name: /sign up/i }).closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Registration successful! Redirecting to login...');
    });
  });

  it('should handle registration failure', async () => {
    const mockError = { 
      response: { 
        data: { message: 'Email already exists' } 
      } 
    };
    (authService.register as Mock).mockRejectedValueOnce(mockError);

    // Fill in all required fields
    fireEvent.change(screen.getByLabelText(/name/i), { 
      target: { value: 'John Doe' } 
    });
    fireEvent.change(screen.getByLabelText(/email/i), { 
      target: { value: 'existing@gmail.com' } 
    });
    fireEvent.change(screen.getByLabelText(/password/i), { 
      target: { value: 'password123' } 
    });
    fireEvent.change(screen.getByLabelText(/contact number/i), { 
      target: { value: '+966123456789' } 
    });
    fireEvent.change(screen.getByLabelText(/birth date/i), { 
      target: { value: '1990-01-01' } 
    });

    const form = screen.getByRole('button', { name: /sign up/i }).closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Email already exists');
    });
  });

  // Test specifically for charity admin role
  it('should validate institution name for charity admin', () => {
    // Re-render with charity_admin role
    renderWithProviders(<SignupPage role="charity_admin" />);
    
    const form = screen.getByRole('button', { name: /sign up/i }).closest('form')!;
    fireEvent.submit(form);
    
    expect(toast.error).toHaveBeenCalledWith('Institution name is required.');
  });
});