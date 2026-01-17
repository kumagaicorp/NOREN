# UI Guidelines

## 基本方針
- MVP は「疎通確認」に必要な最小 UI のみを実装する
- `features/` にユースケース、`components/` に汎用 UI を配置する
- 色・余白・角丸などは tokens を使用し、ハードコードを避ける
- スクリーンショットは構造・情報設計・操作意図のみを抽出する

## コンポーネントソース

### 優先順位
1. **Shadcraft Pro React** - プレミアムコンポーネント・ブロック
2. **shadcn/ui** - 標準コンポーネント
3. **カスタム実装** - 上記にない場合のみ

### Shadcraft Pro React
- 56 コンポーネント（Button, Card, Dialog, Input, Select, Tabs 等）
- 44 ブロック（hero, features, testimonials, pricing 等）
- Mobile Navigation Menu, Sidebar, Dashboard 等

```bash
# インストール
pnpm dlx shadcn@latest add @shadcraft/<component-name>
```

### shadcn/ui
```bash
pnpm dlx shadcn@latest add <component-name>
```

## テーマ
- **tweakcn**: https://tweakcn.com/themes/cmkf7cc3b000204jxa493eye3 (固定)
- Shadcraft と shadcn/ui は同じ token システムを使用

## a11y（必須）
- すべての入力・ボタンにラベルを付ける
- キーボード操作で主要機能が完結すること
- ダイアログ使用時はフォーカストラップを有効にする

## MVP 画面構成（疎通確認）
- 接続状態（OK/NG）
- エラーメッセージ（NG 時）
- 再試行ボタン

## UX仕様書 標準フォーマット
- 画面名 / 目的
- 参考にした入力
  - 紙ラフ: 有/無
  - スクリーンショット: 有/無（URL/説明）
- 抽出した意図（参考UIから何を学んだか）
- 採用要素 / 不採用要素 / 再解釈要素
- 情報設計（優先度）
- レイアウト構造（文章）
- コンポーネント（抽象名）
- 操作フロー
- 状態一覧（初期/ローディング/空/正常/エラー）
- a11y配慮
- 受入基準（Given/When/Then）
