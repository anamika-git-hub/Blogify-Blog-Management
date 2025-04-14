export interface User {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Blog {
    _id: string;
    title: string;
    content: string;
    image: string;
    user: User | string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    errors?: any[];
  }