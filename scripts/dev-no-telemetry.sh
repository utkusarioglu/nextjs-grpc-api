#!/bin/bash

source scripts/ca-certificates.sh

echo $NODE_EXTRA_CA_CERTS

ENABLE_INSTRUMENTATION=FALSE yarn next dev
