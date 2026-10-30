import { useMemo, useState } from "react";
import { BookOpen, SearchX, X } from "lucide-react";
import type { LearningPath, PathStatus } from "../types";
import { useLearner } from "../context/LearnerContext";
import {
  curriculumStats,
  pathMatchesSearch,
} from "../lib/curriculum";
import { LearningPathCard } from "../components/dashboard/LearningPathCard";
import { PageIntro } from "../components/PageIntro";

type Filter = "All" | PathStatus;

const filters: Filter[] = [
  "All",
  "In Progress",
  "Not Started",
  "Completed",
];

interface LearningPathsPageProps {
  searchQuery: string;
  onClearSearch: () => void;
  onOpenPath: (path: LearningPath) => void;
}

export function LearningPathsPage({
  searchQuery,
  onClearSearch,
  onOpenPath,
}: LearningPathsPageProps) {
  const { paths } = useLearner();
  const [filter, setFilter] = useState<Filter>("All");
  const term = searchQuery.trim();

  const filtered = useMemo(() => {
    return paths.filter((path) => {
      const matchesFilter = filter === "All" || path.status === filter;
      return matchesFilter && pathMatchesSearch(path.id, term);
    });
  }, [filter, paths, term]);

  return (
    <div className="animate-fade-in">
      <PageIntro
        eyebrow="Learning journey"
        title="Learning Paths"
        description="Every path in the supplied TechStructure curriculum: lesson Markdown, scope, prerequisites and assessments, organised into four tiers."
        aside={
          <div className="flex items-center gap-2 rounded-full border border-sand bg-cream-50 px-3.5 py-2 text-[11.5px] text-muted">
            <BookOpen size={14} className="text-forest-700" />
            {curriculumStats.paths} paths · {curriculumStats.lessons} lessons
          </div>
        }
      />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Filter learning paths"
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

        {(term || filter !== "All") && (
          <div className="flex items-center gap-2 text-[11.5px] text-muted">
            {term && (
              <span className="max-w-[320px] truncate rounded-full bg-cream-300/70 px-2.5 py-1">
                Search: “{term}”
              </span>
            )}
            <span className="text-[10.5px]">
              {filtered.length} of {paths.length}
            </span>
            <button
              type="button"
              onClick={() => {
                setFilter("All");
                onClearSearch();
              }}
              className="flex items-center gap-1 rounded-full border border-sand bg-cream-50 px-2.5 py-1 text-forest-800 transition-colors hover:bg-cream-100"
            >
              <X size={12} />
              Clear
            </button>
          </div>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 min-[1500px]:grid-cols-4">
          {filtered.map((path) => (
            <LearningPathCard
              key={path.id}
              path={path}
              onOpen={onOpenPath}
              className="min-h-[258px]"
            />
          ))}
        </div>
      ) : (
        <div className="panel flex flex-col items-center justify-center px-6 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream-300/60 text-forest-700">
            <SearchX size={21} />
          </span>
          <h2 className="mt-4 font-display text-xl text-forest-900">
            No paths match that search
          </h2>
          <p className="mt-1.5 max-w-sm text-[12.5px] leading-relaxed text-muted">
            Searches check path titles, tiers, lesson titles, lesson scopes and
            the full lesson Markdown. Try another term or reset the filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setFilter("All");
              onClearSearch();
            }}
            className="mt-4 rounded-full bg-forest-900 px-4 py-2 text-[12px] font-medium text-cream-50 hover:bg-forest-800"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
