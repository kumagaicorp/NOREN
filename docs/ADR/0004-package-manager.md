# ADR 0004: Package Manager

## Status
- Accepted

## Context
- フロントエンドの依存管理にパッケージマネージャが必要
- `apps/desktop/` と `packages/ui/` のmonorepo構成
- npm, yarn, pnpm, bun が選択肢

## Decision
- **pnpm** を採用する

## Alternatives Considered

### npm/npx
- 概要: Node.js標準、最も広く使われている
- 却下理由: 速度とディスク効率がpnpmに劣る

### yarn
- 概要: Facebook開発、安定した実績
- 却下理由: yarn classic vs berry の分断、pnpmの方がmonorepo対応が優れる

### bun
- 概要: 最速、Zig製ランタイム
- 却下理由: 比較的新しく、一部ライブラリとの互換性リスク

## Consequences

### Positive
- monorepoのワークスペース管理が容易
- 依存の厳格管理でphantom dependency防止
- ディスク使用量削減

### Negative
- チームメンバーにpnpmインストールが必要
- npm scriptsの一部互換性確認が必要

### Risks
- 特になし（pnpmは十分成熟）
