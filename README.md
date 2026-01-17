# NOREN

[![GitHub](https://img.shields.io/badge/GitHub-kumagaicorp%2FNOREN-blue)](https://github.com/kumagaicorp/NOREN)

## 概要
- TODO: プロジェクト概要

## リポジトリ
https://github.com/kumagaicorp/NOREN

## 開発構成
- Backend: `backend/` (FastAPI)
- Desktop: `apps/desktop/` (Tauri + React)
- UI: `packages/ui/` (shadcn/ui)

## セットアップ

### 必要環境
- Node.js >= 18
- pnpm >= 8
- Python >= 3.11
- Rust (Tauri用)

### インストール

```bash
# pnpm インストール（未導入の場合）
npm install -g pnpm

# フロントエンド依存
pnpm install

# 環境変数設定
cp apps/desktop/.env.example apps/desktop/.env
# .env に SHADCRAFT_LICENSE_KEY を設定

# tweakcn テーマ適用
pnpm dlx shadcn@latest add https://tweakcn.com/r/themes/cmkf7cc3b000204jxa493eye3

# Shadcraft Pro コンポーネント追加（例）
pnpm dlx shadcn@latest add @shadcraft/<component-name>

# バックエンド依存
cd backend && pip install -e ".[dev]"
```

### 起動

```bash
# Backend
cd backend && uvicorn src.app.main:app --reload

# Desktop (別ターミナル)
pnpm tauri dev
```
