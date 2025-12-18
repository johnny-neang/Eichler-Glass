import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { onAuthChange, verifyAuth } from "@/lib/firebase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyAuth().then((u) => {
      setUser(u);
      setLoading(false);
    });

    const unsubscribe = onAuthChange((u) => {
      setUser(u);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isEmailVerified: user?.emailVerified ?? false,
  };
}
