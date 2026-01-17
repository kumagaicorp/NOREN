# ADR 0002: API Conventions

## Status
- Accepted

## Context
- MVP では `/health` の疎通を安定的に返し、UI で結果を扱える必要がある
- エラーハンドリングの統一が必要

## Decision
- レイヤ分離は `api -> services -> repositories` とする
- エラーモデルは `{code, message, details}` に統一する
- `/health` は 200 を返し、失敗時は統一エラー形式を返す

## Consequences
- API 実装は統一エラー形式に合わせる必要がある
- 例外設計は `core/` に集約する必要がある
