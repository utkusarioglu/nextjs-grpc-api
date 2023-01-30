require("dotenv").config();
import process from "process";
import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import { Metadata, credentials } from "@grpc/grpc-js";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { MeterProvider } from "@opentelemetry/sdk-metrics-base";
import { HostMetrics } from "@opentelemetry/host-metrics";
import { PrometheusExporter } from "@opentelemetry/exporter-prometheus";
import { startServer } from "./server";

const {
  COLLECT_METRICS,
  COLLECT_TRACES,
  NODE_ENV,
  OTEL_TRACE_HOST,
  OTEL_TRACE_PORT,
  PROMETHEUS_PORT,
  HOSTNAME,
} = process.env;

function isEnvEnabled(envVar: string | undefined): boolean {
  const disabledPhrases = ["FALSE", "0", "DISABLED"];
  return !envVar ? true : !disabledPhrases.includes(envVar.toUpperCase());
}

const collectMetrics = isEnvEnabled(COLLECT_METRICS);
const collectTraces = isEnvEnabled(COLLECT_TRACES);

const instrumentations = [
  getNodeAutoInstrumentations({
    // Each of the auto-instrumentations
    // can have config set here or you can
    // npm install each individually and not use the auto-instruments
    "@opentelemetry/instrumentation-http": {
      ignoreIncomingPaths: [
        // Pattern match to filter endpoints
        // that you really want to stop altogether
        "/ping",

        // You can filter conditionally
        // Next.js gets a little too chatty
        // if you trace all the incoming requests
        ...(NODE_ENV !== "production" ? [/^\/_next\/static.*/] : []),
      ],

      // This gives your request spans a more meaningful name
      // than `HTTP GET`
      requestHook: (span, request) => {
        let detail = "-";
        if ("url" in request) {
          detail = request.url || "- (url)";
        } else if ("path" in request) {
          detail = request.path || "- (path)";
        }
        span.setAttributes({
          name: `${request.method} ${detail}`,
        });
      },

      // Re-assign the root span's attributes
      startIncomingSpanHook: (request) => {
        return {
          name: `${request.method} ${request.url}`,
          "request.path": request.url,
          // "uber-trace-id": request["uber-trace-id"],
        };
      },
    },
  }),
];

const prometheusPort = +(PROMETHEUS_PORT || 9464);
const serviceName = "nextjs-grpc-api";
const serviceNamespace = "api";
const metadata = new Metadata();
const traceUrl = `http://${OTEL_TRACE_HOST}:${OTEL_TRACE_PORT}`;
console.log(`Trace url: ${traceUrl}`);
// metadata.set("x-honeycomb-team", "<YOUR HONEYCOMB API KEY>");
// metadata.set("x-honeycomb-dataset", "<NAME OF YOUR TARGET HONEYCOMB DATA SET>");
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const traceExporter = new OTLPTraceExporter({
  url: traceUrl,
  credentials: credentials.createInsecure(),
  metadata,
});

const prometheusExporter = new PrometheusExporter(
  { port: prometheusPort },
  () => console.log(`metrics @ ${HOSTNAME}:${prometheusPort}/metrics`)
);
const meterProvider = new MeterProvider({
  // exporter: metricExporter,
  // interval: 1000,
});

// this is probably temporary, without this prometheus metrics don't work
// and this command is not given in any of the documentation.
// @ts-ignore
// meterProvider.addMetricReader(prometheusExporter);
// @ts-ignore
const hostMetrics = new HostMetrics({ meterProvider, name: serviceName });
hostMetrics.start();

// configure the SDK to export telemetry data to the console
// enable all auto-instrumentations from the meta package
const sdk = new NodeSDK({
  // @ts-ignore
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    [SemanticResourceAttributes.SERVICE_NAMESPACE]: serviceNamespace,
  }),
  metricReader: collectMetrics ? prometheusExporter : undefined,
  traceExporter: collectTraces ? traceExporter : undefined,
  instrumentations,
});

sdk
  .start()
  .then(() => {
    const meter = meterProvider.getMeter(serviceName);
    const counter = meter.createCounter("api_counter_random", {
      description: "some test value",
    });
    setInterval(() => {
      counter.add(Math.floor(Math.random() * 10));
    }, 2000);
    console.log(`Tracing initialized with the target url: ${traceUrl}`);
  })
  .then(() => startServer())
  .catch((error) =>
    console.log("Error initializing tracing and starting server", error)
  );

process.on("SIGTERM", () => {
  sdk
    .shutdown()
    .then(() => console.log("Tracing terminated"))
    .catch((error) => console.log("Error terminating tracing", error))
    .finally(() => process.exit(0));
});
