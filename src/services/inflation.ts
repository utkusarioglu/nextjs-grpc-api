import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { PeerCertificate } from "tls";

// TODO get rid of this
// const INSECURE = process.env.NODE_ENV === "development";
const insecureGrpc = ["1", "TRUE", "YES"].includes(
  (process.env["INSECURE_GRPC"] || "false").toUpperCase()
);

if (insecureGrpc) {
  console.log({ msg: "starting insecure grpc", insecureGrpc });
}

const PROTO_PATH =
  "/utkusarioglu-com/projects/nextjs-grpc/proto/src/inflation/decade-stats.proto";
const serviceUrl = `${process.env.MS_HOST}:${process.env.MS_PORT}`;

interface InflationServiceConstructorParams {
  caCrt: Buffer;
  tlsCrt: Buffer;
  tlsKey: Buffer;
}

export class InflationService {
  caCrt!: Buffer;
  tlsCrt!: Buffer;
  tlsKey!: Buffer;

  constructor({ caCrt, tlsCrt, tlsKey }: InflationServiceConstructorParams) {
    this.caCrt = caCrt;
    this.tlsCrt = tlsCrt;
    this.tlsKey = tlsKey;
  }

  inflationProtoDef = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  credentials = insecureGrpc
    ? grpc.credentials.createInsecure()
    : grpc.credentials.createSsl(this.caCrt, this.tlsKey, this.tlsCrt, {
        checkServerIdentity: (hostname: string, cert: PeerCertificate) => {
          console.log({
            hostname,
            cert,
            INSECURE: insecureGrpc,
            caCrt: this.caCrt,
            tlsCrt: this.tlsCrt,
          });
          return undefined;
        },
      });
  // @ts-ignore
  inflationDefinition = grpc.loadPackageDefinition(this.inflationProtoDef).ms.nextjs_grpc.Inflation;

  service = new this.inflationDefinition(serviceUrl, this.credentials);

  async decadeStats(codes: string[]) {
    console.log({func: "decadeStats", codes})
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
