// test-utils.tsx
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { vi } from 'vitest';

// Match the type from your AuthContext
type AuthContextType = {
  user: any | null
  login: (userData: any) => void
  logout: () => void
}

// Create mock context that matches your implementation
const mockAuthContext: AuthContextType = {
  user: null,
  login: vi.fn((userData: any) => {
    localStorage.setItem("user", JSON.stringify(userData));
  }),
  logout: vi.fn(() => {
    localStorage.removeItem("user");
  }),
};

// Mock localStorage for tests
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

export const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <AuthContext.Provider value={mockAuthContext}>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

// Helper to reset all mocks between tests
export const resetTestEnv = () => {
  vi.clearAllMocks();
  mockLocalStorage.getItem.mockReset();
  mockLocalStorage.setItem.mockReset();
  mockLocalStorage.removeItem.mockReset();
};

// Example usage of providers with custom initial state
export const renderWithCustomAuth = (
  ui: React.ReactElement,
  { user = null }: { user?: any }
) => {
  const customAuthContext = {
    ...mockAuthContext,
    user,
  };

  return render(
    <AuthContext.Provider value={customAuthContext}>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </AuthContext.Provider>
  );
};