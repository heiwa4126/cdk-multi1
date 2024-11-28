# cdk-multi1

AWS CDK v2 でマルチアカウントリソース(複数のユーザにまたがったリソース)をつくる練習。
TypeScript 版。

## 作成するスタックの内容

user1 の S3 バケットに、
user2 の lambda(今回は Function URLs)から書き込む。

## 一般的前提

- Node.js、パッケージマネージャ、AWS CDK のインストールと環境の設定
- AWS 設定ファイルと認証ファイル(~/.aws/config と credentials)に user1 と user2 を登録。SSO でも OK

## 固有の設定

`.env.template` を `.env` にコピーして、
user1 と user2 のプロファイル名を設定してください。

同様に
`./parameters.template.jsonc` を `parameters.jsonc` にコピーして
コメントに従って値を設定してください。

## デプロイ

※ pnpm を使う例です。npm は遅いので、pnpm か Bun がおすすめ

```sh
pnpm i
pnpm run deploy
```

実行と確認は (jq と curl を使っています)

```sh
# user1Stackで作ったlambda Function を実行する。
# user2StackのS3バケットに1個ファイルが増える(はず)。
./script/run-lambda.sh

# user1Stackで作ったS3バケットの中身をlsする
./script/ls-s3.sh
```

リソースの破棄は

```sh
pnpm run destroy
```

## メモ

`user2Account`は明らかに 2 度手間(user2 のプロファイルから取れる)ので、なんとかならないか考える。
あと aws-cn だと死ぬはず。`arn:aws:iam::${user2Account}:role/${user2IAMRole}`で作ってるから。

マルチアカウントのスタックはやっぱり難しい。

TODO: run-scripts の bootstrap が user1 と user2 でやらないとダメ。あとで直す。

TODO: スタックの名前を変えられるようにする。.envで書けばたぶんできる。
