import * as cdk from "aws-cdk-lib";
import { PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as logs from "aws-cdk-lib/aws-logs";

export class User2Stack extends cdk.Stack {
	constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		// Lambda用IAMロールを作成
		const lambdaRole = new Role(this, "LambdaExecutionRole", {
			assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
		});

		// S3への書き込み権限をロールに付与
		lambdaRole.addToPolicy(
			new PolicyStatement({
				actions: ["s3:PutObject"],
				resources: ["arn:aws:s3:::user1-bucket/*"], // ユーザー1のS3バケットARNを指定
			}),
		);

		const testFunction = new NodejsFunction(this, "testFuction", {
			entry: "lambda/hello/app.ts",
			runtime: lambda.Runtime.NODEJS_20_X, // Provide any supported Node.js runtime
			handler: "lambdaHandler",
			role: lambdaRole,
			environment: {
				MyBucketName: myBucket.bucketName,
				MyBucketRegion: this.region,
			},
		});
		// Create a CloudWatch Logs Log Group for myFunction
		new logs.LogGroup(this, "testLogGroup", {
			logGroupName: `/aws/lambda/${testFunction.functionName}`,
			retention: logs.RetentionDays.ONE_WEEK,
			removalPolicy: cdk.RemovalPolicy.DESTROY,
		});

		// とりあえずLambda Function URLsで
		const testFunctionUrl = testFunction.addFunctionUrl({
			authType: lambda.FunctionUrlAuthType.NONE,
		});
		new cdk.CfnOutput(this, "testFunctionUrl", {
			value: testFunctionUrl.url,
		});
	}
}
