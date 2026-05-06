/**
 * Conversion et formatage pour le vent.
 * Toutes les valeurs Open-Meteo sont en m/s.
 */

const MS_TO_KTS = 1.94384;
const MS_TO_KMH = 3.6;

export function msToKnots(ms: number): number {
  return Math.round(ms * MS_TO_KTS * 10) / 10;
}

export function msToKmh(ms: number): number {
  return Math.round(ms * MS_TO_KMH);
}

/** Direction cardinale du vent */
export function windDegToCardinal(deg: number): string {
  const directions = [
    "N", "NNE", "NE", "ENE",
    "E", "ESE", "SE", "SSE",
    "S", "SSO", "SO", "OSO",
    "O", "ONO", "NO", "NNO",
  ];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
}

/** Flèche direction (↑ = Nord) */
export function windDegToArrow(deg: number): string {
  const arrows = ["↑", "↗", "→", "↘", "↓", "↙", "←", "↖"];
  const index = Math.round(deg / 45) % 8;
  return arrows[index];
}

/** Évaluation des conditions pour le wingfoil */
export function evaluateConditions(
  windKts: number,
  gustKts: number
): { label: string; color: string; emoji: string } {
  if (windKts < 8) return { label: "Trop faible", color: "text-gray-400", emoji: "😴" };
  if (windKts < 10) return { label: "Léger", color: "text-yellow-400", emoji: "🤔" };
  if (windKts <= 20) {
    if (gustKts > 35) return { label: "Rafales fortes", color: "text-orange-400", emoji: "⚠️" };
    return { label: "Idéal", color: "text-green-400", emoji: "🤙" };
  }
  if (windKts <= 30) return { label: "Soutenu", color: "text-orange-400", emoji: "💪" };
  return { label: "Tempête", color: "text-red-400", emoji: "🏠" };
}

/** Couleur de fond selon la vitesse du vent */
export function windColorBg(ms: number): string {
  if (ms < 3) return "bg-gray-500/20";
  if (ms < 5) return "bg-yellow-500/20";
  if (ms < 10) return "bg-green-500/20";
  if (ms < 14) return "bg-orange-500/20";
  return "bg-red-500/20";
}

/** Distance angulaire minimale entre deux caps (0-360) */
function angularDist(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

/**
 * Évalue la sécurité du vent par rapport à la côte.
 * @param windDir - direction D'OÙ vient le vent (degrés, convention météo)
 * @param coastHeading - direction vers la mer (null = plan d'eau intérieur)
 */
export function evaluateWindSafety(
  windDir: number,
  coastHeading: number | null
): { label: string; color: string; icon: string; detail: string } {
  if (coastHeading === null) {
    return { label: "Eau intérieure", color: "text-blue-300", icon: "🏞️", detail: "Pas de danger offshore" };
  }

  const distToOnshore = angularDist(windDir, coastHeading);
  const distToOffshore = angularDist(windDir, (coastHeading + 180) % 360);

  if (distToOnshore <= 60) {
    return { label: "Onshore ✓", color: "text-green-400", icon: "🏄", detail: "Le vent pousse vers la plage — safe" };
  }
  if (distToOnshore <= 90) {
    return { label: "Side-onshore ✓", color: "text-green-300", icon: "🏄", detail: "Vent légèrement de travers — ok" };
  }
  if (distToOffshore <= 90) {
    return { label: "Offshore ⚠️", color: "text-red-400", icon: "🚫", detail: "Le vent pousse vers le large — DANGER" };
  }
  // Side
  return { label: "Side ≈", color: "text-yellow-300", icon: "🤙", detail: "Vent parallèle à la côte — ça va" };
}

/** Nom du modèle météo pour affichage */
export function modelLabel(): string {
  return "ICON-D2/EU (DWD, 2-7 km)";
}
