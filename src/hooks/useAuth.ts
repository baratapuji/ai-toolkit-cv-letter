import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useGameStore } from "@/store/useGameStore";

type User = { id: string; email?: string } | null;

export function useAuth() {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const { login, logout, setUser: setStoreUser, loadFromDB } = useGameStore();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userData = session?.user ?? null;
      setUser(userData);
      setLoading(false);
      
      if (userData) {
        login();
        setStoreUser(userData.id);
        await loadFromDB(userData.id);
      }
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const userData = session?.user ?? null;
        setUser(userData);
        
        if (userData) {
          login();
          setStoreUser(userData.id);
          await loadFromDB(userData.id);
        } else {
          logout();
          setStoreUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };
}