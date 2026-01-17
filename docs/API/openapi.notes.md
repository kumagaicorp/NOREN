# OpenAPI Notes

## MVP API 概要
- Base URL: `http://localhost:<port>`
- エラーモデル: `{code, message, details}`

## /health
- Method: `GET`
- Purpose: Desktop からの疎通確認
- Success:
  - Status: `200`
  - Body: `{ "status": "ok" }`
- Error:
  - Status: `5xx`（起動失敗時など）
  - Body: `{ "code": "HEALTH_CHECK_FAILED", "message": "string", "details": {} }`

## 変更理由・影響
- MVP は疎通確認のみを対象とするため、最小限のエンドポイントに限定する
