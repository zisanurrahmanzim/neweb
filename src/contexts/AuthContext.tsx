import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'agent';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  assignedBanks?: string[];
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Predefined users with email-role mapping
const AUTHORIZED_USERS: Record<string, Omit<User, 'id'>> = {
  'admin@bankrecovery.com': {
    email: 'admin@bankrecovery.com',
    name: 'System Administrator',
    role: 'admin',
    avatar: '/api/placeholder/64/64'
  },
  'manager@bankrecovery.com': {
    email: 'manager@bankrecovery.com',
    name: 'Recovery Manager',
    role: 'admin',
    avatar: '/api/placeholder/64/64'
  },
  'priya.singh@company.com': {
    email: 'priya.singh@company.com',
    name: 'Priya Singh',
    role: 'agent',
    assignedBanks: ['DBBL', 'One Bank'],
    avatar: '/api/placeholder/64/64'
  },
  'raj.kumar@company.com': {
    email: 'raj.kumar@company.com',
    name: 'Raj Kumar',
    role: 'agent',
    assignedBanks: ['One Bank'],
    avatar: '/api/placeholder/64/64'
  },
  'amit.sharma@company.com': {
    email: 'amit.sharma@company.com',
    name: 'Amit Sharma',
    role: 'agent',
    assignedBanks: ['DBBL'],
    avatar: '/api/placeholder/64/64'
  },
  'sneha.patel@company.com': {
    email: 'sneha.patel@company.com',
    name: 'Sneha Patel',
    role: 'agent',
    assignedBanks: ['One Bank'],
    avatar: '/api/placeholder/64/64'
  },
  'ravi.gupta@company.com': {
    email: 'ravi.gupta@company.com',
    name: 'Ravi Gupta',
    role: 'agent',
    assignedBanks: ['DBBL'],
    avatar: '/api/placeholder/64/64'
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored auth on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('bankRecoveryAuth');
    if (storedAuth) {
      try {
        const userData = JSON.parse(storedAuth);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored auth:', error);
        localStorage.removeItem('bankRecoveryAuth');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const normalizedEmail = email.toLowerCase().trim();
    const userData = AUTHORIZED_USERS[normalizedEmail];
    
    if (userData) {
      const userWithId: User = {
        ...userData,
        id: normalizedEmail
      };
      
      setUser(userWithId);
      localStorage.setItem('bankRecoveryAuth', JSON.stringify(userWithId));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bankRecoveryAuth');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper function to check if user has admin access
export function useIsAdmin() {
  const { user } = useAuth();
  return user?.role === 'admin';
}

// Helper function to get user's assigned banks
export function useUserBanks() {
  const { user } = useAuth();
  return user?.assignedBanks || [];
}