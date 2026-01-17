# ADR 0005: Shadcraft Pro React

## Status
- Accepted

## Context
- shadcn/ui ベースのUI開発を効率化したい
- 高品質なコンポーネントとブロックが必要
- tweakcn との統合が可能

## Decision
- **Shadcraft Pro React** を採用する
- ライセンスキーで認証し、プライベートレジストリからコンポーネントを取得
- UI作成時に Shadcraft コンポーネント/ブロックを優先的に利用する

## 利用可能なアセット

### コンポーネント（56種）
Button, Card, Dialog, Input, Select, Tabs, Sidebar, Mobile Navigation Menu, など

### ブロック（44種）
Hero, Features, Testimonials, Pricing, Dashboard, など

### その他
- 1500+ Lucide アイコン
- フルページテンプレート

## コンポーネントソース優先順位
1. **Shadcraft Pro React** (`@shadcraft/*`) - 最優先
2. **shadcn/ui** - Shadcraft にない場合
3. **カスタム実装** - 上記にない場合のみ

## Configuration

### 環境変数 (.env)
```
SHADCRAFT_LICENSE_KEY="SHADCRAFT-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
```

### components.json
```json
{
  "registries": {
    "@shadcraft": {
      "url": "https://registry-shadcraft.vercel.app/r/{name}",
      "headers": {
        "X-License-Key": "${SHADCRAFT_LICENSE_KEY}"
      }
    }
  }
}
```

### インストールコマンド
```bash
pnpm dlx shadcn@latest add @shadcraft/<component-name>
```

## Consequences

### Positive
- 高品質なUI コンポーネントを即座に利用可能
- shadcn CLI との統合でワークフローが統一
- MCP Server 対応で自然言語からのコンポーネント追加が可能

### Negative
- ライセンス費用が発生
- プライベートレジストリへの依存

### Risks
- レジストリのダウンタイム時にインストール不可
