import * as openTelemetry from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { Resource } from "@opentelemetry/resources";
// import { WinstonInstrumentation } from "@opentelemetry/instrumentation-winston";
import { PrometheusExporter } from "@opentelemetry/exporter-prometheus";

export const metricExporter = new PrometheusExporter({}, () =>
  console.log("metrics @ <url>:9464/metrics")
);

const traceExporter = new OTLPTraceExporter({
  url: "http://opentelemetry-collector.api:4318/v1/traces",
});
console.log(openTelemetry);
const sdk = new openTelemetry.NodeSDK({
  // @ts-ignore
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "api",
  }),
  metricExporter,
  traceExporter,
  // @ts-ignore
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

process.on("SIGTERM", () => {
  sdk
    .shutdown()
    .then(
      () => console.log("SDK shut down successfully"),
      (err) => console.log("Error shutting down SDK", err)
    )
    .finally(() => process.exit(0));
});
