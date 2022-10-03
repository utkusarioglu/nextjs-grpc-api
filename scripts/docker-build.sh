#!/bin/bash

docker build \
  -t utkusarioglu/api-nextjsgrpc-projects-utkusarioglu-com:tf \
  -f api/.docker/Dockerfile.ci \
  .
