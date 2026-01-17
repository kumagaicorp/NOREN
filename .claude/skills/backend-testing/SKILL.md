---
name: backend-testing
description: pytest によるunit主導の回帰防止スキル。変更点、バグ報告、期待挙動を入力とし、テストケース表と pytest 実装を出力する。挙動変更やバグ修正のたびに必須で使用する。失敗→修正→成功の再現ができることを受入条件とする。
---

# Backend Testing Standard

unit主導で回帰を防止する。

## 入力

- 変更点
- バグ報告
- 期待挙動

## 出力

- テストケース表（入力/期待出力/境界条件）
- pytest 実装
- テスト結果

## テスト対象

- services/ の振る舞いを中心にテストする
- api/ のエンドポイントは integration テストで最低限カバー

## テストケース表

| ケース | 入力 | 期待出力 | 備考 |
|--------|------|----------|------|
| 正常系 | ... | ... | ... |
| 異常系 | ... | ... | ... |
| 境界条件 | ... | ... | ... |

## pytest 構造

```
backend/tests/
├── unit/
│   ├── test_services.py
│   └── test_models.py
└── integration/
    └── test_api.py
```

## ワークフロー

1. 変更点を分析し、テストが必要な箇所を特定する
2. テストケース表を作成する
   - 正常系
   - 異常系
   - 境界条件
   - エッジケース
3. pytest で実装する
4. テストを実行する
5. 失敗→修正→成功の再現を確認する

## コマンド

```bash
# テスト実行
cd backend && pytest

# 特定テスト実行
cd backend && pytest tests/unit/test_services.py -v

# カバレッジ付き
cd backend && pytest --cov=src/app
```

## 受入条件

- テストケース表が作成されている
- 正常系・異常系・境界条件がカバーされている
- テストが独立して実行可能
- 失敗→修正→成功の再現ができる
