export const getCounts = async (Model: any, path?: string) => {
  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  
  let currentCount = 0;
  let previousCount = 0;

  if (path) {
    const docs = await Model.find(
      {
        $or: [
          { [`${path}.createdAt`]: { $gte: startOfThisMonth } },
          {
            [`${path}.createdAt`]: {
              $gte: startOfLastMonth,
              $lte: endOfLastMonth,
            },
          },
        ],
      },
      { [path]: 1 }
    );

    docs.forEach((doc: { [x: string]: any[]; }) => {
      doc[path].forEach((item: any) => {
        if (item.createdAt >= startOfThisMonth) currentCount++;
        if (item.createdAt >= startOfLastMonth && item.createdAt <= endOfLastMonth) previousCount++;
      });
    });
  } else {
    currentCount = await Model.countDocuments({ createdAt: { $gte: startOfThisMonth } });
    previousCount = await Model.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });
  }

  let percentageChange = 0;
  if (previousCount > 0) {
    percentageChange = ((currentCount - previousCount) / previousCount) * 100;
  } else if (previousCount === 0 && currentCount > 0) {
    percentageChange = 100;
  }

  return {
    numbersAtMonth: currentCount,
    percentageChange: percentageChange.toFixed(2) + "%",
  };
};