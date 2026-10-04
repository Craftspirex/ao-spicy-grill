import { Address, UserProfile } from '@/types';

const USER_KEY = 'ao_user_profile';
const ADDR_KEY = 'ao_addresses';
const SESSION_KEY = 'ao_user_session';

export function getUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveUser(profile: UserProfile): void {
  localStorage.setItem(USER_KEY, JSON.stringify(profile));
}

export function clearUser(): void {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(SESSION_KEY);
}

export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(SESSION_KEY);
}

export function login(profile: UserProfile): void {
  saveUser(profile);
  localStorage.setItem(SESSION_KEY, 'true');
}

export function logout(): void {
  clearUser();
}

export function getAddresses(): Address[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ADDR_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAddress(address: Address): void {
  const addresses = getAddresses();
  const existing = addresses.findIndex(a => a.id === address.id);
  if (existing >= 0) {
    addresses[existing] = address;
  } else {
    if (address.isDefault) {
      addresses.forEach(a => (a.isDefault = false));
    }
    addresses.push(address);
  }
  localStorage.setItem(ADDR_KEY, JSON.stringify(addresses));
}

export function deleteAddress(id: string): void {
  const addresses = getAddresses().filter(a => a.id !== id);
  localStorage.setItem(ADDR_KEY, JSON.stringify(addresses));
}

export function setDefaultAddress(id: string): void {
  const addresses = getAddresses().map(a => ({ ...a, isDefault: a.id === id }));
  localStorage.setItem(ADDR_KEY, JSON.stringify(addresses));
}
