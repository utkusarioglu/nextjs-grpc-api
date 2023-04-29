import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { PeerCertificate } from "tls";

// enabling secure grpc on this end breaks data transmission.
// when server enables it, it's all fine, but if the client enables it,
// connection is never established.
// TODO get rid of this
const insecureGrpc = ["1", "TRUE", "YES"].includes(
  (!!process.env["GRPC_CLIENT_INSECURE_CONNECTION"]
    ? process.env["GRPC_CLIENT_INSECURE_CONNECTION"]
    : "false"
  ).toUpperCase()
);

const PROTO_PATH =
  "/utkusarioglu-com/projects/nextjs-grpc/proto/src/inflation/decade-stats.proto";
const serviceUrl = `${process.env.MS_HOST}:${process.env.MS_PORT}`;

interface InflationServiceConstructorParams {
  caCrt: Buffer;
  tlsCrt: Buffer;
  tlsKey: Buffer;
}

export class InflationService {
  caCrt: Buffer;
  tlsCrt: Buffer;
  tlsKey: Buffer;
  credentials: grpc.ChannelCredentials;
  // TODO any type
  inflationDefinition: any;
  // TODO any type
  service: any;
  inflationProtoDef: protoLoader.PackageDefinition;

  constructor({ caCrt, tlsCrt, tlsKey }: InflationServiceConstructorParams) {
    this.caCrt = caCrt;
    this.tlsCrt = tlsCrt;
    this.tlsKey = tlsKey;
    this.credentials = insecureGrpc
      ? grpc.credentials.createInsecure()
      : grpc.credentials.createSsl(this.caCrt, this.tlsKey, this.tlsCrt, {
          // checkServerIdentity: (hostname: string, cert: PeerCertificate) => {
          //   console.log({
          //     hostname,
          //     insecureGrpc,
          //     cert,
          //   });
          //   return undefined;
          // },
        });
    this.inflationProtoDef = protoLoader.loadSync(PROTO_PATH, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });
    this.inflationDefinition = grpc.loadPackageDefinition(
      this.inflationProtoDef
      // @ts-ignore
    ).ms.nextjs_grpc.Inflation;
    this.service = new this.inflationDefinition(serviceUrl, this.credentials);
  }

  async decadeStats(codes: string[]) {
    console.log({ func: "decadeStats", codes });
    // TODO you need a type here
    return new Promise<any[]>((resolve, reject) => {
      try {
        const rows: any[] = [];
        const call = this.service.decadeStats({ codes });
        // TODO you need a way for types to be created from protos
        // @ts-expect-error
        call.on("data", (row) => {
          rows.push(row);
        });
        call.on("end", () => {
          resolve(rows);
        });
        // TODO typing
        // @ts-expect-error
        call.on("error", (error) => {
          console.log({ error });
          reject("GRPC_ERROR");
        });
      } catch (error) {
        console.log({ error });
        reject("Something broken");
      }
    });
  }
}
