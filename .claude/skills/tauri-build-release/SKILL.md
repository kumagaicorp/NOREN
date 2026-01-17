---
name: tauri-build-release
description: 再現可能なビルドと配布手順の標準化スキル。ターゲットOS、署名要件、成果物仕様を入力とし、手順書、コマンド、バージョニング、チェックリストを出力する。CI/配布導入時およびリリース前に使用する。第三者が同じ手順で成果物生成できることを受入条件とする。
---

# Tauri Build & Release Standard

再現可能なビルドと配布手順を標準化する。

## 入力

- ターゲットOS（Windows, macOS, Linux）
- 署名要件
- 成果物仕様（インストーラ形式、配布方法）

## 出力

- ビルド手順書
- 実行コマンド一覧
- バージョニングルール
- チェックリスト
- 成果物（.msi, .dmg, .AppImage など）

## バージョニング

セマンティックバージョニング（MAJOR.MINOR.PATCH）を採用:

- MAJOR: 後方互換性のない変更
- MINOR: 後方互換性のある機能追加
- PATCH: 後方互換性のあるバグ修正

更新対象:
- tauri.conf.json
- package.json
- Cargo.toml

## ビルドコマンド

### 前提条件
```bash
cd apps/desktop
npm install
rustup show
```

### 開発ビルド
```bash
cd apps/desktop
npm run tauri dev
```

### 本番ビルド
```bash
cd apps/desktop
npm run tauri build
```

### プラットフォーム別

Windows:
```bash
npm run tauri build -- --target x86_64-pc-windows-msvc
```

macOS:
```bash
npm run tauri build -- --target x86_64-apple-darwin
npm run tauri build -- --target aarch64-apple-darwin
```

Linux:
```bash
npm run tauri build -- --target x86_64-unknown-linux-gnu
```

## 成果物

- Windows: `.msi`, `.exe`
- macOS: `.dmg`, `.app`
- Linux: `.AppImage`, `.deb`

出力先: `apps/desktop/src-tauri/target/release/bundle/`

## ワークフロー

1. リリース要件を確認する
2. バージョン番号を更新する
3. CHANGELOGを更新する
4. ビルドを実行する
5. 成果物を検証する
6. 手順書を更新する

## 受入条件

- バージョン番号が正しく更新されている
- 全ターゲットOSでビルドが成功する
- 成果物がインストール・起動できる
- 手順書が第三者でも再現可能
