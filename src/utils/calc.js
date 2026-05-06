// Mifflin-St Jeor BMR × activity × goal adjustment
export function calcTargets({ weightLb, heightCm, level, goal }) {
  const wKg = (+weightLb || 0) * 0.45359237;
  const h = +heightCm || 0;
  const age = 30;
  const bmr = 10 * wKg + 6.25 * h - 5 * age + 5;
  const mult = ({ sedentary: 1.2, light: 1.375, moderate: 1.55, very: 1.725, athlete: 1.9 })[level] || 1.55;
  const tdee = bmr * mult;
  const adj = ({ muscle: 1.10, fat: 0.80, maint: 1.0 })[goal] || 1.0;
  const calories = Math.round((tdee * adj) / 10) * 10;
  const proteinPerLb = ({ muscle: 1.0, fat: 1.1, maint: 0.9 })[goal] || 1.0;
  const protein = Math.round((+weightLb || 0) * proteinPerLb);
  const fatKcal = calories * 0.25;
  const fat = Math.round(fatKcal / 9);
  const proteinKcal = protein * 4;
  const carbs = Math.max(0, Math.round((calories - fatKcal - proteinKcal) / 4));
  return { calories, protein, fat, carbs, tdee: Math.round(tdee), bmr: Math.round(bmr) };
}

export function recalcMacros({ calories, protein }) {
  const kcal = +calories || 0;
  const prot = +protein || 0;
  const fatKcal = kcal * 0.25;
  const fat = Math.round(fatKcal / 9);
  const carbs = Math.max(0, Math.round((kcal - fatKcal - prot * 4) / 4));
  return { fat, carbs };
}
