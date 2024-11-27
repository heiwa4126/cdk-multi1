#!/bin/bash
# user1Stackで作ったlambda Function を実行する。user2StackのS3バケットに1個ファイルが増える(はず)。
URL=$(jq .User2Stack.testFunctionUrl outputs2.tmp.json -r)
curl "$URL" | jq .
