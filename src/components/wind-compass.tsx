"use client";

import { msToKnots, windDegToCardinal, windDegToArrow } from "@/lib/wind-utils";

interface WindCompassProps {
  direction: number; // degrés
  speed: number; // m/s
  gusts: number; // m/s
  size?: number;
}

export function WindCompass({ direction, speed, gusts, size = 96 }: WindCompassProps) {
  const rad = ((direction - 90) * Math.PI) / 180;
  const arrowLen = size * 0.3;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox="-48 -48 96 96">
        {/* Cadran */}
        <circle cx={0} cy={0} r={44} fill="none" stroke="currentColor" strokeWidth={1} className="text-border/40" />
        {/* Points cardinaux */}
        {["N", "E", "S", "O"].map((card, i) => {
          const angle = (i * 90 * Math.PI) / 180;
          return (
            <text
              key={card}
              x={Math.sin(angle) * 36}
              y={-Math.cos(angle) * 36 + 4}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px] font-medium"
            >
              {card}
            </text>
          );
        })}
        {/* Flèche direction */}
        <line
          x1={0}
          y1={0}
          x2={Math.cos(rad) * arrowLen}
          y2={Math.sin(rad) * arrowLen}
          stroke="#00d4ff"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        {/* Pointe de flèche */}
        <polygon
          points={`${Math.cos(rad) * arrowLen},${Math.sin(rad) * arrowLen}
            ${Math.cos(rad + 2.5) * (arrowLen - 8)},${Math.sin(rad + 2.5) * (arrowLen - 8)}
            ${Math.cos(rad - 2.5) * (arrowLen - 8)},${Math.sin(rad - 2.5) * (arrowLen - 8)}`}
          fill="#00d4ff"
        />
      </svg>
      <div className="text-center text-xs">
        <div className="font-bold text-foreground">
          {windDegToCardinal(direction)} {windDegToArrow(direction)}
        </div>
        <div className="text-muted-foreground">
          {msToKnots(speed)} kts · raf. {msToKnots(gusts)} kts
        </div>
      </div>
    </div>
  );
}
