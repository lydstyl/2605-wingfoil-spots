"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WindCompass } from "./wind-compass";
import { msToKnots, msToKmh, evaluateConditions, evaluateWindSafety, modelLabel } from "@/lib/wind-utils";
import { weatherCodeToEmoji } from "@/lib/open-meteo";
import type { SpotWindForecast } from "@/lib/open-meteo";
import { useState } from "react";

interface SpotCardProps {
  name: string;
  description: string | null;
  lat: number;
  lon: number;
  coastHeading: number | null;
  wind: SpotWindForecast;
}

export function SpotCard({ name, description, lat, lon, coastHeading, wind }: SpotCardProps) {
  const [showWindy, setShowWindy] = useState(false);
  const { current, hourly, daily } = wind;
  const windKts = msToKnots(current.windSpeed10m);
  const gustKts = msToKnots(current.windGusts10m);
  const cond = evaluateConditions(windKts, gustKts);
  const safety = evaluateWindSafety(current.windDirection10m, coastHeading);

  // Prochaines 6h
  const next6h = hourly.slice(0, 6);

  return (
    <Card className="overflow-hidden border-border/50 hover:border-primary/30 transition-colors">
      {/* Header */}
      <div className="p-4 bg-card/50 border-b border-border/30">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-lg font-bold text-foreground">{name}</h2>
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            )}
            <p className="text-[10px] text-muted-foreground/60 mt-1">
              {lat.toFixed(3)}, {lon.toFixed(3)}
            </p>
          </div>
          <div className="text-right space-y-1">
            <div className={`text-sm font-bold ${cond.color}`}>
              {cond.emoji} {cond.label}
            </div>
            {/* Wind safety */}
            <div className={`text-xs font-semibold ${safety.color}`}>
              {safety.icon} {safety.label}
            </div>
            <div className="text-[10px] text-muted-foreground" title={safety.detail}>
              {weatherCodeToEmoji(current.weatherCode)} · {modelLabel()}
            </div>
          </div>
        </div>

        {/* Current wind big numbers */}
        <div className="flex items-center justify-between">
          <WindCompass
            direction={current.windDirection10m}
            speed={current.windSpeed10m}
            gusts={current.windGusts10m}
          />
          <div className="text-right space-y-1">
            <div>
              <span className="text-3xl font-bold tabular-nums text-foreground">{windKts}</span>
              <span className="text-sm text-muted-foreground ml-1">kts</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {msToKmh(current.windSpeed10m)} km/h
            </div>
            <div className="text-xs text-muted-foreground">
              Rafales <span className="font-semibold text-foreground">{gustKts} kts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hourly preview */}
      <div className="px-4 py-2 bg-muted/20">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {next6h.map((h) => (
            <div
              key={h.hour}
              className="flex flex-col items-center min-w-[48px] px-1.5 py-1 rounded bg-muted/30"
            >
              <span className="text-[10px] text-muted-foreground">
                {new Date(h.hour).getHours()}h
              </span>
              <svg width={16} height={16} viewBox="-16 -16 32 32">
                <line
                  x1={0} y1={0}
                  x2={Math.cos(((h.windDirection10m - 90) * Math.PI) / 180) * 12}
                  y2={Math.sin(((h.windDirection10m - 90) * Math.PI) / 180) * 12}
                  stroke="#00d4ff" strokeWidth={1.5} strokeLinecap="round"
                />
              </svg>
              <span className="text-[11px] font-semibold tabular-nums leading-tight">
                {msToKnots(h.windSpeed10m)}
              </span>
              <span className="text-[9px] text-muted-foreground/70">
                {msToKnots(h.windGusts10m)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily summary */}
      <div className="px-4 py-2 border-t border-border/20">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Prévisions 3 jours</p>
        <div className="flex gap-2 text-xs">
          {daily.map((d) => (
            <div key={d.date} className="flex-1 text-center">
              <div className="text-muted-foreground">
                {new Date(d.date).toLocaleDateString("fr", { weekday: "short" })}
              </div>
              <div className="font-bold tabular-nums">
                {msToKnots(d.windSpeedMax)} kts
              </div>
              <div className="text-[10px] text-muted-foreground/70">
                raf. {msToKnots(d.windGustsMax)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Windy toggle */}
      <CardContent className="p-0">
        <Button
          variant="ghost"
          className="w-full rounded-none h-8 text-xs text-muted-foreground hover:text-foreground"
          onClick={() => setShowWindy(!showWindy)}
        >
          {showWindy ? "Masquer la carte" : "Voir la carte Windy"}
        </Button>
        {showWindy && (
          <iframe
            title={`Windy - ${name}`}
            width="100%"
            height="350"
            src={`https://embed.windy.com/embed.html?type=map&location=coordinates&detailLat=${lat}&detailLon=${lon}&metricWind=kt&metricTemp=°C&detail=true&pressure=true&zoom=12&level=surface&product=wind&message=true`}
            className="border-0"
            loading="lazy"
          />
        )}
      </CardContent>
    </Card>
  );
}
