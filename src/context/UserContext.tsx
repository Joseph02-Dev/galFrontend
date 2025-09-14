import { useState, useEffect, type ReactNode } from "react";
import type { User } from "../types/User";
import { UserContext } from "./context";

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? (JSON.parse(stored) as User) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
    console.debug("UserContext user changed:", user);
  }, [user]);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

// Le hook `useUser` est maintenant placé dans `src/context/useUser.ts` pour
// éviter les problèmes de Fast Refresh quand un fichier exporte des fonctions
// non-composants en plus du composant provider.
