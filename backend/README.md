# NOREN Backend

FastAPI ベースのバックエンド API。

## セットアップ

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -e ".[dev]"
```

## 開発サーバー起動

```bash
uvicorn src.app.main:app --reload
```

## テスト実行

```bash
pytest
```
