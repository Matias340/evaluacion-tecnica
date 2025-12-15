import { createContext, useContext, useEffect, useState } from "react";

type Role = "TALLER" | "CLIENTE";

interface AuthContextType {
  isAuthenticated: boolean;
  role: Role | null;
  login: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role") as Role | null;
    if (storedRole) setRole(storedRole);
  }, []);

  const login = (selectedRole: Role) => {
    localStorage.setItem("role", selectedRole);
    setRole(selectedRole);
  };

  const logout = () => {
    localStorage.removeItem("role");
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!role,
        role,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return ctx;
};
