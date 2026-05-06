"use client";

import type { SpotSummary } from "@/lib/wind-utils";

interface Props {
  spots: SpotSummary[];
}

export function SpotSummaryTable({ spots }: Props) {
  if (spots.length === 0) return null;

  const bestScore = spots[0].score;
  const worstScore = spots[spots.length - 1].score;

  function scoreBar(score: number): string {
    if (bestScore === worstScore) return "w-full";
    const pct = ((score - worstScore) / (bestScore - worstScore)) * 100;
    return `${Math.max(5, pct)}%`;
  }

  return (
    <div className="rounded-lg border border-border/50 overflow-hidden">
      <div className="px-4 py-2 bg-muted/30 border-b border-border/30">
        <h2 className="text-sm font-semibold text-foreground">
          📊 Classement — {spots.length} spots
        </h2>
      </div>
      <div className="divide-y divide-border/20">
        {spots.map((s, i) => (
          <div
            key={s.name}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/10 transition-colors"
          >
            {/* Rang */}
            <div className="text-xs font-bold text-muted-foreground w-5 text-right tabular-nums">
              {i + 1}
            </div>

            {/* Nom */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground truncate">{s.name}</div>
              <div className="text-[10px] text-muted-foreground">
                {s.weather} {s.direction}
              </div>
            </div>

            {/* Vent */}
            <div className="text-right min-w-[80px]">
              <div className="text-sm font-bold tabular-nums text-foreground">
                {s.windKts}
                <span className="text-[10px] font-normal text-muted-foreground"> kts</span>
              </div>
              <div className="text-[10px] text-muted-foreground">
                raf. {s.gustKts} kts
              </div>
            </div>

            {/* Sécurité */}
            <div className={`text-xs font-semibold ${s.safety.color} min-w-[90px] text-right`}>
              {s.safety.icon} {s.safety.label}
            </div>

            {/* Score bar */}
            <div className="w-20 hidden md:block">
              <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    s.score >= 60 ? "bg-green-500" :
                    s.score >= 30 ? "bg-yellow-500" :
                    s.score >= 0 ? "bg-orange-500" :
                    "bg-red-500"
                  }`}
                  style={{ width: scoreBar(s.score) }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
