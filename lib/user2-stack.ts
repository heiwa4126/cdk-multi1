import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import { Role } from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as logs from "aws-cdk-lib/aws-logs";

export class User2Stack extends cdk.Stack {
	constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		// コンテキストからパラメータを取得
		const bucketName = this.node.tryGetContext("bucketName");
		if (!bucketName) {
			throw new Error("'bucketName' is not defined in the context");
		}
		const user2Account = this.node.tryGetContext("user2Account");
		if (!user2Account) {
			throw new Error("'user2Account' is not defined in the context");
		}
		const user2IAMRole = this.node.tryGetContext("user2IAMRole");
		if (!user2IAMRole) {
			throw new Error("'user2IAMRole' is not defined in the context");
		}

		// Lambda用IAMロールを作成。User1Stackよりも先に作成する必要がある
		const lambdaRole = new Role(this, "LambdaExecutionRole", {
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
							resources: [`arn:aws:s3:::${bucketName}/*`], // ユーザー1のS3バケットARNを指定,
						}),
					],
				}),
			},
		});

		const testFunction = new NodejsFunction(this, "testFuction", {
			entry: "lambda/writeS3/app.ts",
			runtime: lambda.Runtime.NODEJS_20_X, // Provide any supported Node.js runtime
			handler: "lambdaHandler",
			role: lambdaRole,
			bundling: {
				minify: true,
			},
			environment: {
				MyBucketName: bucketName,
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
