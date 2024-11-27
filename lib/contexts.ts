import type * as cdk from "aws-cdk-lib";
import * as fs from "fs";

// TODO: いくらなんでもめんどくさすぎる。コンテキストから取得するパラメータをまとめて取得する関数を作成
export function getContexts0(self: cdk.Stack) {
	const bucketName = self.node.tryGetContext("bucketName");
	if (!bucketName) {
		throw new Error("'bucketName' is not defined in the context");
	}
	const user2Account = self.node.tryGetContext("user2Account");
	if (!user2Account) {
		throw new Error("'user2Account' is not defined in the context");
	}
	const user2IAMRole = self.node.tryGetContext("user2IAMRole");
	if (!user2IAMRole) {
		throw new Error("'user2IAMRole' is not defined in the context");
	}
	return { bucketName, user2Account, user2IAMRole };
}

export function getContexts(self: cdk.Stack, parameterJsonFile = "./parameters.json") {
	const parameters = JSON.parse(fs.readFileSync(parameterJsonFile, "utf-8"));

	const bucketName = parameters["bucketName"];
	if (!bucketName) {
		throw new Error("'bucketName' is not defined in the context");
	}
	const user2Account = parameters["user2Account"];
	if (!user2Account) {
		throw new Error("'user2Account' is not defined in the context");
	}
	const user2IAMRole = parameters["user2IAMRole"];
	if (!user2IAMRole) {
		throw new Error("'user2IAMRole' is not defined in the context");
	}
	return { bucketName, user2Account, user2IAMRole };
}
