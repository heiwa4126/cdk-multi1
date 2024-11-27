# cdk-multi1

AWS CDK v2 でマルチアカウントリソースをつくる練習。
TypeScript 版。

## 内容

user1 の S3 バケットに、user2 の lambda(今回は Function URLs)から書き込む。

## 前提

0. Node.js、パッケージマネージャ、AWS CDK のインストールと環境の設定
1. AWS 設定ファイルと認証ファイル(~/.aws/config と credentials)に user1 と user2 を登録。SSO でも OK
2. このプロジェクトを clone
