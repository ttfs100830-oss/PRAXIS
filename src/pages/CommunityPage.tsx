import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Loader2,
  MessageCircle,
  Plus,
  RefreshCw,
  Users,
} from "lucide-react";
import type { Discussion } from "../types";
import { createDiscussion, fetchDiscussions } from "../lib/api";
import { formatRelativeTime } from "../lib/format";
import { PageIntro } from "../components/PageIntro";
import { Modal } from "../components/ui/Modal";

interface CommunityPageProps {
  onOpenDiscussion: (discussion: Discussion) => void;
  onToast: (message: string) => void;
}

export function CommunityPage({
  onOpenDiscussion,
  onToast,
}: CommunityPageProps) {
  const [threads, setThreads] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tag, setTag] = useState("General");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await fetchDiscussions();
      setThreads(
        rows.map((row) => ({
          ...row,
          time: formatRelativeTime(row.createdAt),
        })),
      );
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load community discussions.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    if (title.trim().length < 3) {
      setError("Give the discussion a title with at least three characters.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await createDiscussion(title.trim(), body.trim(), tag);
      setTitle("");
      setBody("");
      setTag("General");
      setComposerOpen(false);
      onToast("Discussion published to the community.");
      await load();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not publish the discussion.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageIntro
        eyebrow="Shared learning"
        title="Community"
        description="Questions, explanations and small discoveries. Discussions are stored in Supabase and visible to signed-in learners."
        aside={
          <button
            type="button"
            onClick={() => setComposerOpen(true)}
            className="flex items-center gap-2 rounded-full bg-forest-900 px-4 py-2.5 text-[12px] font-medium text-cream-50 shadow-[0_4px_12px_-6px_rgba(21,43,33,0.7)] transition-colors hover:bg-forest-800"
          >
            <Plus size={14} />
            Start a discussion
          </button>
        }
      />

      {error && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rust-200 bg-rust-50 px-4 py-3 text-[11.5px] text-rust-700">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex items-center gap-1.5 rounded-full border border-rust-200 bg-cream-50 px-3 py-1 text-[10.5px] font-medium"
          >
            <RefreshCw size={11} /> Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-sand/80 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <MessageCircle size={16} className="text-forest-700" />
              <h2 className="text-[13.5px] font-semibold text-ink">
                Recent discussions
              </h2>
            </div>
            <span className="text-[10.5px] text-muted">
              {threads.length} thread{threads.length === 1 ? "" : "s"}
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 px-5 py-14 text-[12px] text-muted">
              <Loader2 size={15} className="animate-spin" />
              Loading discussions…
            </div>
          ) : threads.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <MessageCircle size={22} className="mx-auto text-forest-600" />
              <p className="mt-3 text-[13px] font-medium text-ink">
                No discussions yet
              </p>
              <p className="mt-1 text-[11.5px] text-muted">
                Start the first thread with a question or an explanation.
              </p>
              <button
                type="button"
                onClick={() => setComposerOpen(true)}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-forest-900 px-4 py-2 text-[11.5px] font-medium text-cream-50 hover:bg-forest-800"
              >
                <Plus size={12} /> Start a discussion
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-sand/60">
              {threads.map((thread) => (
                <li key={thread.id}>
                  <button
                    type="button"
                    onClick={() => onOpenDiscussion(thread)}
                    className="group flex w-full items-start gap-3.5 px-5 py-4 text-left transition-colors hover:bg-cream-100/70"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e4ead9] text-[12px] font-semibold text-forest-700">
                      {thread.author.slice(0, 1)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-[13.5px] font-medium leading-snug text-ink">
                          {thread.title}
                        </span>
                        <span className="rounded-full bg-cream-200/90 px-2 py-0.5 text-[9.5px] text-muted">
                          {thread.tag}
                        </span>
                      </span>
                      {thread.body && (
                        <span className="mt-1 line-clamp-2 block text-[11px] leading-snug text-muted">
                          {thread.body}
                        </span>
                      )}
                      <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] text-muted">
                        <span>Started by {thread.author}</span>
                        <span className="flex items-center gap-1">
                          <MessageCircle size={11} /> {thread.replies} replies
                        </span>
                        <span>{thread.time}</span>
                      </span>
                    </span>
                    <ArrowRight
                      size={15}
                      className="mt-1 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-forest-800"
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside className="flex flex-col gap-4">
          <section className="panel p-4">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-forest-700" />
              <h2 className="text-[13px] font-semibold text-ink">
                A learning community
              </h2>
            </div>
            <p className="mt-2 text-[11.5px] leading-relaxed text-muted">
              Ask about a concept, explain something you just understood, or
              share a small map. The goal is understanding, not performance.
            </p>
            <p className="mt-2 text-[10.5px] leading-relaxed text-muted/80">
              Posts and replies are stored in the database and scoped to your
              authenticated account for writes.
            </p>
          </section>
          <section className="panel p-4">
            <h2 className="text-[12px] font-semibold text-ink">
              Suggested topics
            </h2>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {["Architecture", "Git", "Networking", "HTTP", "Deployment"].map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setTag(item);
                      setComposerOpen(true);
                    }}
                    className="rounded-full border border-sand bg-cream-100 px-2.5 py-1 text-[10px] text-forest-800 hover:border-forest-300 hover:bg-cream-200"
                  >
                    {item}
                  </button>
                ),
              )}
            </div>
          </section>
        </aside>
      </div>

      <Modal
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        title="Start a discussion"
        eyebrow="Published to signed-in learners"
        size="md"
      >
        <form onSubmit={submit}>
          <label
            htmlFor="discussion-title"
            className="text-[11px] font-medium text-forest-800"
          >
            Title
          </label>
          <input
            id="discussion-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={140}
            placeholder="What are you trying to understand?"
            className="mt-1.5 h-10 w-full rounded-lg border border-sand bg-cream-50 px-3 text-[12.5px] text-ink placeholder:text-muted/70 focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-200"
          />
          <label
            htmlFor="discussion-tag"
            className="mt-3 block text-[11px] font-medium text-forest-800"
          >
            Topic
          </label>
          <select
            id="discussion-tag"
            value={tag}
            onChange={(event) => setTag(event.target.value)}
            className="mt-1.5 h-10 w-full rounded-lg border border-sand bg-cream-50 px-2.5 text-[12.5px] text-ink focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-200"
          >
            {[
              "General",
              "Architecture",
              "Git",
              "Networking",
              "HTTP",
              "Deployment",
              "Databases",
              "Security",
            ].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <label
            htmlFor="discussion-body"
            className="mt-3 block text-[11px] font-medium text-forest-800"
          >
            Context
          </label>
          <textarea
            id="discussion-body"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={4}
            maxLength={5000}
            placeholder="Add a little context for the community..."
            className="mt-1.5 w-full resize-none rounded-lg border border-sand bg-cream-50 px-3 py-2.5 text-[12.5px] text-ink placeholder:text-muted/70 focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-200"
          />
          <p className="mt-2 text-[10.5px] leading-relaxed text-muted">
            The server records your display name, the title and the body. There
            is no anonymous mode.
          </p>
          {error && (
            <p className="mt-2 rounded-lg border border-rust-200 bg-rust-50 px-3 py-2 text-[11px] text-rust-700">
              {error}
            </p>
          )}
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setComposerOpen(false)}
              className="rounded-full border border-sand px-4 py-2 text-[11.5px] text-forest-800 hover:bg-cream-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy || title.trim().length < 3}
              className="rounded-full bg-forest-900 px-4 py-2 text-[11.5px] font-medium text-cream-50 transition-colors hover:bg-forest-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? "Publishing…" : "Publish discussion"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
