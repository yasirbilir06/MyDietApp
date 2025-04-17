// utils/infantNutritionCalculations.ts

export type FeedingType = "karışık" | "formül";

// 1. Olması gereken ağırlık (g)
export function calculateExpectedWeight(ageInMonths: number, birthWeight: number): number {
  let gainedWeight = 0;

  if (ageInMonths <= 6) {
    gainedWeight = ageInMonths * 800;
  } else {
    gainedWeight = 6 * 800 + (ageInMonths - 6) * 500;
  }

  return birthWeight + gainedWeight;
}

// 2. Enerji gereksinimi
export function calculateEnergyNeed(weightKg: number, ageInMonths: number): number {
  let energyPerKg = 0;

  if (ageInMonths <= 2) energyPerKg = 105;
  else if (ageInMonths <= 5) energyPerKg = 90;
  else if (ageInMonths <= 8) energyPerKg = 82.5;
  else energyPerKg = 80;

  return energyPerKg * weightKg;
}

// 3. Protein gereksinimi
export function calculateProteinNeed(weightKg: number, ageInMonths: number, type: FeedingType): number {
  let proteinPerKg = 0;

  if (type === "karışık") {
    if (ageInMonths >= 0 && ageInMonths <= 3) proteinPerKg = 3.6;
    else if (ageInMonths >= 4 && ageInMonths <= 6) proteinPerKg = 3.3;
    else if (ageInMonths >= 7 && ageInMonths <= 9) proteinPerKg = 2.7;
    else if (ageInMonths >= 10 && ageInMonths <= 12) proteinPerKg = 2.5;
  } else if (type === "formül") {
    if (ageInMonths >= 0 && ageInMonths <= 4) proteinPerKg = 2.3;
    else if (ageInMonths >= 5 && ageInMonths <= 12) proteinPerKg = 1.5;
  }

  return Number((proteinPerKg * weightKg).toFixed(2));
}



// 4. Karbonhidrat yüzdesi
export function calculateCarbPercentage(ageInMonths: number): string {
  if (ageInMonths <= 6) return "%40–50";
  return "%50–55";
}

// 5. Yağ gereksinimi
export function calculateFatNeed(): string {
  return "%30–35";
}


// 6. Sıvı gereksinimi
export function calculateFluidNeed(weightKg: number): [number, number] {
  const min = 150 * weightKg;
  const max = 175 * weightKg;
  return [min, max];
}

// 7. Toplu hesaplama fonksiyonu
export function calculateInfantNutritionNeeds(
  ageInMonths: number,
  expectedWeightGr: number,
  feedingType: FeedingType
) {
  const weightKg = expectedWeightGr / 1000;

  const energy = calculateEnergyNeed(weightKg, ageInMonths);
  const protein = calculateProteinNeed(weightKg, ageInMonths, feedingType);
  const carbs = calculateCarbPercentage(ageInMonths);
  const fat = calculateFatNeed();



  const [min, max] = calculateFluidNeed(weightKg);

  return {
    energy: Math.round(energy),
    protein,
    carbs,
    fat,
    fluid: {
      min: Math.round(min),
      max: Math.round(max),
    },
  };
}
