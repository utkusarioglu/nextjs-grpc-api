require("dotenv").config();
import { NodeSDK } from "@opentelemetry/sdk-node";
import { Metadata, credentials } from "@grpc/grpc-js";
import { PrometheusExporter } from "@opentelemetry/exporter-prometheus";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { MeterProvider } from "@opentelemetry/sdk-metrics";
import { isEnvEnabled } from "_utils/env.utils";
import { HostMetrics } from "@opentelemetry/host-metrics";
// import { PrometheusExporter } from "@opentelemetry/exporter-prometheus";
// import { isEnvEnabled } from "./utils/env.utils";

// export function startInstrumentation() {
const COLLECT_METRICS = process.env.COLLECT_METRICS;
const COLLECT_TRACES = process.env.COLLECT_TRACES;
const NODE_ENV = process.env.NODE_ENV;
const OTEL_TRACE_HOST = process.env.OTEL_TRACE_HOST;
const OTEL_TRACE_PORT = process.env.OTEL_TRACE_PORT;
const PROMETHEUS_PORT = process.env.PROMETHEUS_PORT;
const HOSTNAME = process.env.HOSTNAME;

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
// // metadata.set("x-honeycomb-team", "<YOUR HONEYCOMB API KEY>");
// // metadata.set("x-honeycomb-dataset", "<NAME OF YOUR TARGET HONEYCOMB DATA SET>");
// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const traceExporter = new OTLPTraceExporter({
  url: traceUrl,
  credentials: credentials.createInsecure(),
  metadata,
});

const metricReader = new PrometheusExporter({ port: prometheusPort }, () => {
  console.log(`metrics @ ${HOSTNAME}:${prometheusPort}/metrics`);
});

const meterProvider = new MeterProvider();
// meterProvider.addMetricReader(metricReader);
const hostMetrics = new HostMetrics({ meterProvider, name: serviceName });
hostMetrics.start();
// metricReader.setMetricProducer(hostMetrics)
// const meter = meterProvider.getMeter(serviceName);
// const counter = meter.createCounter("api_counter_random", {
//   description: "some test value",
// });
// setInterval(() => {
//   counter.add(Math.floor(Math.random() * 10));
// }, 2000);

// meterProvider.addMetricReader(metricReader);

// const metricReader = new PrometheusExporter({ port: prometheusPort }, () =>
//   console.log(`metrics @ ${HOSTNAME}:${prometheusPort}/metrics`)
// );
// metricReader.startServer();
// metricReader.setMetricProducer()
// const meterProvider = new MeterProvider({
// exporter: metricExporter,
// interval: 1000,
// });

// this is probably temporary, without this prometheus metrics don't work
// and this command is not given in any of the documentation.
// @ts-ignore
// meterProvider.addMetricReader(prometheusExporter);
// @ts-ignore

// const metricReader = new PrometheusExporter();
// metricReader.startServer();

const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
  [SemanticResourceAttributes.SERVICE_NAMESPACE]: serviceNamespace,
});

const sdk = new NodeSDK({
  resource,
  metricReader,
  traceExporter,
  // metricReader: collectMetrics ? metricReader : undefined,
  // traceExporter: collectMetrics ? traceExporter : undefined,
  instrumentations,
});

sdk.start();

// You can also use the shutdown method to gracefully shut down the SDK before process shutdown
// or on some operating system signal.
// const process = require("process");
process.on("SIGTERM", () => {
  sdk
    .shutdown()
    .then(
      () => console.log("SDK shut down successfully"),
      (err) => console.log("Error shutting down SDK", err)
    )
    .finally(() => process.exit(0));
});
// }
