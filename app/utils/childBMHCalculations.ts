// utils/childBMHCalculations.ts

// Cinsiyet tipi tanımı
export type Gender = "male" | "female";

// WHO BMH Hesabı
export function calculateWHO(age: number, weight: number, gender: Gender): number {
  if (gender === "male") {
    if (age <= 3) return 60.9 * weight - 54;
    if (age <= 10) return 22.7 * weight + 495;
    if (age <= 18) return 17.5 * weight + 651;
  } else {
    if (age <= 3) return 61 * weight - 51;
    if (age <= 10) return 22.5 * weight + 499;
    if (age <= 18) return 12.2 * weight + 746;
  }
  return 0;
}

// WHO Büyüme Gelişme Ek Kalori
export function calculateGrowthAddition(age: number, weight: number): number {
  if (age >= 10 && age <= 14) return 1.9 * weight;
  if (age >= 15 && age <= 17) return 1.5 * weight;
  if (age >= 18 && age <= 19) return 0.9 * weight;
  return 0;
}

// Schofield Hesabı (boy cm girilecek, içeride m'ye çevrilir)
export function calculateSchofield(
    age: number,
    weight: number,
    heightCm: number,
    gender: "male" | "female"
  ): number {
    const height = heightCm / 100; // 👈 cm → metreye çevirdik
  
    if (gender === "male") {
      if (age <= 3) return 0.167 * weight + 1517.4 * height - 617.6;
      if (age <= 10) return 19.6 * weight + 130.3 * height + 414.9;
      if (age <= 18) return 16.25 * weight + 137.2 * height + 515.5;
    } else {
      if (age <= 3) return 16.25 * weight + 1023.2 * height - 413.5;
      if (age <= 10) return 16.97 * weight + 161.8 * height + 371.2;
      if (age <= 18) return 8.365 * weight + 465 * height + 200;
    }
  
    return 0;
  }
  
  
  





// İdeal Ağırlık
export function calculateIdealWeight(age: number): number {
  if (age >= 1 && age <= 10) return 2 * age + 8;
  return 0;
}

// Beden Kitle İndeksi (BKI) — boy cm girilir, hesaplamada m'ye çevrilir
export function calculateBMI(weight: number, heightCm: number): number {
    if (!weight || !heightCm) return 0;
    const heightM = heightCm / 100;
    return weight / (heightM * heightM);
  }
  