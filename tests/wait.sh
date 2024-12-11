#!/bin/bash

# Default values for timeout and attempts
default_timeout=5
default_attempts=10

# Validate the input arguments
if [ "$#" -lt 1 ]; then
    echo "Usage: $0 <endpoint> [--timeout <seconds>] [--attempts <number>]"
    exit 1
fi

# Parse the arguments
api_host=$1
shift

timeout=$default_timeout
attempts=$default_attempts

while [[ $# -gt 0 ]]; do
    case $1 in
        --timeout)
            if [[ -n $2 && $2 =~ ^[0-9]+$ ]]; then
                timeout=$2
                shift
            else
                echo "Error: --timeout requires a valid number"
                exit 1
            fi
            ;;
        --attempts)
            if [[ -n $2 && $2 =~ ^[0-9]+$ ]]; then
                attempts=$2
                shift
            else
                echo "Error: --attempts requires a valid number"
                exit 1
            fi
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
    shift



done

# Initialize variables
attempt_counter=0

while [ "$(curl -k -s -o /dev/null -w "%{http_code}" $api_host)" != "200" ]; do
    if [ $attempt_counter -ge $attempts ]; then
        echo "Max attempts ($attempts) reached. Exiting with error."
        exit 1
    fi

    echo "$api_host not reachable. Retrying in $timeout seconds..."
    attempt_counter=$((attempt_counter+1))
    sleep $timeout
done

echo "$api_host is reachable."
