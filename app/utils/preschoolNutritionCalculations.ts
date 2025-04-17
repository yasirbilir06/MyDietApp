// utils/preschoolNutritionCalculations.ts

export function calculateExpectedWeight(age: number): number {
    return age * 2 + 8;
  }
  
  export function calculateExpectedHeight(age: number): { min: number; max: number } {
    const min = age * 5 + 76;
    const max = age * 5 + 80;
    return { min, max };
  }
  
  
  export function calculateEnergyRequirement(age: number): number {
    return age * 100 + 1000;
  }
  
  export function calculateProteinRequirement(): string {
    return "%12–15 veya 2.0–2.5 g/kg/gün";
  }
  
  
  export function calculateCHORequirement(): string {
    return "%50–60";
  }
  
  export function calculateFatRequirement(): string {
    return "%30–35";
  }
  
  export function calculateFiberRequirement(age: number): number {
    return age + 5;
  }
  
  export function calculateFluidRequirement(weightKg: number, age: number, energy: number): [number, number] {
    let min = 0;
    let max = 0;
  
    if (age >= 1 && age <= 3) {
      min = weightKg * 125;
      max = weightKg * 150;
    } else if (age >= 4 && age <= 6) {
      min = weightKg * 100;
      max = weightKg * 125;
    } else if (age >= 7 && age <= 10) {
      min = energy;  // 1 mL/kcal
      max = energy;
    }
  
    return [Math.round(min), Math.round(max)];
  }
  
  
  export function calculatePreschoolNutrition(age: number) {
    const weight = calculateExpectedWeight(age);
    const { min: heightMin, max: heightMax } = calculateExpectedHeight(age);

    const energy = calculateEnergyRequirement(age);
    const protein = calculateProteinRequirement();
    const cho = calculateCHORequirement();
    const fat = calculateFatRequirement();
    const fiber = calculateFiberRequirement(age);
    const [fluidMin, fluidMax] = calculateFluidRequirement(weight, age, energy);
  
    return {
      weight,
      energy,
      protein,
      cho,
      fat,
      fiber,
      fluid: {
        min: fluidMin,
        max: fluidMax,
      },
      height: {
        min: heightMin,
        max: heightMax,
    }
    };
  }
  