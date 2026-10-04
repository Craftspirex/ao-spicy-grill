'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, Address } from '@/types';
import { getUser, saveUser, clearUser, isLoggedIn, login, logout, getAddresses, saveAddress, deleteAddress, setDefaultAddress } from '@/utils/user';

interface UserContextType {
  user: UserProfile | null;
  loggedIn: boolean;
  login: (profile: UserProfile) => void;
  logout: () => void;
  updateProfile: (profile: UserProfile) => void;
  addresses: Address[];
  addAddress: (address: Address) => void;
  removeAddress: (id: string) => void;
  makeDefault: (id: string) => void;
  refreshAddresses: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const refreshAddresses = useCallback(() => {
    setAddresses(getAddresses());
  }, []);

  useEffect(() => {
    setUser(getUser());
    setLoggedIn(isLoggedIn());
    refreshAddresses();
  }, [refreshAddresses]);

  const handleLogin = (profile: UserProfile) => {
    login(profile);
    setUser(profile);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setLoggedIn(false);
  };

  const updateProfile = (profile: UserProfile) => {
    saveUser(profile);
    setUser(profile);
  };

  const addAddress = (address: Address) => {
    saveAddress(address);
    refreshAddresses();
  };

  const removeAddress = (id: string) => {
    deleteAddress(id);
    refreshAddresses();
  };

  const makeDefault = (id: string) => {
    setDefaultAddress(id);
    refreshAddresses();
  };

  return (
    <UserContext.Provider
      value={{ user, loggedIn, login: handleLogin, logout: handleLogout, updateProfile, addresses, addAddress, removeAddress, makeDefault, refreshAddresses }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}
