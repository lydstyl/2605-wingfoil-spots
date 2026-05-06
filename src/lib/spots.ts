"use server";

import { db } from "@/db";
import { spots } from "@/db/schema";
import { eq } from "drizzle-orm";
import { fetchWindForecast, type SpotWindForecast } from "./open-meteo";

export async function getAllSpots() {
  return db.select().from(spots).orderBy(spots.name);
}

export async function getSpotWind(
  spotId: number
): Promise<{ spot: typeof spots.$inferSelect; wind: SpotWindForecast } | null> {
  const results = await db
    .select()
    .from(spots)
    .where(eq(spots.id, spotId))
    .limit(1);

  if (results.length === 0) return null;

  const spot = results[0];
  const wind = await fetchWindForecast(spot.latitude, spot.longitude);
  return { spot, wind };
}

export async function getAllSpotsWind(): Promise<
  { spot: typeof spots.$inferSelect; wind: SpotWindForecast }[]
> {
  const allSpots = await db.select().from(spots).orderBy(spots.name);

  const results = await Promise.all(
    allSpots.map(async (spot) => {
      const wind = await fetchWindForecast(spot.latitude, spot.longitude);
      return { spot, wind };
    })
  );

  return results;
}
