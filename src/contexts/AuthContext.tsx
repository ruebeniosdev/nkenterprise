import { createContext, useContext, useState, ReactNode } from "react";

interface BackendUser {
  user_id: number;
  username: string;
  full_name: string;
  email: string;
  role: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: BackendUser;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("proshop_user");
    if (!stored) return null;
    try {
      return JSON.parse(stored) as User;
    } catch {
      return null;
    }
  });

  const login = async (username: string, password: string): Promise<boolean> => {
    const url = "https://2494ee857a2f.ngrok-free.app/api/auth/login";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || "Login failed");
    }

    const data: LoginResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Login failed");
    }

    // Save token
    localStorage.setItem("authToken", data.token);

    // Map backend user to app User type
    const nextUser: User = {
      id: data.user.user_id.toString(),
      name: data.user.full_name,
      email: data.user.email,
      role: data.user.role,
    };

    setUser(nextUser);
    localStorage.setItem("proshop_user", JSON.stringify(nextUser));

    return true;
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem("proshop_user");
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
