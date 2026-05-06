import { getAllSpotsWind } from "@/lib/spots";
import { SpotCard } from "@/components/spot-card";
import { SpotSummaryTable } from "@/components/spot-summary";
import { buildSpotSummary, type SpotSummary } from "@/lib/wind-utils";

export const dynamic = "force-dynamic";
export const revalidate = 900; // 15 min

export default async function HomePage() {
  let spotsWind;
  let error: string | null = null;
  let summaries: SpotSummary[] = [];

  try {
    spotsWind = await getAllSpotsWind();
    summaries = spotsWind
      .map(({ spot, wind }) =>
        buildSpotSummary(
          spot.name,
          wind.current.windSpeed10m,
          wind.current.windGusts10m,
          wind.current.windDirection10m,
          spot.coastHeading,
          wind.current.weatherCode
        )
      )
      .sort((a, b) => b.score - a.score);
  } catch (err) {
    error = err instanceof Error ? err.message : "Erreur inconnue";
  }

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <header className="text-center py-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          🌬️ Wingfoil Spots
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Compare les conditions de vent pour tes spots favoris
        </p>
        <p className="text-[10px] text-muted-foreground/50 mt-1">
          Modèle ICON-D2/EU (DWD) · Vent à 10m · MAJ toutes les 15 min
        </p>
      </header>

      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive">
          Erreur lors du chargement des données : {error}
        </div>
      )}

      {/* Classement résumé */}
      {summaries.length > 0 && <SpotSummaryTable spots={summaries} />}

      {/* Spots grid */}
      {spotsWind && spotsWind.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {spotsWind.map(({ spot, wind }) => (
            <SpotCard
              key={spot.id}
              name={spot.name}
              description={spot.description}
              lat={spot.latitude}
              lon={spot.longitude}
              coastHeading={spot.coastHeading}
              wind={wind}
            />
          ))}
        </div>
      ) : !error ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucun spot configuré.</p>
        </div>
      ) : null}

      {/* Footer */}
      <footer className="text-center py-6 text-[10px] text-muted-foreground/40">
        Wingfoil Spots · {new Date().getFullYear()}
      </footer>
    </main>
  );
}
