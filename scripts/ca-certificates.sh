#!/bin/bash

source .env.local

api_certs_abspath="$CERTS_PATH/$API_SERVER_CERT_SUBPATH"

export NODE_EXTRA_CA_CERTS="$api_certs_abspath/ca.crt"
