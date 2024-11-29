import * as cdk from "aws-cdk-lib";
import { ArnPrincipal, Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { getParameters } from "./contexts";
export class User1Stack extends cdk.Stack {
	constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		// コンテキストからパラメータを取得
		const { bucketName, user2Account, user2IAMRole } = getParameters();

		// S3バケットを作成
		const bucket = new Bucket(this, "User1Bucket", {
			bucketName,
			publicReadAccess: false,
			//--- 以下デバッグ用設定
			removalPolicy: cdk.RemovalPolicy.DESTROY,
			autoDeleteObjects: true, // バケット削除時に中身も削除するlambdaとroleが自動で作成される
		});

		// バケットポリシーを追加
		// user2Stackの 論理ID testFuctionRole が存在しないと、スタック生成時にタイムアウトする
		bucket.addToResourcePolicy(
			new PolicyStatement({
				effect: Effect.ALLOW,
				principals: [
					new ArnPrincipal(`arn:${cdk.Aws.PARTITION}:iam::${user2Account}:role/${user2IAMRole}`),
				],
				actions: ["s3:PutObject"],
				resources: [`${bucket.bucketArn}/*`],
			}),
		);
		new cdk.CfnOutput(this, "BucketName", {
			value: bucket.bucketName,
			description: "This is the name of the bucket. ${bucket.bucketName} == ${backetName}",
		});
		new cdk.CfnOutput(this, "BucketArn", {
			value: bucket.bucketArn,
			description: "Just for debug",
		});
	}
}
