import opentelemetry from "@opentelemetry/api";

export function getTracer() {
  return opentelemetry.trace.getTracer("nextjs-grpc-api");
}

export function startSpan(spanName: string) {
  return getTracer().startSpan(spanName);
}
