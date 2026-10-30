import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, LockKeyhole, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { LogoMark } from "../components/illustrations/Botanical";

export function RecoveryPage() {
  const { updatePassword, finishRecovery, user } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    if (password.length < 8) {
      setError("Use a password with at least eight characters.");
      return;
    }
    if (password !== confirm) {
      setError("The password confirmation does not match.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await updatePassword(password);
      setNotice("Password updated. Opening your learning dashboard…");
      window.setTimeout(() => finishRecovery(), 450);
    } catch (updateError) {
      setError(
        updateError instanceof Error ? updateError.message : "Could not update the password.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-200 px-4 py-8">
      <div className="w-full max-w-[460px]">
        <div className="mb-5 flex items-center justify-center gap-3">
          <LogoMark className="h-12 w-12" />
          <div>
            <p className="text-[19px] font-semibold text-forest-950">Praxis</p>
            <p className="text-[8px] font-medium uppercase tracking-[0.15em] text-forest-700/70">
              Account recovery
            </p>
          </div>
        </div>

        <div className="panel p-6 sm:p-7">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e5eadb] text-forest-700">
            <ShieldCheck size={19} />
          </span>
          <h1 className="display-title mt-3 text-[29px] leading-none text-forest-950">
            Choose a new password
          </h1>
          <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
            {user?.email
              ? `Updating the password for ${user.email}.`
              : "This recovery link must be opened from the email Supabase sent you."}
          </p>

          <form onSubmit={submit} className="mt-5 space-y-3.5">
            <div>
              <label htmlFor="new-password" className="text-[11px] font-medium text-forest-800">
                New password
              </label>
              <div className="mt-1.5 flex h-11 items-center gap-2 rounded-lg border border-sand bg-cream-50 px-3 focus-within:border-forest-400 focus-within:ring-2 focus-within:ring-forest-200">
                <LockKeyhole size={15} className="shrink-0 text-muted" />
                <input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  className="h-full min-w-0 flex-1 bg-transparent text-[12.5px] text-ink placeholder:text-muted/70 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirm-new-password" className="text-[11px] font-medium text-forest-800">
                Confirm new password
              </label>
              <div className="mt-1.5 flex h-11 items-center gap-2 rounded-lg border border-sand bg-cream-50 px-3 focus-within:border-forest-400 focus-within:ring-2 focus-within:ring-forest-200">
                <LockKeyhole size={15} className="shrink-0 text-muted" />
                <input
                  id="confirm-new-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
                  placeholder="Repeat the new password"
                  className="h-full min-w-0 flex-1 bg-transparent text-[12.5px] text-ink placeholder:text-muted/70 focus:outline-none"
                />
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-lg border border-rust-200 bg-rust-50 px-3 py-2 text-[11.5px] leading-relaxed text-rust-700">
                {error}
              </p>
            )}
            {notice && (
              <p className="flex items-start gap-2 rounded-lg border border-forest-200 bg-[#eef2e7] px-3 py-2.5 text-[11.5px] leading-relaxed text-forest-800">
                <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
                {notice}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-forest-900 text-[12.5px] font-medium text-cream-50 transition-colors hover:bg-forest-800 disabled:opacity-55"
            >
              {busy ? "Updating…" : "Update password"}
              {!busy && <ArrowRight size={14} />}
            </button>
          </form>

          <button
            type="button"
            onClick={finishRecovery}
            className="mt-4 text-[11.5px] font-medium text-forest-800 hover:text-forest-950"
          >
            Return to the dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
