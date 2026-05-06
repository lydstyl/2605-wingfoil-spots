import { db } from "./index";
import { spots } from "./schema";

async function seed() {
  console.log("🌱 Seeding spots...");

  await db.insert(spots).values([
    {
      name: "Étang du Vignoble",
      slug: "etang-du-vignoble",
      latitude: 50.345,
      longitude: 3.499,
      description: "Spot wingfoil près de Valenciennes. Eau plate, vent thermique l'été.",
      isCoastal: "false",
    },
  ]).onConflictDoNothing();

  console.log("✅ Spots seeded!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
