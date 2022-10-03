require("dotenv").config();
const process = require("process");
const { diag, DiagConsoleLogger, DiagLogLevel } = require("@opentelemetry/api");
const { Metadata, credentials } = require("@grpc/grpc-js");
const opentelemetry = require("@opentelemetry/sdk-node");
const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");
const { Resource } = require("@opentelemetry/resources");
const {
  SemanticResourceAttributes,
} = require("@opentelemetry/semantic-conventions");
const {
  OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-grpc");
const { MeterProvider } = require("@opentelemetry/sdk-metrics-base");
const { HostMetrics } = require("@opentelemetry/host-metrics");
const { PrometheusExporter } = require("@opentelemetry/exporter-prometheus");

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
        ...(process.env.NODE_ENV !== "production"
          ? [/^\/_next\/static.*/]
          : []),
      ],

      // This gives your request spans a more meaningful name
      // than `HTTP GET`
      requestHook: (span, request) => {
        span.setAttributes({
          name: `${request.method} ${request.url || request.path}`,
        });
      },

      // Re-assign the root span's attributes
      startIncomingSpanHook: (request) => {
        console.log("request.headers:\n", request.headers);
        return {
          name: `${request.method} ${request.url || request.path}`,
          "request.path": request.url || request.path,
          "uber-trace-id": request["uber-trace-id"],
        };
      },
    },
  }),
];

const prometheusPort = 9464;
const serviceName = "nextjs-grpc-api";
const serviceNamespace = "api";
const metadata = new Metadata();
const traceUrl = `grpc://${process.env.OTEL_TRACE_HOST}:${process.env.OTEL_TRACE_PORT}`;
console.log(`Trace url: ${traceUrl}`);
// metadata.set("x-honeycomb-team", "<YOUR HONEYCOMB API KEY>");
// metadata.set("x-honeycomb-dataset", "<NAME OF YOUR TARGET HONEYCOMB DATA SET>");
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const traceExporter = new OTLPTraceExporter({
  url: traceUrl,
  credentials: credentials.createInsecure(),
  metadata,
});

const metricExporter = new PrometheusExporter(
  { port: prometheusPort, startServer: true },
  () =>
    console.log(`metrics @ ${process.env.HOSTNAME}:${prometheusPort}/metrics`)
);
const meterProvider = new MeterProvider({
  exporter: metricExporter,
  interval: 1000,
});
// this is probably temporary, without this prometheus metrics don't work
// and this command is not given in any of the documentation.
meterProvider.addMetricReader(metricExporter);

const hostMetrics = new HostMetrics({ meterProvider, name: serviceName });
hostMetrics.start();

// configure the SDK to export telemetry data to the console
// enable all auto-instrumentations from the meta package
const sdk = new opentelemetry.NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    [SemanticResourceAttributes.SERVICE_NAMESPACE]: serviceNamespace,
  }),
  metricExporter,
  traceExporter,
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
    }, 2000)
    console.log(`Tracing initialized with the target url: ${traceUrl}`);
  })
  // .then(() => startServer())
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
