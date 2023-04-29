#!/bin/bash

source scripts/ca-certificates.sh

echo $NODE_EXTRA_CA_CERTS

NODE_ENV=production yarn next start
