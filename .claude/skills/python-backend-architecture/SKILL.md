---
name: python-backend-architecture
description: FastAPI Backendのapi/services/repositoriesの分離、例外/ログ/設定の統一を担う設計標準スキル。backend新規・改修時に使用し、配置先、関数/クラス設計、例外設計、テスト方針を出力する。レイヤ逸脱がないこと、テストが追加されることを受入条件とする。
---

# Python Backend Architecture Standard

api/services/repositoriesの分離、例外/ログ/設定の統一を行う。

## レイヤ分離

```
backend/src/app/
├── api/          # ルーティング、入力検証、認可
├── services/     # ビジネスロジック
├── repositories/ # 永続化、外部接続
├── models/       # データモデル
└── core/         # 設定、例外、ロギング
```

## ルール

### api/ 層
- ルーティングのみを担当する
- 入力検証と認可をここで行う
- ビジネスロジックを含まない
- services/ を呼び出す

### services/ 層
- ビジネスロジックを集約する
- api/ から呼び出される
- repositories/ を呼び出す
- 外部I/Oを直接行わない

### repositories/ 層
- 永続化と外部接続を担当する
- services/ から呼び出される
- DBアクセス、外部API呼び出し

### core/ 層
- 設定（config）
- 例外定義（errors）
- ロギング（logging）

## エラーモデル

```python
{
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {"key": "value"}
}
```

## 設計手順

1. 要件を確認し、責務を特定する
2. 配置先レイヤを決定する
3. インターフェース（関数/クラス）を設計する
4. 例外設計を行う
5. テスト方針を決定する

## 受入条件

- レイヤ分離が守られている
- api 層に入力検証がある
- services 層にビジネスロジックが集約されている
- repositories 層に永続化が隔離されている
- エラーモデルが統一形式
- テストが追加される
