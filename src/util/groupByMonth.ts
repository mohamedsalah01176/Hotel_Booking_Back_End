export function groupByMonth<T extends { createdAt: Date }>(items: T[],path:string) {
  const monthlyData: { [key: string]: number } = {};

  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("en-US", { month: "long" })
  );
  months.forEach((m) => {
    monthlyData[m] = 0;
  });

  for (let i = 0; i < items.length; i++) {
    if(path === "reserveDates"){
      const nested = (items[i] as any)[path];
      nested.forEach((doc: { createdAt: string | number | Date; }) => {
        const date = new Date(doc.createdAt);
        const monthName = date.toLocaleString("en-US", { month: "long" });
        monthlyData[monthName]++;
        if (!monthlyData[monthName]) {
          monthlyData[monthName] = 0;
        }
      });
    }else{
      const date = new Date(items[i].createdAt);
      const monthName = date.toLocaleString("en-US", { month: "long" });
      if (!monthlyData[monthName]) {
        monthlyData[monthName] = 0;
      }
      monthlyData[monthName]++;
    }
  }

  return monthlyData;
}
