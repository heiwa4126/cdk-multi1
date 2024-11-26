import { GetCallerIdentityCommand, STSClient } from "@aws-sdk/client-sts"; // STSクライアント
import { fromIni } from "@aws-sdk/credential-providers"; // プロファイルクレデンシャル

export async function getCredentials(
	profile: string,
): Promise<{ account: string; region: string }> {
	// プロファイルの認証情報を取得
	const credentials = fromIni({ profile });

	// STSクライアントを初期化
	const stsClient = new STSClient({ credentials });

	// STSでアカウントIDを取得
	const command = new GetCallerIdentityCommand({});
	const response = await stsClient.send(command);

	if (!response.Account) {
		throw new Error(`Failed to retrieve account ID for profile: ${profile}`);
	}

	// プロファイル設定からリージョンを取得
	const region = process.env.AWS_REGION || "us-east-1"; // 必要に応じてカスタマイズ

	return {
		account: response.Account,
		region,
	};
}
