#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { User1Stack } from "../lib/user1-stack";
import { User2Stack } from "../lib/user2-stack";

const projectName = "cdk-multi1";
const app = new cdk.App();

const stack1 = new User1Stack(app, "User1Stack", { stackName: `${projectName}-User1Stack` });
const stack2 = new User2Stack(app, "User2Stack", { stackName: `${projectName}-User2Stack` });

// stack1がstack2に依存することを明示 (stack2, stack1の順でしか作れない)
stack1.addDependency(stack2);
// ただしマルチアカウントではあんまり意味がない。
// どうせ `cdk deploy --all` で作れないから
