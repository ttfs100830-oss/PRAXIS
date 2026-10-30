import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, supabaseConfigured } from "../lib/supabase";

type SignUpResult = {
  needsEmailConfirmation: boolean;
  message: string;
};

interface AuthContextValue {
  configured: boolean;
  loading: boolean;
  session: Session | null;
  user: User | null;
  recoveryMode: boolean;
  error: string | null;
  clearError: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<SignUpResult>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<string>;
  resendVerification: (email: string) => Promise<string>;
  updatePassword: (password: string) => Promise<void>;
  finishRecovery: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function authErrorMessage(error: unknown): string {
  if (!error) return "Authentication failed.";
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = String((error as { message: unknown }).message);
    if (/invalid login credentials/i.test(message)) {
      return "That email and password combination was not accepted.";
    }
    if (/email not confirmed/i.test(message)) {
      return "Check your inbox and confirm your email before signing in.";
    }
    if (/user already registered/i.test(message)) {
      return "An account with that email already exists. Sign in or reset your password.";
    }
    if (/rate limit|too many/i.test(message)) {
      return "Too many attempts. Wait a moment and try again.";
    }
    return message;
  }
  return String(error);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recoveryMode, setRecoveryMode] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;
    const recoveryInUrl = window.location.hash.includes("type=recovery");

    supabase.auth
      .getSession()
      .then(({ data, error: sessionError }) => {
        if (!mounted) return;
        if (sessionError) setError(authErrorMessage(sessionError));
        setSession(data.session);
        if (recoveryInUrl) setRecoveryMode(true);
      })
      .catch((sessionError: unknown) => {
        if (!mounted) return;
        setError(authErrorMessage(sessionError));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    const { data } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (event === "PASSWORD_RECOVERY") {
        setRecoveryMode(true);
      }
      if (event === "SIGNED_OUT") {
        setRecoveryMode(false);
      }
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) throw new Error("Supabase is not configured.");
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (signInError) {
      const message = authErrorMessage(signInError);
      setError(message);
      throw new Error(message);
    }
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, displayName: string): Promise<SignUpResult> => {
      if (!supabase) throw new Error("Supabase is not configured.");
      setError(null);
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { display_name: displayName.trim() },
          emailRedirectTo: `${window.location.origin}`,
        },
      });
      if (signUpError) {
        const message = authErrorMessage(signUpError);
        setError(message);
        throw new Error(message);
      }
      if (data.session) {
        return {
          needsEmailConfirmation: false,
          message: "Account created. Your learning dashboard is ready.",
        };
      }
      return {
        needsEmailConfirmation: true,
        message:
          "Account created. Check your email and confirm your address before signing in.",
      };
    },
    [],
  );

  const signOut = useCallback(async () => {
    if (!supabase) return;
    setError(null);
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      setError(authErrorMessage(signOutError));
      throw signOutError;
    }
    setRecoveryMode(false);
  }, []);

  const resetPassword = useCallback(async (email: string): Promise<string> => {
    if (!supabase) throw new Error("Supabase is not configured.");
    setError(null);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo: `${window.location.origin}` },
    );
    if (resetError) {
      const message = authErrorMessage(resetError);
      setError(message);
      throw new Error(message);
    }
    return "If that address belongs to an account, a password reset link is on its way.";
  }, []);

  const resendVerification = useCallback(async (email: string): Promise<string> => {
    if (!supabase) throw new Error("Supabase is not configured.");
    setError(null);
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}` },
    });
    if (resendError) {
      const message = authErrorMessage(resendError);
      setError(message);
      throw new Error(message);
    }
    return "Verification email sent again. Check your inbox.";
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    if (!supabase) throw new Error("Supabase is not configured.");
    setError(null);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      const message = authErrorMessage(updateError);
      setError(message);
      throw new Error(message);
    }
    setRecoveryMode(false);
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  const finishRecovery = useCallback(() => {
    setRecoveryMode(false);
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      configured: supabaseConfigured,
      loading,
      session,
      user: session?.user ?? null,
      recoveryMode,
      error,
      clearError: () => setError(null),
      signIn,
      signUp,
      signOut,
      resetPassword,
      resendVerification,
      updatePassword,
      finishRecovery,
    }),
    [
      loading,
      session,
      recoveryMode,
      error,
      signIn,
      signUp,
      signOut,
      resetPassword,
      resendVerification,
      updatePassword,
      finishRecovery,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider.");
  return value;
}
