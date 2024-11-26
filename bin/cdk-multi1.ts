#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { User1Stack } from "../lib/user1-stack";
import { User2Stack } from "../lib/user2-stack";

const app = new cdk.App();

new User1Stack(app, "User1Stack", { env: { account: "erai", region: "ap-northeast-1" } });
new User2Stack(app, "User2Stack", { env: { account: "erai3", region: "ap-northeast-1" } });
