import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import { Role } from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as logs from "aws-cdk-lib/aws-logs";
import { getParameters } from "./contexts";

export class User2Stack extends cdk.Stack {
	constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		// コンテキストからパラメータを取得
		const { bucketName, user2IAMRole } = getParameters();

		// Lambda用IAMロールを作成。User1Stackよりも先に作成する必要がある
		const testFunctionRole = new Role(this, "testFuctionRole", {
			roleName: user2IAMRole,
			assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
			managedPolicies: [
				iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"),
			],
			inlinePolicies: {
				MyBucketWriteAccess: new iam.PolicyDocument({
					statements: [
						new iam.PolicyStatement({
							actions: ["s3:PutObject"],
							resources: [`arn:${cdk.Aws.PARTITION}:s3:::${bucketName}/*`], // ユーザー1のS3バケットARNを指定,
						}),
					],
				}),
			},
		});
		new cdk.CfnOutput(this, "testFuctionRoleArn", {
			value: testFunctionRole.roleArn,
			description: "Just for debug",
		});

		const testFunction = new NodejsFunction(this, "testFuction", {
			entry: "lambda/writeS3/app.ts",
			runtime: lambda.Runtime.NODEJS_20_X, // Provide any supported Node.js runtime
			handler: "lambdaHandler",
			role: testFunctionRole,
			bundling: {
				minify: true,
			},
			environment: {
				MyBucketName: bucketName,
				MyBucketRegion: this.region,
			},
		});
		// Create a CloudWatch Logs Log Group for myFunction
		new logs.LogGroup(this, "testFuctionLogGroup", {
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
