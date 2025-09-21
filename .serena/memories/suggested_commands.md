# 推奨コマンド

## 開発用コマンド
- `expo start` - 開発サーバー開始
- `expo start --android` - Android向け開発サーバー開始
- `expo start --ios` - iOS向け開発サーバー開始
- `expo start --web` - Web向け開発サーバー開始

## EAS Build（Expo Application Services）コマンド
- `eas build --platform android --profile preview` - Androidプレビュービルド作成
- `eas build --platform android --profile production` - Android本番ビルド作成
- `eas build --platform ios --profile preview` - iOSプレビュービルド作成

## Git関連
- `git status` - ファイル変更状況確認
- `git add .` - 全変更をステージング
- `git commit -m "message"` - コミット
- `git push origin develop` - developブランチにプッシュ

## パッケージ管理
- `npm install` - 依存関係インストール
- `expo install [package]` - Expo互換パッケージインストール

## 注意事項
- このプロジェクトにはlint/typecheck用のスクリプトが設定されていない
- テスト用のスクリプトも現在未設定