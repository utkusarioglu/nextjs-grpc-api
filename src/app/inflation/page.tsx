import "server-only";
import { type FC } from "react";
import { InflationUtil } from "_utils/inflation";
import InflationTableView from "_views/InflationTable.view";
import { readFileSync } from "fs";
import path from "path";

export function getServerSideProps() {
  console.log("getServerSideProps", "-".repeat(100));
  const readCertPath = (filename: string): Buffer => {
    const certsPath = process.env.CERTS_PATH!;
    const msGrpcClientCertForApi =
      process.env.MS_GRPC_CLIENT_CERT_FOR_API_SUBPATH!;
    return readFileSync(
      path.resolve(certsPath, msGrpcClientCertForApi, filename)
    );
  };
  return {
    props: {
      caCrt: readCertPath("ca.crt"),
      tlsCrt: readCertPath("tls.crt"),
      tlsKey: readCertPath("tls.key"),
    },
  };
}

async function getData(props: ConstructorParameters<typeof InflationUtil>[0]) {
  console.log("getServerSideProps");
  const inflationUtil = new InflationUtil(props);
  const decadeStats = await inflationUtil.decadeStats();
  console.log({ decadeStats });
  return decadeStats;
}

interface InflationPageProps {}

// FIX the types here
// @ts-ignore
const InflationPage: FC<InflationPageProps> = async (certProps) => {
  // @ts-ignore
  const decadeStats = await getData(certProps);
  return <InflationTableView decadeStats={decadeStats} />;
};

export default InflationPage;
