#!/bin/bash

set -m

PROD_SCRIPT_NAME="start"
DEV_SCRIPT_NAME="dev"

get_package_json_script_def() {
  script_name=$1
  if [ -z "$script_name" ]; then
    echo "Error: First param needs to be the script name"
    exit 1
  fi
  node -e 'const p = require("./package.json"); console.log(p.scripts.'$script_name')'
}

get_pid_from_script_def() {
  script_def=$1
  # if [ -z "$script_name" ]; then
  #   echo "Error: First param needs to be the script definition"
  #   exit 2
  # fi
  echo $(ps aux | grep "${script_def}" | awk '{print $2}')
}

start_app() {
  if [ "$RUN_MODE" == "development" ]; then
    prod_pid=$(get_pid_from_script_def "$prod_script_def")
    echo "prod pid $prod_pid"
    if [ ! -z "$prod_pid" ]; then
      echo "Killing production instance…"
      for pid in $prod_pid; do
        kill -1 "$pid";
      done
    fi
    echo "Starting in development mode…"
    yarn $DEV_SCRIPT_NAME
  else
    dev_pid=$(get_pid_from_script_def "$dev_script_def")
    echo "dev pid $prod_pid"
    if [ ! -z "$dev_pid" ]; then
      echo "Killing development instance…"
      for pid in $dev_pid; do
        kill -1 "$pid";
      done
    fi
    echo "Starting in production mode…"
    yarn $PROD_SCRIPT_NAME
  fi
}

dev_script_def="/usr/local/bin/node ./node_modules/.bin/next dev"
prod_script_def="/usr/local/bin/node ./node_modules/.bin/next start"

start_app 
