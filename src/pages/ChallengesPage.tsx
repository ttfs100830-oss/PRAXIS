import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Clock3,
  HelpCircle,
  Lock,
  Target,
  Trophy,
} from "lucide-react";
import type { Challenge } from "../types";
import { useLearner } from "../context/LearnerContext";
import { buildChallenges } from "../lib/curriculum";
import { PageIntro } from "../components/PageIntro";

interface ChallengesPageProps {
  onPreview: (challenge: Challenge) => void;
}

const levelTone: Record<Challenge["level"], string> = {
  Beginner: "bg-[#e3ead9] text-forest-700",
  Intermediate: "bg-[#f3e4d4] text-[#9a5a39]",
  Advanced: "bg-[#ece5d8] text-[#6b5d48]",
};

type Filter = "All" | "Ready" | "Completed" | "Locked";

const filters: Filter[] = ["All", "Ready", "Completed", "Locked"];

export function ChallengesPage({ onPreview }: ChallengesPageProps) {
  const { paths, attempts, completedLessonIds } = useLearner();
  const [filter, setFilter] = useState<Filter>("All");

  const challenges = useMemo(
    () => buildChallenges(paths, attempts, completedLessonIds),
    [attempts, completedLessonIds, paths],
  );

  const ready = challenges.filter((item) => item.status === "Ready").length;
  const completed = challenges.filter((item) => item.status === "Completed").length;

  const visible = challenges.filter(
    (item) => filter === "All" || item.status === filter,
  );

  return (
    <div className="animate-fade-in">
      <PageIntro
        eyebrow="Practice"
        title="Challenges"
        description="Every lesson with multiple-choice questions becomes an auto-graded challenge. Questions are checked by trusted database logic, and your attempts are stored on your account."
        aside={
          <div className="flex items-center gap-2 rounded-full border border-sand bg-cream-50 px-3.5 py-2 text-[11.5px] text-muted">
            <Trophy size={14} className="text-[#a97634]" />
            {ready} ready · {completed} passed
          </div>
        }
      />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Filter challenges"
          className="flex flex-wrap items-center gap-1.5"
        >
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              aria-pressed={filter === item}
              className={`rounded-full border px-3 py-1.5 text-[11.5px] font-medium transition-colors ${
                filter === item
                  ? "border-forest-800 bg-forest-800 text-cream-50"
                  : "border-sand bg-cream-50 text-forest-800 hover:border-forest-300 hover:bg-cream-100"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <p className="text-[10.5px] text-muted">
          {challenges.length} challenges · {visible.length} shown
        </p>
      </div>

      {visible.length === 0 ? (
        <div className="panel px-6 py-14 text-center">
          <Target size={23} className="mx-auto text-forest-600" />
          <p className="mt-3 text-[13.5px] font-medium text-ink">
            No challenges match this filter
          </p>
          <p className="mt-1 text-[12px] text-muted">
            Choose another status or open a lesson to work through free-response
            questions.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((challenge) => {
            const locked = challenge.status === "Locked";
            const pass = challenge.status === "Completed";
            return (
              <article
                key={challenge.id}
                className={`panel relative flex min-h-[250px] flex-col p-5 ${
                  locked ? "opacity-[0.82]" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e9ecdd] text-forest-700">
                    {locked ? (
                      <Lock size={19} strokeWidth={1.7} />
                    ) : pass ? (
                      <Check size={20} strokeWidth={1.8} />
                    ) : (
                      <Target size={20} strokeWidth={1.7} />
                    )}
                  </span>
                  <div className="flex flex-wrap justify-end gap-1.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${levelTone[challenge.level]}`}
                    >
                      {challenge.level}
                    </span>
                    <span className="rounded-full border border-sand bg-cream-100 px-2.5 py-1 text-[10px] text-muted">
                      {challenge.status}
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.12em] text-rust-500">
                  {challenge.pathTitle}
                </p>
                <h2 className="mt-1 text-[17px] font-semibold tracking-[-0.01em] text-ink">
                  {challenge.title}
                </h2>
                <p className="mt-1.5 line-clamp-3 text-[12.5px] leading-relaxed text-muted">
                  {challenge.description}
                </p>

                <div className="mt-auto flex flex-wrap items-center gap-4 pt-5 text-[11px] text-muted">
                  <span className="flex items-center gap-1.5">
                    <HelpCircle size={13} />
                    {challenge.questions} questions
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check size={13} />
                    {challenge.autoGradableQuestions} auto-graded
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock3 size={13} />
                    {challenge.minutes} min
                  </span>
                </div>

                <p className="mt-2 text-[10px] text-muted">
                  Pass mark: {challenge.passingScorePercent}% on auto-graded
                  questions
                </p>

                <button
                  type="button"
                  disabled={locked}
                  onClick={() => onPreview(challenge)}
                  className={`mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-lg text-[11.5px] font-medium transition-colors ${
                    locked
                      ? "cursor-not-allowed border border-sand bg-cream-200/60 text-muted"
                      : pass
                        ? "border border-forest-300 bg-cream-50 text-forest-800 hover:bg-cream-100"
                        : "bg-forest-900 text-cream-50 hover:bg-forest-800"
                  }`}
                >
                  {locked
                    ? "Prerequisites incomplete"
                    : pass
                      ? "Review challenge"
                      : "Open challenge"}
                  {!locked && <ArrowRight size={13} />}
                </button>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
