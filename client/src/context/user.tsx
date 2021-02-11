import React, { useState, createContext, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../services/api';

interface UserData {
  spotifyId: string;
  name: string;
  premium: boolean;
  imageURL: string;
}

interface UserContextData {
  logout(): Promise<void>;
  fetchData(): Promise<void>;
  isSignedIn: boolean;
  user: UserData;
}

interface ProviderProps {
  children: React.ReactNode;
}

export const UserContext = createContext<UserContextData>(
  {} as UserContextData,
);

export const UserProvider: React.FC<ProviderProps> = ({
  children,
}: ProviderProps) => {
  const [isSignedIn, setIsSignedIn] = useState(
    !!localStorage.getItem('user_token'),
  );

  const [data, setData] = useState<UserData>(() => {
    const token = localStorage.getItem('user_token');
    const user = localStorage.getItem('user');
    if (token && user) {
      return JSON.parse(user);
    }

    return {} as UserData;
  });

  const { replace } = useHistory();

  const logout = useCallback(async () => {
    const response = await api.get('/logout');
    if (response.status === 200) {
      localStorage.removeItem('user_token');
      localStorage.removeItem('user');
      setIsSignedIn(false);
      replace('/');
    }
  }, [replace]);

  const fetchData = useCallback(async () => {
    const response = await api.get('/user');
    if (response.status === 200) {
      const {
        access_token,
        name,
        imageURL,
        spotifyId,
        premium,
      } = response.data;
      localStorage.setItem('user_token', access_token);
      localStorage.setItem(
        'user',
        JSON.stringify({ name, imageURL, spotifyId, premium }),
      );
      setData({
        name,
        imageURL,
        spotifyId,
        premium,
      });
      setIsSignedIn(true);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user: data, isSignedIn, logout, fetchData }}>
      {children}
    </UserContext.Provider>
  );
};
