const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const PROTO_PATH = "__proto/inflation/decade-stats.proto";
const { readFileSync } = require("fs");

const MS = `${process.env.MS_HOST}:${process.env.MS_PORT}`;

function readCertPath(filename: string): string {
  return readFileSync(
    path.resolve(
      process.env.CERTS_PATH,
      process.env.MS_GRPC_CLIENT_CERT_FOR_API_SUBPATH,
      filename
    )
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
    checkServerIdentity: (hostname: string, cert: string) => {
      console.log(
        [
          "checkServerIdentity",
          "server hostname: ",
          hostname,
          "server cert:",
          cert,
          "ca:",
          caCrt,
          "client key: ",
          tlsKey,
          "client crt:",
          tlsCrt,
        ].join("\n")
      );
    },
  });
  inflationDefinition = grpc.loadPackageDefinition(this.inflationProtoDef).ms
    .nextjs_grpc.Inflation;

  service = new this.inflationDefinition(MS, this.credentials);

  async decadeStats() {
    console.log(
      "MS_GRPC_CLIENT_CERT_FOR_API_SUBPATH: ",
      process.env.CERTS_PATH,
      process.env.MS_GRPC_CLIENT_CERT_FOR_API_SUBPATH
    );
    return new Promise((resolve, reject) => {
      console.log(`Using ms at: ${MS}`);
      this.service.decadeStats(null, (error: string, response: string) => {
        if (error) {
          console.log(error);
          reject(error);
          return;
        }
        resolve(response);
      });
    });
  }
}
