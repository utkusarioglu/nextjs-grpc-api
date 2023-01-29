#!/bin/bash

current_dir=${0%/*}
helm_chart_path=$current_dir/../.helm
dockerfile_path=$current_dir/../.docker/Dockerfile.dev
version=$(cat $helm_chart_path/Chart.yaml | yq '.appVersion')
image_name=$(cat $helm_chart_path/values.yaml | yq '.image.repository')
image_reference="$image_name:$version"

echo "Building $image_name:$version…"

docker build \
  -t $image_reference \
  -f $dockerfile_path \
  .

if [ "$1" == "--push" ]; then
  docker push $image_reference
fi
