import "server-only";
import { type FC } from "react";
import { InflationUtil } from "_utils/inflation";
import InflationTableView from "_views/InflationTable.view";

async function getData() {
  console.log("getServerSideProps");
  const inflationUtil = new InflationUtil();
  const decadeStats = await inflationUtil.decadeStats();
  console.log({ decadeStats });
  return decadeStats;
}

interface InflationPageProps {}

// FIX the types here
// @ts-ignore
const InflationPage: FC<InflationPageProps> = async () => {
  const decadeStats = await getData();
  return <InflationTableView decadeStats={decadeStats} />;
};

export default InflationPage;
