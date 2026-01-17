# ADR 0003: Backend Connection (MVP)

## Status
- Accepted

## Context
- MVP は最小構成で早期に動かす必要がある
- PRD 確定後に要件に応じて B/C を再検討する

## Decision
- MVP は A: ローカルHTTP（localhostでFastAPIを起動しWebViewからfetch）を採用する

## Consequences
- Desktop から Backend を HTTP で呼び出せる
- 将来的に B/C へ移行するための影響整理が必要
