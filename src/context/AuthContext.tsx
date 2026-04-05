import React, { createContext, useContext, useState } from 'react';
import { MOCK_CUSTOMER, MOCK_VENDOR_USER } from '../mock/data';
import { UserDocument } from '../types/user.types';

// Toggle this to preview the vendor experience vs customer experience
const MOCK_ROLE: 'customer' | 'vendor' = 'customer';

interface AuthContextValue {
  user: { uid: string } | null;
  userDoc: UserDocument | null;
  role: 'customer' | 'vendor' | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  userDoc: null,
  role: null,
  loading: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const mockUser = MOCK_ROLE === 'vendor' ? MOCK_VENDOR_USER : MOCK_CUSTOMER;

  return (
    <AuthContext.Provider
      value={{
        user: { uid: mockUser.uid },
        userDoc: mockUser,
        role: MOCK_ROLE,
        loading: false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
