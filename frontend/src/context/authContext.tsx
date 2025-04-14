import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { User, AuthState, ApiResponse } from '../types';


const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null,
};

type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAIL'; payload: string }
  | { type: 'REGISTER_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'REGISTER_FAIL'; payload: string }
  | { type: 'USER_LOADED'; payload: User }
  | { type: 'AUTH_ERROR' }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_USER'; payload: User };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.type === 'AUTH_ERROR' ? 'Authentication error' : action.payload,
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  updateProfile: (userData: Partial<User>, avatar?: File) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (state.token) {
      loadUser();
    } else {
      dispatch({ type: 'AUTH_ERROR' });
    }
  }, []);

  // Set axios auth token
  const setAuthToken = (token: string | null) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Load user
  const loadUser = async (): Promise<void> => {
    try {
      if (state.token) {
        setAuthToken(state.token);
      }

      const response = await axios.get<ApiResponse<User>>(`${API_URL}/users/me`);
      
      if (response.data.success) {
        dispatch({
          type: 'USER_LOADED',
          payload: response.data.data,
        });
      }
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  // Register user
  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      const response = await axios.post<ApiResponse<{ user: User; token: string }>>(`${API_URL}/users/register`, {
        name,
        email,
        password,
      });

      if (response.data.success) {
        dispatch({
          type: 'REGISTER_SUCCESS',
          payload: response.data.data,
        });

        loadUser();
      }
    } catch (error: any) {
      dispatch({
        type: 'REGISTER_FAIL',
        payload: error.response?.data?.message || 'Registration failed',
      });
    }
  };

  // Login user
  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await axios.post<ApiResponse<{ user: User; token: string }>>(`${API_URL}/users/login`, {
        email,
        password,
      });

      if (response.data.success) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: response.data.data,
        });
        setAuthToken(response.data.data.token);
        loadUser();
      }
    } catch (error: any) {
      dispatch({
        type: 'LOGIN_FAIL',
        payload: error.response?.data?.message || 'Login failed',
      });
    }
  };

  // Update profile
  const updateProfile = async (userData: Partial<User>, avatar?: File): Promise<void> => {
    try {
      if (state.token) {
        setAuthToken(state.token);
      }

      const formData = new FormData();
      if (userData.name) formData.append('name', userData.name);
      if (userData.bio) formData.append('bio', userData.bio);
      if (avatar) formData.append('avatar', avatar);

      const response = await axios.put<ApiResponse<User>>(`${API_URL}/users/me`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        dispatch({
          type: 'UPDATE_USER',
          payload: response.data.data,
        });
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
    }
  };

  // Logout
  const logout = (): void => {
    dispatch({ type: 'LOGOUT' });
  };

  // Clear error
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        register,
        login,
        logout,
        loadUser,
        updateProfile,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};