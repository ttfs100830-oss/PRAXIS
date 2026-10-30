import { ArrowRight } from "lucide-react";
import { useLearner } from "../../context/LearnerContext";
import { firstName } from "../../lib/format";
import { HeroScene } from "../illustrations/HeroScene";

interface HeroBannerProps {
  onContinue: () => void;
}

export function HeroBanner({ onContinue }: HeroBannerProps) {
  const { profile, stats } = useLearner();
  const name = firstName(profile.displayName);

  return (
    <section
      aria-labelledby="welcome-heading"
      className="panel relative isolate min-h-[254px] overflow-hidden rounded-2xl bg-cream-50"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(108deg, rgba(251,248,240,0.98) 0%, rgba(251,248,240,0.94) 42%, rgba(250,245,233,0.5) 65%, rgba(245,236,220,0.35) 100%)",
        }}
      />
      <HeroScene className="pointer-events-none absolute -right-2 bottom-0 top-0 hidden h-full w-[54%] min-w-[340px] opacity-95 md:block lg:min-w-[380px] xl:w-[58%] xl:min-w-[430px]" />

      <div className="relative z-10 flex h-full max-w-[470px] flex-col px-5 pb-4 pt-5 sm:px-6 sm:pb-3">
        <p className="text-[14.5px] font-medium text-ink">
          {stats.completedLessons > 0 ? "Welcome back, " : "Welcome, "}
          <span className="text-forest-800">{name}</span>
        </p>
        <h1
          id="welcome-heading"
          className="display-title mt-1 text-[34px] leading-[1.02] text-forest-950 min-[420px]:text-[37px] sm:text-[41px] xl:text-[45px] min-[1400px]:text-[47px]"
        >
          <span className="block">Learn the structure</span>
          <span className="block text-rust-500">behind technology</span>
        </h1>
        <p className="mt-2 max-w-[348px] text-[13px] leading-[1.5] text-[#5f6d60] sm:text-[13.5px] sm:leading-[1.52]">
          {stats.completedLessons > 0
            ? `You have completed ${stats.completedLessons} lesson${
                stats.completedLessons === 1 ? "" : "s"
              } and earned ${stats.totalXp.toLocaleString()} XP. Keep the thread going.`
            : "Explore how systems, environments and workflows connect. Your first lesson is waiting."}
        </p>
        <button
          type="button"
          onClick={onContinue}
          className="group mt-3.5 inline-flex h-9 w-fit items-center gap-2.5 rounded-full bg-forest-900 px-5 text-[12px] font-medium text-cream-50 shadow-[0_4px_12px_-6px_rgba(21,43,33,0.7)] transition-colors hover:bg-forest-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rust-400 focus-visible:ring-offset-2"
        >
          {stats.completedLessons > 0 ? "Continue learning" : "Start learning"}
          <ArrowRight
            size={15}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </button>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-cream-100/25 to-transparent" />
    </section>
  );
}
