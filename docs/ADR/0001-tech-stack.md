# ADR 0001: Tech Stack

## Status
- Accepted

## Context
- MVP を早期に動かし、Desktop から Backend へ疎通できる最小構成が必要
- 既存方針として FastAPI / Tauri / React / Vite / shadcn/ui / tweakcn を採用する前提

## Decision
- Backend: Python + FastAPI
- Desktop: Tauri（Rust + WebView）
- Frontend: React + Vite
- UI: shadcn/ui + tweakcn tokens

## Consequences
- Python と Rust/JS の両方のビルド環境が必要
- UI は tokens を中心に設計する必要がある
