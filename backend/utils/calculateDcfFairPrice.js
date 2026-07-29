const calculateDcfFairPrice = (
  cashEquivalents,
  totalDebt,
  sharesOutstanding,
  futureFcfs,
) => {
  const sumOfFFCF = Number(
    futureFcfs.pvOfFFCF.reduce((sum, pv) => sum + pv, 0).toFixed(),
  );

  const equityValue = sumOfFFCF + cashEquivalents - totalDebt;

  const fairPrice = Number((equityValue / sharesOutstanding).toFixed(2));

  return fairPrice;
};

module.exports = calculateDcfFairPrice;
