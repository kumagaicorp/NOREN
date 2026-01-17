---
name: tweakcn-token-workflow
description: tokensを唯一の真実にし、更新の影響を管理するワークフロースキル。tokens変更要求（色/余白/タイポ変更）を入力とし、変更手順、影響箇所、回帰チェック、移行ガイドを出力する。tokens変更時に必須で使用する。影響範囲が列挙され、UI崩れ検知があることを受入条件とする。
---

# tweakcn Token Workflow

tokensを唯一の真実にし、更新の影響を管理する。

## tweakcn について

- shadcn/ui のテーマカスタマイズツール（https://tweakcn.com/）
- CSS変数ベースの tokens でデザインを一元管理
- NOREN固定テーマ: https://tweakcn.com/themes/cmkf7cc3b000204jxa493eye3

```bash
# テーマの適用（初回のみ）
pnpm dlx shadcn@latest add https://tweakcn.com/r/themes/cmkf7cc3b000204jxa493eye3
```

テーマ自体は変更しない。このスキルはtokensの**運用**（影響確認・回帰チェック）に使用する。

## 入力

- tokens変更要求
- 色の変更
- 余白の変更
- タイポグラフィの変更

## 出力

- 変更手順
- 影響箇所一覧
- 回帰チェック
- 移行ガイド

## 運用方針

- tokens を UI の唯一の真実として扱う
- 色・余白・角丸・タイポは tokens 経由で設定する
- コンポーネント固有のハードコードは避ける

## 影響範囲

- `packages/ui/` の共通コンポーネント
- `apps/desktop/` の画面・コンポーネント

## ワークフロー

1. 変更対象の token を特定する
2. 影響を受けるコンポーネントを洗い出す
3. token の値を変更する
4. 影響を受けるコンポーネントを確認する
5. 回帰テストを行う
6. docs/UX/tweakcn-tokens.md を更新する

## 影響箇所の特定方法

```bash
# token 名で検索
grep -r "token-name" apps/desktop/src/
grep -r "token-name" packages/ui/
```

## 回帰チェック

### 主要画面の確認項目
- レイアウトが崩れていないか
- 色のコントラストが適切か
- 余白が適切か
- フォントが読みやすいか

### チェック手順
1. 開発サーバーを起動する
2. 主要画面を順に確認する
3. レスポンシブ表示を確認する
4. ダークモード（該当する場合）を確認する

## 移行ガイド

変更前後の対応表を作成する:

| 変更前 | 変更後 | 影響箇所 |
|--------|--------|----------|
| old-value | new-value | 箇所リスト |

## 受入条件

- 変更対象の token が特定されている
- 影響箇所が洗い出されている
- 主要画面の崩れを確認している
- docs/UX/tweakcn-tokens.md が更新されている
- 変更理由と影響範囲が記録されている
