#!/bin/bash
URL=$(jq .User2Stack.testFunctionUrl outputs2.tmp.json -r)
curl "$URL" | jq .
