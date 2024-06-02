export const convertWeight = (weight: number, unit: string): number => {
  const conversionRate = 2.20462;
  return unit === "kg" ? weight / conversionRate : weight * conversionRate;
};
