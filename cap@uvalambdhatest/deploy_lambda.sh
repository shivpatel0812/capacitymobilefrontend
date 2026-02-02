#!/bin/bash

# Deploy code to AWS Lambda function
# Usage: ./deploy_lambda.sh <function-name> [region] [zip-file-or-directory]

FUNCTION_NAME=$1
REGION=${2:-us-east-1}
SOURCE=${3:-.}  # Default to current directory

if [ -z "$FUNCTION_NAME" ]; then
    echo "Usage: $0 <function-name> [region] [zip-file-or-directory]"
    exit 1
fi

echo "Deploying to Lambda function: $FUNCTION_NAME in region: $REGION"

# If source is a directory, create a zip file
if [ -d "$SOURCE" ]; then
    ZIP_FILE="/tmp/${FUNCTION_NAME}-$(date +%s).zip"
    echo "Creating zip file from directory: $SOURCE"
    cd "$SOURCE"
    zip -r "$ZIP_FILE" . -x "*.git*" -x "*.DS_Store*" > /dev/null
    cd - > /dev/null
    SOURCE="$ZIP_FILE"
    CLEANUP=true
else
    CLEANUP=false
fi

# Deploy to Lambda
echo "Uploading code to Lambda..."
aws lambda update-function-code \
    --function-name "$FUNCTION_NAME" \
    --region "$REGION" \
    --zip-file "fileb://$SOURCE"

if [ $? -eq 0 ]; then
    echo "Deployment successful!"
    
    # Wait for update to complete
    echo "Waiting for function to update..."
    aws lambda wait function-updated \
        --function-name "$FUNCTION_NAME" \
        --region "$REGION"
    
    echo "Function updated and ready!"
else
    echo "Deployment failed!"
    exit 1
fi

# Clean up temporary zip file if we created it
if [ "$CLEANUP" = true ]; then
    rm "$ZIP_FILE"
fi


