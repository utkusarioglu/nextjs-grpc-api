const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const PROTO_PATH = "../proto/greeting.proto";
const { readFileSync } = require("fs");

const MS = `${process.env.MS_HOST}:${process.env.MS_PORT}`;

class GreetingUtil {
  greetingProtoDef = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  ca = readFileSync(
    path.resolve(
      process.env.CERTS_PATH,
      process.env.MS_GRPC_CLIENT_CERT_FOR_API_SUBPATH,
      "ca.crt"
    )
  );
  crt = readFileSync(
    path.resolve(
      process.env.CERTS_PATH,
      process.env.MS_GRPC_CLIENT_CERT_FOR_API_SUBPATH,
      "tls.crt"
    )
  );
  key = readFileSync(
    path.resolve(
      process.env.CERTS_PATH,
      process.env.MS_GRPC_CLIENT_CERT_FOR_API_SUBPATH,
      "tls.key"
    )
  );
  credentials = grpc.credentials.createSsl(this.ca, this.key, this.crt, {
    checkServerIdentity: (hostname, cert) => {
      console.log(
        "checkServerIdentity",
        "\nserver hostname: ",
        hostname,
        "\nserver cert:\n",
        cert,
        "\nca:\n ",
        this.ca,
        "\nclient key:\n ",
        this.key,
        "\nclient crt:\n ",
        this.crt
      );
    },
  });
  // credentials = grpc.credentials.createSsl(this.ca);
  Greeter = grpc.loadPackageDefinition(this.greetingProtoDef).ms.nextjs_grpc
    .Greeter;

  service = new this.Greeter(
    MS,
    this.credentials
    // grpc.credentials.createInsecure()
  );

  async sendGreeting(greeting) {
    console.log(
      "MS_GRPC_CLIENT_CERT_FOR_API_SUBPATH: ",
      process.env.CERTS_PATH,
      process.env.MS_GRPC_CLIENT_CERT_FOR_API_SUBPATH
    );
    return new Promise((resolve, reject) => {
      console.log(`Using ms at: ${MS}`);
      this.service.sendGreeting(greeting, (error, response) => {
        if (error) {
          console.log(error);
          reject(error);
          return;
        }
        resolve(response.greeting);
      });
    });
  }
}

module.exports = { GreetingUtil };
