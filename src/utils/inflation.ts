import path from "path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { readFileSync } from "fs";
import { PeerCertificate } from "tls";

const PROTO_PATH =
  "/utkusarioglu-com/projects/nextjs-grpc/proto/src/inflation/decade-stats.proto";
const MS = `${process.env.MS_HOST}:${process.env.MS_PORT}`;

function readCertPath(filename: string): Buffer {
  const certsPath = process.env.CERTS_PATH!;
  const msGrpcClientCertForApi =
    process.env.MS_GRPC_CLIENT_CERT_FOR_API_SUBPATH!;
  return readFileSync(
    path.resolve(certsPath, msGrpcClientCertForApi, filename)
  );
}

const caCrt = readCertPath("ca.crt");
const tlsCrt = readCertPath("tls.crt");
const tlsKey = readCertPath("tls.key");

export class InflationUtil {
  inflationProtoDef = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  credentials = grpc.credentials.createSsl(caCrt, tlsKey, tlsCrt, {
    checkServerIdentity: (hostname: string, cert: PeerCertificate) => {
      //   console.log(
      //     [
      //       "checkServerIdentity",
      //       "server hostname: ",
      //       hostname,
      //       "server cert:",
      //       cert,
      //       "ca:",
      //       caCrt,
      //       "client key: ",
      //       tlsKey,
      //       "client crt:",
      //       tlsCrt,
      //     ].join("\n")
      //   );
      return undefined;
      // return () => true;
    },
  });
  inflationDefinition = // @ts-ignore
    grpc.loadPackageDefinition(this.inflationProtoDef).ms.nextjs_grpc.Inflation;

  service = new this.inflationDefinition(MS, this.credentials);

  async decadeStats() {
    console.log("decade stats called");
    // TODO you need a type here
    return new Promise<any[]>((resolve, reject) => {
      console.log(`Using ms at: ${MS}`);
      const rows: any[] = [];
      const call = this.service.decadeStats();
      // TODO you need a way for types to be created from protos
      // @ts-ignore
      call.on("data", (row) => {
        console.log({ row });
        rows.push(row);
      });
      call.on("end", () => {
        resolve(rows);
      });
      call.on("error", () => {
        reject();
      });
    });
  }
}
