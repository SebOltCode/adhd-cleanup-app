import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import axios from "axios";

export type UserProfile = {
  id: string;
  email: string;
  displayName: string;
  level: number;
  experience: number;
  streak: number;
};

type AuthContextValue = {
  token: string | null;
  user: UserProfile | null;
  apiBaseUrl: string;
  isReady: boolean;
  register: (input: { email: string; password: string; displayName: string; baseUrl?: string }) => Promise<void>;
  login: (input: { email: string; password: string; baseUrl?: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateBaseUrl: (value: string) => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "adhd-cleanup/auth";

const getDefaultBaseUrl = () =>
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ??
  process.env.EXPO_PUBLIC_API_URL ??
  "http://localhost:4000";

type StoredState = {
  token: string | null;
  user: UserProfile | null;
  apiBaseUrl: string;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [apiBaseUrl, setApiBaseUrl] = useState<string>(getDefaultBaseUrl());
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const restore = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as StoredState;
          setToken(parsed.token);
          setUser(parsed.user);
          setApiBaseUrl(parsed.apiBaseUrl ?? getDefaultBaseUrl());
        }
      } catch (error) {
        console.warn("Konnte Auth-Status nicht wiederherstellen", error);
      } finally {
        setIsReady(true);
      }
    };

    void restore();
  }, []);

  const persistState = useCallback(
    async (nextState: StoredState) => {
      setToken(nextState.token);
      setUser(nextState.user);
      setApiBaseUrl(nextState.apiBaseUrl);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    },
    [],
  );

  const getClient = useCallback(
    (overrideBaseUrl?: string) =>
      axios.create({
        baseURL: overrideBaseUrl ?? apiBaseUrl,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        timeout: 10000,
      }),
    [apiBaseUrl, token],
  );

  const register = useCallback(
    async ({ email, password, displayName, baseUrl }: { email: string; password: string; displayName: string; baseUrl?: string }) => {
      try {
        const effectiveBaseUrl = baseUrl ?? apiBaseUrl;
        const client = getClient(effectiveBaseUrl);
        const response = await client.post("/api/auth/register", {
          email: email.trim().toLowerCase(),
          password,
          displayName,
        });

        const nextState: StoredState = {
          token: response.data.token,
          user: response.data.user,
          apiBaseUrl: effectiveBaseUrl,
        };
        await persistState(nextState);
      } catch (error) {
        console.error("Registrierung fehlgeschlagen", error);
        Alert.alert("Registrierung fehlgeschlagen", "Bitte prüfe deine Daten oder probiere eine andere E-Mail-Adresse.");
        throw error;
      }
    },
    [apiBaseUrl, getClient, persistState],
  );

  const login = useCallback(
    async ({ email, password, baseUrl }: { email: string; password: string; baseUrl?: string }) => {
      try {
        const effectiveBaseUrl = baseUrl ?? apiBaseUrl;
        const client = getClient(effectiveBaseUrl);
        const response = await client.post("/api/auth/login", {
          email: email.trim().toLowerCase(),
          password,
        });

        const nextState: StoredState = {
          token: response.data.token,
          user: response.data.user,
          apiBaseUrl: effectiveBaseUrl,
        };
        await persistState(nextState);
      } catch (error) {
        console.error("Login fehlgeschlagen", error);
        Alert.alert("Login fehlgeschlagen", "E-Mail oder Passwort stimmt nicht.");
        throw error;
      }
    },
    [apiBaseUrl, getClient, persistState],
  );

  const logout = useCallback(async () => {
    const nextState: StoredState = {
      token: null,
      user: null,
      apiBaseUrl,
    };
    await persistState(nextState);
  }, [apiBaseUrl, persistState]);

  const updateBaseUrl = useCallback(
    async (value: string) => {
      const normalized = value.endsWith("/") ? value.slice(0, -1) : value;
      setApiBaseUrl(normalized);
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ token, user, apiBaseUrl: normalized } satisfies StoredState),
      );
    },
    [token, user],
  );

  const refreshUser = useCallback(async () => {
    if (!token) {
      return;
    }
    try {
      const client = getClient();
      const response = await client.get("/api/users/me");
      const refreshedUser = response.data.user as UserProfile;
      const nextState: StoredState = {
        token,
        user: refreshedUser,
        apiBaseUrl,
      };
      await persistState(nextState);
    } catch (error) {
      console.error("Profil konnte nicht aktualisiert werden", error);
    }
  }, [apiBaseUrl, getClient, persistState, token]);

  const value = useMemo(
    () => ({ token, user, apiBaseUrl, isReady, register, login, logout, updateBaseUrl, refreshUser }),
    [token, user, apiBaseUrl, isReady, register, login, logout, updateBaseUrl, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth muss innerhalb des AuthProvider verwendet werden");
  }
  return context;
};
