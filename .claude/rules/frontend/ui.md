# Frontend UI ルール

## コンポーネントソース優先順位
1. **Shadcraft Pro React** (`@shadcraft/*`) - 最優先で利用
2. **shadcn/ui** - Shadcraft にない場合
3. **カスタム実装** - 上記にない場合のみ

## インストール
```bash
# Shadcraft Pro
pnpm dlx shadcn@latest add @shadcraft/<component-name>

# shadcn/ui
pnpm dlx shadcn@latest add <component-name>
```

## 構造
- `features/` にユースケース、`components/` に汎用UIを置く。

## スタイリング
- tokens を優先し、色/余白/角丸のハードコードを避ける。
- tweakcn テーマに準拠する。

## a11y（必須）
- ラベル、フォーカス、キーボード操作を必須にする。
