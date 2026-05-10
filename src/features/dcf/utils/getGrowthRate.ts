export const getGrowthRate = (cashFlows: number[]) => {
  const growths = cashFlows
    .map((cashFlow, index) => {
      if (index === 0) {
        return;
      }
      return Number(
        (
          ((cashFlow - cashFlows[index - 1]) / cashFlows[index - 1]) *
          100
        ).toFixed(2),
      );
    })
    .filter(Boolean) as number[];

  const averageGrowthRate = (
    Number(growths.reduce((sum, growth) => sum + growth, 0)) / growths.length
  ).toFixed(2);

  return { growths, averageGrowthRate };
};
