---
name: tauri-ipc-security
description: Tauri IPC設計と安全な入出力、エラーモデル整合を担うスキル。必要なコマンド/権限/データフローを入力とし、IPCコマンド仕様、入力スキーマ、エラー規約、最小権限設計を出力する。IPC導入・変更時に必須で使用する。入力検証があり、機密がログに出ないことを受入条件とする。
---

# Tauri IPC & Security Standard

IPC設計と安全な入出力、エラーモデル整合を行う。

## 入力

- 必要なコマンド
- 必要な権限
- データフロー

## 出力

- IPCコマンド仕様
- 入力スキーマ
- エラー規約
- 最小権限設計

## IPC コマンド仕様

```rust
#[tauri::command]
async fn command_name(
    input: InputSchema
) -> Result<OutputSchema, AppError> {
    // 入力検証
    // 処理
    // 結果返却
}
```

## 入力スキーマ

```rust
#[derive(Deserialize)]
struct InputSchema {
    field: Type,
}
```

## エラー規約

Backend と同じ形式を使用:

```rust
#[derive(Serialize)]
struct AppError {
    code: String,
    message: String,
    details: Option<serde_json::Value>,
}
```

## セキュリティチェック

### 入力検証
- 全ての入力を検証する
- 信頼境界を明確にする
- サニタイズを適切に行う

### 機密情報
- APIキー、トークンをログに出さない
- 個人情報をログに出さない
- 環境変数で管理する

### 最小権限
- 必要な権限のみを tauri.conf.json で許可する
- ファイルアクセスを制限する
- ネットワークアクセスを制限する

## ワークフロー

1. 必要なコマンドを洗い出す
2. 各コマンドの入力スキーマを定義する
3. 出力スキーマとエラー規約を定義する
4. 必要な権限を特定する
5. tauri.conf.json を更新する
6. セキュリティチェックを行う

## 受入条件

- IPCコマンドの入力スキーマが明確
- エラーが安全に返される
- 入力検証がある
- 機密情報がログに出ていない
- 権限が最小限
