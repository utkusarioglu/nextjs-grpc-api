"use client";
import "client-only";
import { type FC } from "react";
// import { InflationUtil } from "_utils/inflation";
import InflationTableView from "_views/InflationTable.view";
import useSWR from "swr";
// import { readFileSync } from "fs";
// import path from "path";

// export function getServerProps() {
//   console.log("getServerSideProps", "-".repeat(100));
//   const readCertPath = (filename: string): Buffer => {
//     const certsPath = process.env.CERTS_PATH!;
//     const msGrpcClientCertForApi =
//       process.env.MS_GRPC_CLIENT_CERT_FOR_API_SUBPATH!;
//     return readFileSync(
//       path.resolve(certsPath, msGrpcClientCertForApi, filename)
//     );
//   };
//   return {
//     props: {
//       caCrt: readCertPath("ca.crt"),
//       tlsCrt: readCertPath("tls.crt"),
//       tlsKey: readCertPath("tls.key"),
//     },
//   };
// }

// async function getData(props: ConstructorParameters<typeof InflationUtil>[0]) {
//   console.log("getServerSideProps");
//   const inflationUtil = new InflationUtil(props);
//   const decadeStats = await inflationUtil.decadeStats();
//   console.log({ decadeStats });
//   return decadeStats;
// }

interface InflationPageProps {}

const fetcher = (
  ...args: [input: RequestInfo | URL, init?: RequestInit | undefined]
) => fetch(...args).then((res) => res.json());

function useInflationDecadeStats() {
  return useSWR<any[]>("/api/inflation?codes=TUR,USA,FRA", fetcher, {
    fallback: [],
  });
}

// FIX the types here
// @ts-ignore
const InflationPage: FC<InflationPageProps> = () => {
  const { data, error, isLoading } = useInflationDecadeStats();
  if (error) {
    console.log({ error });
    return <span>error</span>;
  }
  if (isLoading) {
    return <span>Loading...</span>;
  }
  return <InflationTableView decadeStats={data!} />;
};

export default InflationPage;
