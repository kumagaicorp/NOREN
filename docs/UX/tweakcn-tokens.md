# tweakcn Tokens

## tweakcn とは
- shadcn/ui のテーマカスタマイズツール
- CSS変数ベースの tokens でデザインを一元管理
- https://tweakcn.com/

## NOREN 固定テーマ

**テーマURL**: https://tweakcn.com/themes/cmkf7cc3b000204jxa493eye3

このテーマは変更しない。

## 導入方法

```bash
pnpm dlx shadcn@latest add https://tweakcn.com/r/themes/cmkf7cc3b000204jxa493eye3
```

## 運用方針
- tokens を UI の唯一の真実として扱う
- 色・余白・角丸・タイポは tokens 経由で設定する
- コンポーネント固有のハードコードは避ける
- テーマ自体の変更は行わない

## 影響範囲
- `packages/ui/` の共通コンポーネント
- `apps/desktop/` の画面・コンポーネント
