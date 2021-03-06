import React, {
  useState,
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import { useHistory } from 'react-router-dom';
import api from '../services/api';
import {
  getWithExpiry,
  setWithExpiry,
} from '../helpers/localStorageWithExpiry';

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
  loading: boolean;
}
interface ProviderProps {
  children: React.ReactNode;
}

const UserContext = createContext<UserContextData>({} as UserContextData);

export const UserProvider: React.FC<ProviderProps> = ({
  children,
}: ProviderProps) => {
  const [isSignedIn, setIsSignedIn] = useState(!!getWithExpiry('user_token'));
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState<UserData>(() => {
    const token = localStorage.getItem('user_token');
    const user = localStorage.getItem('user');
    if (token && user) {
      const { value } = JSON.parse(user);
      return value;
    }

    return {} as UserData;
  });

  const { replace, location } = useHistory();

  const logout = useCallback(async () => {
    setLoading(true);
    const response = await api.get('/logout', { withCredentials: true });
    if (response.status === 200) {
      localStorage.removeItem('user_token');
      localStorage.removeItem('user');
      setIsSignedIn(false);
      replace('/');
    }
    setLoading(false);
  }, [replace]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/user');
      if (response.status === 200) {
        const {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          access_token,
          name,
          imageURL,
          spotifyId,
          premium,
        } = response.data;
        setWithExpiry('user_token', { access_token }, 3600000 * 24 * 14);
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
    } catch (error) {
      setLoading(false);
      // eslint-disable-next-line no-console
      console.error(error);
      return;
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (location.pathname === '/') {
      const query = new URLSearchParams(location.search);
      if (query.get('redirected')) {
        fetchData();
      }
    }
  }, [location, fetchData]);

  return (
    <UserContext.Provider
      value={{ user: data, isSignedIn, logout, fetchData, loading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextData => useContext(UserContext);
