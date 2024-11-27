import Ajv, { type JSONSchemaType } from "ajv";
import { parse } from "jsonc-parser";
import * as fs from "node:fs";

//#region AJV things
const ajv = new Ajv();

// S3バケット名検証用のカスタムバリデーション
// - 3~63文字である
// - 小文字の英数字、ハイフン(-)のみ使用可能
// - バケット名は英小文字または数字で始まり、英小文字または数字で終わらなければならない
// - ハイフンは連続して使用できない
// - IPアドレス形式は使用できない (例: 192.168.0.1)
ajv.addKeyword({
	keyword: "isS3BucketName",
	type: "string",
	validate: (schema: boolean, data: unknown) => {
		if (typeof data !== "string") return false;

		const isValidLength = data.length >= 3 && data.length <= 63;
		const isValidChars = /^[a-z0-9\-]+$/.test(data);
		const startsAndEndsWithAlphaNum = /^[a-z0-9].*[a-z0-9]$/.test(data);
		const noConsecutiveHyphens = !data.includes("--");
		const isNotIPAddress = !/^\d+\.\d+\.\d+\.\d+$/.test(data);

		return (
			isValidLength &&
			isValidChars &&
			startsAndEndsWithAlphaNum &&
			noConsecutiveHyphens &&
			isNotIPAddress
		);
	},
	errors: false,
});

// AWSアカウント番号のカスタムバリデーション
// - 12桁の数字の文字列である
ajv.addKeyword({
	keyword: "isAWSAccountNumber",
	type: "string",
	validate: (schema: boolean, data: unknown): boolean => {
		return typeof data === "string" && /^[0-9]{12}$/.test(data);
	},
	errors: false,
});

// IAMロール名のカスタムバリデーション
// - 1~64文字である
ajv.addKeyword({
	keyword: "isIAMRoleName",
	type: "string",
	validate: (schema: boolean, data: unknown): boolean => {
		return typeof data === "string" && /^[\w\-]{1,64}$/.test(data);
	},
	errors: false,
});

// スキーマ定義
const schema: JSONSchemaType<{
	bucketName: string;
	user2Account: string;
	user2IAMRole: string;
}> = {
	type: "object",
	properties: {
		bucketName: { type: "string", isS3BucketName: true },
		user2Account: { type: "string", isAWSAccountNumber: true },
		user2IAMRole: { type: "string", isIAMRoleName: true },
	},
	required: ["bucketName", "user2Account", "user2IAMRole"],
	additionalProperties: false,
};

// バリデーション関数
const validate = ajv.compile(schema);

//#endregion

export function getParameters(parameterJsonFile = "./parameters.jsonc") {
	// コメントが使える & 親切なエラーメッセージが出るように JSONCにしました
	const parameters = parse(fs.readFileSync(parameterJsonFile, "utf-8"));

	const isValid = validate(parameters);
	if (!isValid) {
		console.error("Validation errors:", validate.errors);
		throw new Error(`Invalid parameters in ${parameterJsonFile}.`);
	}

	return parameters;
}
