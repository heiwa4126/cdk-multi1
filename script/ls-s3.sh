#!/bin/bash
. ./.env
BACKETNAME=$(jq .User1Stack.BucketName outputs1.tmp.json -r)
aws s3 ls s3://$BACKETNAME --recursive --profile "$user1"
