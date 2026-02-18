"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

type Role = "admin" | "user" | null;

type AuthContextType = {
  user: User | null;
  role: Role;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
          // 🔹 Create user doc for first-time signup
          await setDoc(userRef, {
            email: currentUser.email,
            role: "user",
            unlockedSubjects: [],
            createdAt: serverTimestamp(),
          });

          setRole("user");
        } else {
          setRole(snap.data().role || "user");
        }

        setUser(currentUser);
      } else {
        setUser(null);
        setRole(null);
      }

      // ✅ Loading ends ONLY after auth + Firestore settle
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
