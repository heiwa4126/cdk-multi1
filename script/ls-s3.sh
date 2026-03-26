#!/usr/bin/env bash
# user1Stackで作ったS3バケットの中身をlsする。
set -euo pipefail

. ./.env
BUCKET_NAME=$(jq .User1Stack.BucketName outputs1.tmp.json -r)
aws s3 ls s3://"$BUCKET_NAME" --recursive --profile "$user1"
