---
name: shadcn-component-authoring
description: shadcn/ui・Shadcraft Pro Reactコンポーネントの分割・命名・variants・a11yを標準化するスキル。画面要件、デザイン指針、既存コンポーネントを入力とし、コンポーネント設計、props設計、利用例、a11yチェックを出力する。UI実装・改修時に使用する。再利用可能かつa11y要件を満たすことを受入条件とする。
---

# shadcn/ui & Shadcraft Pro React Component Authoring Standard

コンポーネント分割・命名・variants・a11yを標準化する。

## コンポーネントソース

### 優先順位
1. **Shadcraft Pro React** (`@shadcraft/*`) - 最優先
2. **shadcn/ui** - Shadcraft にない場合
3. **カスタム実装** - 上記にない場合のみ

### Shadcraft Pro React 内容
- 56 コンポーネント（Button, Card, Dialog, Input, Select, Tabs 等）
- 44 ブロック（hero, features, testimonials, pricing 等）
- Mobile Navigation Menu, Sidebar, Dashboard

### インストール
```bash
# Shadcraft Pro
pnpm dlx shadcn@latest add @shadcraft/<component-name>

# shadcn/ui
pnpm dlx shadcn@latest add <component-name>
```

## 入力

- 画面要件
- デザイン指針（docs/UX/ui-guidelines.md）
- 既存コンポーネント

## 出力

- コンポーネント設計
- props設計
- 利用例
- a11yチェック

## ディレクトリ構造

```
apps/desktop/src/
├── features/      # 画面/ユースケース単位の状態とロジック
├── components/    # 汎用UI（propsが明確な小コンポーネント）
└── lib/           # ユーティリティ

packages/ui/
├── components/    # 共有コンポーネント
├── styles/        # 共有スタイル
└── lib/           # ユーティリティ
```

## 命名規則

- コンポーネント: PascalCase（例: `Button`, `DataTable`）
- ファイル: kebab-case（例: `button.tsx`, `data-table.tsx`）
- props: camelCase（例: `onClick`, `isDisabled`）

## props設計

```typescript
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

## variants (cva)

```typescript
const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "...",
        destructive: "...",
      },
      size: {
        default: "...",
        sm: "...",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

## a11y 要件（必須）

- ラベル: 全ての入力・ボタンにラベルを付ける
- フォーカス: フォーカス可能な要素にフォーカスリングを表示する
- キーボード: キーボード操作で主要機能が完結する
- フォーカストラップ: ダイアログ使用時は有効にする

## tokens 使用

- 色: tokens から取得（ハードコード禁止）
- 余白: tokens から取得（ハードコード禁止）
- 角丸: tokens から取得（ハードコード禁止）
- フォント: tokens から取得（ハードコード禁止）

## ワークフロー

1. 要件を確認し、必要なコンポーネントを特定する
2. **Shadcraft Pro React** に該当コンポーネント/ブロックがあるか確認する
3. なければ **shadcn/ui** を確認する
4. どちらにもなければカスタム実装を検討する
5. props を設計する
6. variants を設計する
7. a11y 要件を満たす実装を行う
8. tokens を使用してスタイリングする
9. 利用例を作成する

## 受入条件

- Shadcraft Pro / shadcn/ui を優先的に利用している
- features/ と components/ の責務が分離されている
- 命名規則に従っている
- props が明確に定義されている
- a11y 要件を満たしている
- tokens を使用し、ハードコードがない
- 再利用可能な設計
