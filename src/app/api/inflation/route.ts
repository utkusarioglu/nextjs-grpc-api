import { type NextRequest } from "next/server";
import { InflationService } from "_services/inflation";
import { readFileSync } from "fs";
import path from "path";

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const codes = searchParams.get("codes")?.split(",");
  if (!codes || !codes.length) {
    throw new Error("NO_CODES_GIVEN");
  }
  console.log({ searchParams });
  console.log({ codes });
  const readCertPath = (filename: string): Buffer => {
    const certsPath = process.env.CERTS_PATH!;
    const msGrpcClientCertForApi =
      process.env.MS_GRPC_CLIENT_CERT_FOR_API_SUBPATH!;
    return readFileSync(
      path.resolve(certsPath, msGrpcClientCertForApi, filename)
    );
  };
  const props = {
    caCrt: readCertPath("ca.crt"),
    tlsCrt: readCertPath("tls.crt"),
    tlsKey: readCertPath("tls.key"),
  };
  const inflationService = new InflationService(props);
  const response = await inflationService.decadeStats(codes);

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "Set-Cookie": `token=random` },
  });
};
