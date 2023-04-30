#!/bin/bash

source .env.local

api_certs_abspath="$CERTIFICATES_ABSPATH/$MS_GRPC_CLIENT_CERT_FOR_API_RELPATH"

export NODE_EXTRA_CA_CERTS="$api_certs_abspath/ca.crt"
