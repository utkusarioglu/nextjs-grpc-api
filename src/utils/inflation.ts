import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { PeerCertificate } from "tls";

const PROTO_PATH =
  "/utkusarioglu-com/projects/nextjs-grpc/proto/src/inflation/decade-stats.proto";
const MS = `${process.env.MS_HOST}:${process.env.MS_PORT}`;

interface InflationUtilConstructorParams {
  caCrt: Buffer;
  tlsCrt: Buffer;
  tlsKey: Buffer;
}

export class InflationUtil {
  caCrt!: Buffer;
  tlsCrt!: Buffer;
  tlsKey!: Buffer;

  constructor({ caCrt, tlsCrt, tlsKey }: InflationUtilConstructorParams) {
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

  credentials = grpc.credentials.createSsl(
    this.caCrt,
    this.tlsKey,
    this.tlsCrt,
    {
      checkServerIdentity: (_hostname: string, _cert: PeerCertificate) => {
        return undefined;
      },
    }
  );
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
