import type * as cdk from "aws-cdk-lib";

// TODO: いくらなんでもめんどくさすぎる。コンテキストから取得するパラメータをまとめて取得する関数を作成
export function getContexts(self: cdk.Stack) {
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
