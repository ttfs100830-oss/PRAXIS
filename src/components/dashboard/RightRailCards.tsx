import { Trophy } from "lucide-react";
import { useLearner } from "../../context/LearnerContext";
import { PromoArt } from "../illustrations/PanelArt";
import { SprigCorner } from "../illustrations/Botanical";
import { percent } from "../../lib/format";

export function PromoCard() {
  return (
    <section className="panel relative min-h-[220px] overflow-hidden bg-[#f8f2e5]">
      <PromoArt className="pointer-events-none absolute -bottom-1 -right-1 h-[82%] w-[82%] opacity-95" />
      <SprigCorner className="pointer-events-none absolute -right-4 -top-3 w-[92px] opacity-50" />
      <div className="relative z-10 px-5 pt-5">
        <h2 className="display-title max-w-[195px] text-[27px] leading-[1.08] text-forest-950">
          Small steps
          <br />
          every day
          <br />
          build big skills.
        </h2>
        <span className="mt-3 block h-[2px] w-7 rounded-full bg-rust-400" />
      </div>
    </section>
  );
}

export function XpCard() {
  const { stats } = useLearner();
  const levelPercent = percent(stats.levelXp, stats.levelTarget);

  return (
    <section
      aria-labelledby="xp-heading"
      className="panel px-4 py-4"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#eddcc1] bg-[#f4e7d2] text-[#a97634]">
          <Trophy size={19} strokeWidth={1.8} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] leading-none text-muted">Total XP</p>
          <p className="display-title mt-1 text-[23px] leading-none text-forest-950">
            {stats.totalXp.toLocaleString("en-US")}
          </p>
        </div>
        <span className="rounded-full border border-sand bg-cream-100 px-2.5 py-1 text-[10.5px] font-medium text-forest-800">
          Level {stats.level}
        </span>
      </div>

      <div
        className="mt-3.5 h-[7px] overflow-hidden rounded-full bg-[#e8e1d2]"
        role="progressbar"
        aria-label={`Level ${stats.level} progress`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={levelPercent}
      >
        <div
          className="h-full rounded-full bg-[#78906f]"
          style={{ width: `${levelPercent}%` }}
        />
      </div>
      <p className="mt-1.5 text-[10px] text-muted">
        {stats.levelXp} / {stats.levelTarget} XP toward level {stats.level + 1}
      </p>
    </section>
  );
}

export function QuoteCard() {
  return (
    <section className="panel flex items-start gap-3 px-4 py-4">
      <svg
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="mt-0.5 h-6 w-6 shrink-0 text-[#8fa483]"
      >
        <path
          d="M16 27V12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M15.8 20.4C10 20.6 5.6 17.4 4 12c5.6-.7 10.2 2.5 11.8 8.4Z"
          fill="currentColor"
        />
        <path
          d="M16.2 15.6c.6-5.6 4.6-9.3 10.1-9.9-.1 5.7-4.1 9.4-10.1 9.9Z"
          fill="currentColor"
        />
        <path
          d="M16 10.4c-3.2-.8-5.6-3.2-6.3-7 3.6-.1 6.1 2.4 6.3 7Z"
          fill="currentColor"
          opacity="0.7"
        />
      </svg>
      <p className="font-display text-[13px] italic leading-[1.5] text-[#4f6154]">
        “It’s not just about learning tools, it’s about understanding how
        everything fits together.”
      </p>
    </section>
  );
}
