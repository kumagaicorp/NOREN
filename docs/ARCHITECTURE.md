# ARCHITECTURE

## 全体構成
- Backend: FastAPI（`backend/`）
- Desktop: Tauri + React（`apps/desktop/`）
- UI: packages/ui（`packages/ui/`）

## ランタイム構成（MVP）
- Desktop がローカルで FastAPI を起動し、`localhost` で HTTP 通信する
- UI は WebView 内で動作し、`/health` などの API を呼び出す

## 起動/停止フロー（MVP）
- Desktop 起動時に Backend を起動する
- Backend が起動したら UI が `/health` を呼び出す
- Desktop 終了時に Backend を停止する

## 境界と責務
- UI は表示・入力に集中し、ドメイン判断は Backend に寄せる
- Rust は OS 統合と IPC 安全化に集中し、ビジネスロジックは持たない
- Backend は `api -> services -> repositories` にレイヤ分離する

## データフロー
- MVP はローカル HTTP（A）で Desktop から Backend を呼び出す
- 将来は ADR に基づき B または C に移行する
- エラーは `{code, message, details}` 形式で返す

## エラーハンドリング
- `/health` の失敗は UI で「接続NG」として表示する
- 後続の API 追加時も同じエラーモデルを利用する

## Backend 接続方式（A/B/C）
- ADR 0003 にて A を採用（MVP）
- PRD 確定後に B（オフライン重視）/C（同期・マルチ端末）を再検討
