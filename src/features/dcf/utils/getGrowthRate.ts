export const getGrowthRate = (cashFlows: number[]) => {
  const growths = cashFlows
    .map((cashFlow, index) => {
      if (index === 0) {
        return undefined;
      }

      const prev = cashFlows[index - 1];
      if (prev === 0) {
        return 0
      };

      return Number((((cashFlow - prev) / prev) * 100).toFixed(2));
    })
    .filter((growth): growth is number => growth !== undefined);

  const totalGrowth = growths.reduce((sum, growth) => sum + growth, 0)
  const averageGrowthRate = (totalGrowth / growths.length).toFixed(2);

  return { growths, averageGrowthRate };
};
