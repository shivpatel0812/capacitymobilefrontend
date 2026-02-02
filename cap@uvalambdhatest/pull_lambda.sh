#!/bin/bash

# Pull code from AWS Lambda function
# Usage: ./pull_lambda.sh <function-name> [region]

FUNCTION_NAME=$1
REGION=${2:-us-east-1}  # Default to us-east-1 if not specified

if [ -z "$FUNCTION_NAME" ]; then
    echo "Usage: $0 <function-name> [region]"
    exit 1
fi

echo "Pulling code from Lambda function: $FUNCTION_NAME in region: $REGION"

# Create directory for the function
mkdir -p "$FUNCTION_NAME"

# Download the function code
aws lambda get-function \
    --function-name "$FUNCTION_NAME" \
    --region "$REGION" \
    --query 'Code.Location' \
    --output text | xargs curl -o "$FUNCTION_NAME/function.zip"

# Extract the zip file
unzip -q "$FUNCTION_NAME/function.zip" -d "$FUNCTION_NAME"

# Remove the zip file
rm "$FUNCTION_NAME/function.zip"

echo "Code extracted to: $FUNCTION_NAME/"


