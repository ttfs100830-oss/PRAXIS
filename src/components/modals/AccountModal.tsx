import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  CheckCircle2,
  KeyRound,
  LogOut,
  MailCheck,
  Save,
  UserRound,
} from "lucide-react";
import { Modal } from "../ui/Modal";
import { useAuth } from "../../context/AuthContext";
import { useLearner } from "../../context/LearnerContext";
import { formatDate } from "../../lib/format";

interface AccountModalProps {
  onClose: () => void;
  onToast: (message: string) => void;
}

export function AccountModal({ onClose, onToast }: AccountModalProps) {
  const { user, signOut, resendVerification } = useAuth();
  const { profile, stats, updateProfileSettings } = useLearner();
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [bio, setBio] = useState(profile.bio);
  const [weeklyGoal, setWeeklyGoal] = useState(stats.weeklyGoal || 7);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const { updatePassword } = useAuth();

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      await updateProfileSettings(displayName, bio, weeklyGoal);
      setNotice("Profile settings saved.");
      onToast("Profile settings saved.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save settings.");
    } finally {
      setBusy(false);
    }
  };

  const changePassword = async (event: FormEvent) => {
    event.preventDefault();
    if (passwordBusy) return;
    setError(null);
    setNotice(null);
    if (password.length < 8) {
      setError("Use a password with at least eight characters.");
      return;
    }
    if (password !== confirm) {
      setError("The password confirmation does not match.");
      return;
    }
    setPasswordBusy(true);
    try {
      await updatePassword(password);
      setPassword("");
      setConfirm("");
      setNotice("Password updated.");
      onToast("Password updated.");
    } catch (updateError) {
      setError(
        updateError instanceof Error ? updateError.message : "Could not update the password.",
      );
    } finally {
      setPasswordBusy(false);
    }
  };

  const resend = async () => {
    if (!user?.email) return;
    try {
      const message = await resendVerification(user.email);
      setNotice(message);
    } catch (resendError) {
      setError(resendError instanceof Error ? resendError.message : "Could not resend email.");
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Profile & account"
      eyebrow="Your private PRAXIS account"
      size="lg"
    >
      <div className="flex items-center gap-3 rounded-xl border border-sand/80 bg-cream-100/70 p-3.5">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e1e8d6] text-forest-700">
          <UserRound size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-semibold text-ink">{profile.displayName}</p>
          <p className="truncate text-[11px] text-muted">{user?.email}</p>
        </div>
        <div className="text-right">
          <p className="display-title text-[22px] leading-none text-forest-950">
            {stats.totalXp.toLocaleString()}
          </p>
          <p className="text-[9.5px] uppercase tracking-[0.1em] text-muted">Verified XP</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-[10.5px]">
        <span className="rounded-full bg-cream-200/80 px-2.5 py-1 text-muted">
          Level {stats.level}
        </span>
        <span className="rounded-full bg-cream-200/80 px-2.5 py-1 text-muted">
          {stats.completedLessons} lessons completed
        </span>
        <span className="rounded-full bg-cream-200/80 px-2.5 py-1 text-muted">
          {stats.currentStreak}-day streak
        </span>
        <span className="rounded-full bg-cream-200/80 px-2.5 py-1 text-muted">
          Joined {formatDate(profile.createdAt)}
        </span>
      </div>

      {!user?.email_confirmed_at && (
        <div className="mt-3 rounded-lg border border-[#e6cfae] bg-[#f7ead8] px-3 py-2.5 text-[11px] leading-relaxed text-[#7a623f]">
          <p className="flex items-start gap-2">
            <MailCheck size={14} className="mt-0.5 shrink-0" />
            This email address is not confirmed yet. Some Supabase projects require
            confirmation before sign-in.
          </p>
          <button
            type="button"
            onClick={() => void resend()}
            className="mt-1.5 font-medium underline underline-offset-2"
          >
            Resend verification email
          </button>
        </div>
      )}

      <form onSubmit={saveProfile} className="mt-5">
        <h3 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-forest-800">
          Profile
        </h3>
        <div className="mt-2 grid gap-3 sm:grid-cols-[1fr_130px]">
          <div>
            <label htmlFor="account-name" className="text-[10.5px] font-medium text-forest-800">
              Display name
            </label>
            <input
              id="account-name"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              maxLength={80}
              className="mt-1 h-10 w-full rounded-lg border border-sand bg-cream-50 px-3 text-[12px] text-ink focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-200"
            />
          </div>
          <div>
            <label htmlFor="weekly-goal" className="text-[10.5px] font-medium text-forest-800">
              Weekly goal
            </label>
            <select
              id="weekly-goal"
              value={weeklyGoal}
              onChange={(event) => setWeeklyGoal(Number(event.target.value))}
              className="mt-1 h-10 w-full rounded-lg border border-sand bg-cream-50 px-2.5 text-[12px] text-ink focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-200"
            >
              {[3, 4, 5, 6, 7].map((goal) => (
                <option key={goal} value={goal}>
                  {goal} days
                </option>
              ))}
            </select>
          </div>
        </div>
        <label htmlFor="account-bio" className="mt-3 block text-[10.5px] font-medium text-forest-800">
          Short bio
        </label>
        <textarea
          id="account-bio"
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          rows={2}
          maxLength={500}
          placeholder="What are you learning to build?"
          className="mt-1 w-full resize-none rounded-lg border border-sand bg-cream-50 px-3 py-2 text-[12px] text-ink placeholder:text-muted/70 focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-200"
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="text-[10px] text-muted">{bio.length} / 500 characters</p>
          <button
            type="submit"
            disabled={busy || displayName.trim().length < 1}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-forest-900 px-4 text-[11px] font-medium text-cream-50 hover:bg-forest-800 disabled:opacity-50"
          >
            <Save size={12} />
            {busy ? "Saving…" : "Save profile"}
          </button>
        </div>
      </form>

      <form onSubmit={changePassword} className="mt-5 border-t border-sand/80 pt-4">
        <h3 className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-forest-800">
          <KeyRound size={13} />
          Password
        </h3>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="New password"
            autoComplete="new-password"
            className="h-10 rounded-lg border border-sand bg-cream-50 px-3 text-[12px] text-ink placeholder:text-muted/70 focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-200"
          />
          <input
            type="password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            placeholder="Confirm new password"
            autoComplete="new-password"
            className="h-10 rounded-lg border border-sand bg-cream-50 px-3 text-[12px] text-ink placeholder:text-muted/70 focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-200"
          />
        </div>
        <button
          type="submit"
          disabled={passwordBusy || !password}
          className="mt-2 inline-flex h-8 items-center gap-1.5 rounded-full border border-sand bg-cream-50 px-3.5 text-[10.5px] font-medium text-forest-800 hover:border-forest-300 hover:bg-cream-100 disabled:opacity-50"
        >
          {passwordBusy ? "Updating…" : "Update password"}
          <ArrowRight size={11} />
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-rust-200 bg-rust-50 px-3 py-2 text-[11px] text-rust-700">
          {error}
        </p>
      )}
      {notice && (
        <p className="mt-4 flex items-start gap-2 rounded-lg border border-forest-200 bg-[#eef2e7] px-3 py-2 text-[11px] text-forest-800">
          <CheckCircle2 size={13} className="mt-0.5 shrink-0" />
          {notice}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-sand/80 pt-4">
        <p className="text-[10px] leading-relaxed text-muted">
          Your private rows are scoped to this authenticated account by Row Level
          Security.
        </p>
        <button
          type="button"
          onClick={() => {
            void signOut();
            onClose();
          }}
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-rust-200 bg-rust-50 px-4 text-[11px] font-medium text-rust-700 hover:bg-rust-100"
        >
          <LogOut size={12} />
          Sign out
        </button>
      </div>
    </Modal>
  );
}
