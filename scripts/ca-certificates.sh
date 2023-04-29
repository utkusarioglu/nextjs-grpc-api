#!/bin/bash

source .env.local

api_certs_abspath="$CERTS_PATH/$MS_GRPC_CLIENT_CERT_FOR_API_SUBPATH"

export NODE_EXTRA_CA_CERTS="$api_certs_abspath/ca.crt"
