import { getAllSpotsWind } from "@/lib/spots";
import { SpotCard } from "@/components/spot-card";

export const dynamic = "force-dynamic";
export const revalidate = 900; // 15 min

export default async function HomePage() {
  let spotsWind;
  let error: string | null = null;

  try {
    spotsWind = await getAllSpotsWind();
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
          Données Open-Meteo · Vent à 10m · MAJ toutes les 15 min
        </p>
      </header>

      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive">
          Erreur lors du chargement des données : {error}
        </div>
      )}

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
