import type { ReactNode } from "react";

interface PageIntroProps {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
}

export function PageIntro({
  eyebrow,
  title,
  description,
  aside,
}: PageIntroProps) {
  return (
    <div className="relative mb-6 flex flex-col justify-between gap-4 overflow-hidden sm:flex-row sm:items-end">
      <div className="relative z-10 max-w-2xl">
        <p className="mb-2 text-[10.5px] font-medium uppercase tracking-[0.18em] text-rust-500">
          {eyebrow}
        </p>
        <h1 className="display-title text-[34px] leading-[1.05] text-forest-950">
          {title}
        </h1>
        <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-muted">
          {description}
        </p>
      </div>
      {aside && <div className="relative z-10 shrink-0">{aside}</div>}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-10 h-40 w-64 opacity-[0.35]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(187,95,59,0.14), transparent 70%), radial-gradient(closest-side, rgba(97,125,95,0.18), transparent 72%)",
        }}
      />
    </div>
  );
}
