# Backend API ルール

- ルーティングは `api/`、ビジネスロジックは `services/`、永続化は `repositories/` に分離する。
- エラーモデルは `{code, message, details}` 形式で統一する。
- 入力検証と認可を API 層で明確化する。
