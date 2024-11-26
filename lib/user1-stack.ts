import * as cdk from "aws-cdk-lib";
import { ArnPrincipal, Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Bucket } from "aws-cdk-lib/aws-s3";

export class User1Stack extends cdk.Stack {
	constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		// S3バケットを作成
		const bucket = new Bucket(this, "User1Bucket", {
			bucketName: "user1-bucket",
			publicReadAccess: false,
			//--- 以下デバッグ用設定
			removalPolicy: cdk.RemovalPolicy.DESTROY,
			autoDeleteObjects: true, // バケット削除時に中身も削除するlambdaとroleが自動で作成される
		});

		// バケットポリシーを追加
		bucket.addToResourcePolicy(
			new PolicyStatement({
				effect: Effect.ALLOW,
				principals: [
					new ArnPrincipal("arn:aws:iam::<ユーザー2のアカウントID>:role/<ユーザー2のIAMロール名>"),
				],
				actions: ["s3:PutObject"],
				resources: [`${bucket.bucketArn}/*`],
			}),
		);
	}
}
