#!/bin/bash
# user1Stackで作ったS3バケットの中身をlsする。
. ./.env
BACKETNAME=$(jq .User1Stack.BucketName outputs1.tmp.json -r)
aws s3 ls s3://$BACKETNAME --recursive --profile "$user1"
