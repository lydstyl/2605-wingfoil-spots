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
          📊 Classement — {spots.length} spots · vent 14-16h
        </h2>
      </div>
      {/* Desktop header */}
      <div className="hidden md:flex items-center gap-3 px-4 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground/60 border-b border-border/20">
        <div className="w-5" />
        <div className="flex-1">Spot</div>
        <div className="w-[72px] text-right">Auj. PM</div>
        <div className="w-[72px] text-right">Dem. PM</div>
        <div className="w-[100px] text-right">Sécurité</div>
        <div className="w-20" />
      </div>
      <div className="divide-y divide-border/20">
        {spots.map((s, i) => (
          <a
            key={s.slug}
            href={`#spot-${s.slug}`}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/20 transition-colors cursor-pointer"
          >
            {/* Rang */}
            <div className="text-xs font-bold text-muted-foreground w-5 text-right tabular-nums">
              {i + 1}
            </div>

            {/* Nom */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground truncate hover:text-primary transition-colors">
                {s.name}
              </div>
              <div className="text-[10px] text-muted-foreground">
                {s.weather} {s.direction}
              </div>
            </div>

            {/* Aujourd'hui PM */}
            <div className="text-right min-w-[72px]">
              <div className="text-sm font-bold tabular-nums text-foreground">
                {s.windPmKts}
                <span className="text-[10px] font-normal text-muted-foreground"> kts</span>
              </div>
              <div className="text-[10px] text-muted-foreground">
                raf. {s.gustPmKts}
              </div>
            </div>

            {/* Demain PM */}
            <div className="text-right min-w-[72px]">
              <div className="text-sm tabular-nums text-foreground">
                {s.windTomorrowPmKts}
                <span className="text-[10px] font-normal text-muted-foreground"> kts</span>
              </div>
              <div className="text-[10px] text-muted-foreground">
                raf. {s.gustTomorrowPmKts}
              </div>
            </div>

            {/* Sécurité */}
            <div className={`text-xs font-semibold ${s.safety.color} min-w-[100px] text-right`}>
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
          </a>
        ))}
      </div>
    </div>
  );
}
