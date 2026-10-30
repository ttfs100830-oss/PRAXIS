import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  AtSign,
  CheckCircle2,
  Eye,
  EyeOff,
  Leaf,
  LockKeyhole,
  MailCheck,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { curriculumStats } from "../lib/curriculum";
import { LeafSprig, LogoMark } from "../components/illustrations/Botanical";

type Mode = "signin" | "signup" | "reset";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthPage() {
  const { configured, signIn, signUp, resetPassword, resendVerification } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setNotice(null);
    setNeedsConfirmation(false);
    setPassword("");
    setConfirm("");
  };

  const validate = (): string | null => {
    if (mode === "signup" && displayName.trim().length < 2) {
      return "Enter a display name with at least two characters.";
    }
    if (!emailPattern.test(email.trim())) {
      return "Enter a valid email address.";
    }
    if (mode !== "reset" && password.length < 8) {
      return "Use a password with at least eight characters.";
    }
    if (mode === "signup" && password !== confirm) {
      return "The password confirmation does not match.";
    }
    return null;
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    const validation = validate();
    if (validation) {
      setError(validation);
      return;
    }
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      if (mode === "signin") {
        await signIn(email, password);
      } else if (mode === "signup") {
        const result = await signUp(email, password, displayName);
        setNeedsConfirmation(result.needsEmailConfirmation);
        setNotice(result.message);
      } else {
        setNotice(await resetPassword(email));
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Something went wrong.",
      );
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    if (!emailPattern.test(email.trim())) {
      setError("Enter the email address you registered with.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      setNotice(await resendVerification(email));
    } catch (resendError) {
      setError(
        resendError instanceof Error ? resendError.message : "Could not resend the email.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-cream-200">
      <div className="pointer-events-none absolute inset-0 paper-texture opacity-70" />
      <div className="relative mx-auto grid min-h-screen w-full max-w-[1240px] items-stretch gap-8 px-4 py-6 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12 lg:py-10">
        <section className="relative hidden overflow-hidden rounded-[28px] bg-forest-900 p-9 text-cream-100 shadow-lift lg:flex lg:flex-col">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 80% at 0% 0%, rgba(84,122,98,0.35) 0%, transparent 46%), radial-gradient(100% 60% at 100% 100%, rgba(11,28,20,0.55) 0%, transparent 60%)",
            }}
          />
          <LeafSprig className="pointer-events-none absolute -right-6 bottom-16 h-[430px] w-[310px] opacity-20" />
          <div className="relative flex items-center gap-3">
            <LogoMark className="h-12 w-12" />
            <div>
              <p className="text-[21px] font-semibold leading-tight text-cream-50">Praxis</p>
              <p className="mt-1 text-[8.5px] font-medium uppercase tracking-[0.16em] text-forest-200/80">
                Understand · Explore · Build
              </p>
            </div>
          </div>

          <div className="relative mt-auto max-w-[460px] pb-4">
            <p className="text-[10.5px] font-medium uppercase tracking-[0.2em] text-[#d8a27f]">
              A learning platform for builders
            </p>
            <h1 className="display-title mt-3 text-[44px] leading-[1.02] text-cream-50">
              Learn the structure behind technology.
            </h1>
            <p className="mt-4 max-w-[390px] text-[13.5px] leading-relaxed text-cream-200/80">
              Read the actual curriculum, test your understanding, and keep a
              private record of what you have learned. Your account starts clean.
            </p>

            <dl className="mt-7 grid grid-cols-3 gap-3">
              {[
                ["Paths", curriculumStats.paths],
                ["Modules", curriculumStats.modules],
                ["Lessons", curriculumStats.lessons],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-3"
                >
                  <dt className="text-[9.5px] uppercase tracking-[0.13em] text-forest-200/70">
                    {label}
                  </dt>
                  <dd className="display-title mt-1 text-[25px] leading-none text-cream-50">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <p className="relative mt-8 flex items-center gap-2 text-[10.5px] text-forest-200/55">
            <ShieldCheck size={13} />
            Private progress protected by authenticated database policies
          </p>
        </section>

        <section className="flex items-center justify-center">
          <div className="w-full max-w-[470px]">
            <div className="mb-6 flex items-center gap-3 lg:hidden">
              <LogoMark className="h-11 w-11" />
              <div>
                <p className="text-[18px] font-semibold text-forest-950">Praxis</p>
                <p className="text-[8px] font-medium uppercase tracking-[0.15em] text-forest-700/70">
                  Understand · Explore · Build
                </p>
              </div>
            </div>

            <div className="panel p-6 sm:p-7">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e5eadb] text-forest-700">
                  {mode === "reset" ? (
                    <MailCheck size={18} />
                  ) : mode === "signup" ? (
                    <Leaf size={18} />
                  ) : (
                    <LockKeyhole size={18} />
                  )}
                </span>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-rust-500">
                    {mode === "signin"
                      ? "Welcome back"
                      : mode === "signup"
                        ? "Create your account"
                        : "Account recovery"}
                  </p>
                  <h2 className="display-title mt-1 text-[28px] leading-none text-forest-950">
                    {mode === "signin"
                      ? "Continue learning"
                      : mode === "signup"
                        ? "Start with a clean slate"
                        : "Reset your password"}
                  </h2>
                </div>
              </div>

              <p className="mt-3 text-[12.5px] leading-relaxed text-muted">
                {mode === "signin"
                  ? "Sign in to see your own lessons, XP, streaks and assessment history."
                  : mode === "signup"
                    ? "New accounts begin at 0 XP with no lessons, streak or achievements."
                    : "We will email a secure link. Open it on this device to choose a new password."}
              </p>

              {!configured && (
                <div className="mt-4 rounded-xl border border-rust-200 bg-rust-50 px-3.5 py-3 text-[11.5px] leading-relaxed text-rust-700">
                  Supabase is not configured. Copy <code>.env.example</code> to{" "}
                  <code>.env.local</code>, add the project URL and publishable key,
                  then restart the dev server.
                </div>
              )}

              <form onSubmit={submit} className="mt-5 space-y-3.5" noValidate>
                {mode === "signup" && (
                  <Field
                    id="display-name"
                    label="Display name"
                    icon={UserRound}
                    value={displayName}
                    onChange={setDisplayName}
                    placeholder="How should PRAXIS address you?"
                    autoComplete="name"
                  />
                )}

                <Field
                  id="email"
                  label="Email"
                  icon={AtSign}
                  value={email}
                  onChange={setEmail}
                  placeholder="you@example.com"
                  autoComplete="email"
                  type="email"
                />

                {mode !== "reset" && (
                  <div>
                    <label
                      htmlFor="password"
                      className="text-[11px] font-medium text-forest-800"
                    >
                      Password
                    </label>
                    <div className="mt-1.5 flex h-11 items-center gap-2 rounded-lg border border-sand bg-cream-50 px-3 focus-within:border-forest-400 focus-within:ring-2 focus-within:ring-forest-200">
                      <LockKeyhole size={15} className="shrink-0 text-muted" />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete={
                          mode === "signup" ? "new-password" : "current-password"
                        }
                        placeholder="At least 8 characters"
                        className="h-full min-w-0 flex-1 bg-transparent text-[12.5px] text-ink placeholder:text-muted/70 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((visible) => !visible)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="rounded p-1 text-muted hover:text-forest-800"
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                )}

                {mode === "signup" && (
                  <Field
                    id="confirm-password"
                    label="Confirm password"
                    icon={LockKeyhole}
                    value={confirm}
                    onChange={setConfirm}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    type="password"
                  />
                )}

                {error && (
                  <p
                    role="alert"
                    className="rounded-lg border border-rust-200 bg-rust-50 px-3 py-2 text-[11.5px] leading-relaxed text-rust-700"
                  >
                    {error}
                  </p>
                )}
                {notice && (
                  <div className="rounded-lg border border-forest-200 bg-[#eef2e7] px-3 py-2.5 text-[11.5px] leading-relaxed text-forest-800">
                    <p className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
                      {notice}
                    </p>
                    {needsConfirmation && (
                      <button
                        type="button"
                        onClick={() => void resend()}
                        disabled={busy}
                        className="mt-2 font-medium underline decoration-forest-300 underline-offset-2 hover:text-forest-950 disabled:opacity-50"
                      >
                        Resend verification email
                      </button>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={busy || !configured}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-forest-900 text-[12.5px] font-medium text-cream-50 transition-colors hover:bg-forest-800 disabled:cursor-not-allowed disabled:opacity-55"
                >
                  {busy
                    ? "Please wait…"
                    : mode === "signin"
                      ? "Sign in"
                      : mode === "signup"
                        ? "Create account"
                        : "Send reset link"}
                  {!busy && <ArrowRight size={14} />}
                </button>
              </form>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-sand/80 pt-3.5 text-[11.5px]">
                {mode === "signin" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => switchMode("signup")}
                      className="font-medium text-forest-800 hover:text-forest-950"
                    >
                      Create an account
                    </button>
                    <button
                      type="button"
                      onClick={() => switchMode("reset")}
                      className="text-muted hover:text-forest-800"
                    >
                      Forgot password?
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => switchMode("signin")}
                    className="font-medium text-forest-800 hover:text-forest-950"
                  >
                    Back to sign in
                  </button>
                )}
              </div>
            </div>

            <p className="mt-4 text-center text-[10px] leading-relaxed text-muted/80">
              Sessions are stored by Supabase Auth. The publishable key in this
              frontend cannot administer the database.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  autoComplete,
  type = "text",
}: {
  id: string;
  label: string;
  icon: typeof AtSign;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoComplete: string;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-[11px] font-medium text-forest-800">
        {label}
      </label>
      <div className="mt-1.5 flex h-11 items-center gap-2 rounded-lg border border-sand bg-cream-50 px-3 focus-within:border-forest-400 focus-within:ring-2 focus-within:ring-forest-200">
        <Icon size={15} className="shrink-0 text-muted" />
        <input
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="h-full min-w-0 flex-1 bg-transparent text-[12.5px] text-ink placeholder:text-muted/70 focus:outline-none"
        />
      </div>
    </div>
  );
}
