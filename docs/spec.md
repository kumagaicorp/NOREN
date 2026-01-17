# AI開発チーム運用アーキテクチャ仕様（Cursor Codex → Claude Code 実装用）

## 0. 目的
Cursor上で「AI開発チーム」を常設化し、以下の分業モデルでソフトウェア開発を継続運用できる状態を構築する。

- **Planner / Tech Lead**：Cursor Agent（Gemini 3.0 Pro または GPT-5.2 Codex）
  - 要件整理、アーキ設計、WBS分解、受入基準、レビュー観点、リスク管理、実装指示書の生成
- **Implementer**：Claude Code（Opus 4.5）
  - コーディング、テスト、ローカル実行、差分作成、修正対応
- **専門サブエージェント**：Claude Code Subagent
  - レビュー、QA、セキュリティ、リリースなど、独立コンテキストで分業

本仕様は、**プロジェクト構造（フォルダ/ファイル）・統制レイヤー（CLAUDE.md / rules / Cursor rules）・必要Skillsの役割・運用フロー**を定義する。

---

## 1. 技術スタック前提
- Backend：Python（FastAPI想定）
- Desktop：Tauri（Rust + WebView）
- Frontend：React + Vite（Tauri内）
- UI：shadcn/ui、tweakcn（tokens/テーマ）
- 利用サービス：Cursor Pro、Claude MAX、Google Workspace、Cloudflare Workers/R2、shadcraft

---

## 2. 統制レイヤー（ルールの階層）
### 2.1 レイヤー定義
1) **Project Constitution（憲法）**：`/CLAUDE.md`
- 全体の原則、品質基準、禁止事項、共通コマンド、作業フローを定義
- Claude Codeが上位ディレクトリまで探索して読み込む前提で、最上位に置く

2) **Claude Rules（強制規約）**：`/.claude/rules/**/*.md`
- “破ってはいけない”ルールを分割管理
- `paths` 指定で適用範囲を限定し、コンテキストを肥大化させない

3) **Cursor Rules（Planner向け規約）**：`/.cursor/rules/*.mdc`
- Cursor Agentが「計画・レビュー」を作る際の様式/観点を固定

4) **Skills（標準手順/作業プロトコル）**：`/.claude/skills/**`（または個人のskills）
- 必要時に注入する「手順書・テンプレ・チェックリスト」を規格化
- 本仕様では“何が必要か”を役割として定義し、実装（作成/選定）はユーザーが行う

5) **Subagents（専門担当者）**：`/.claude/agents/*.md`
- レビュー班、テスト班、セキュリティ班などを独立コンテキストで運用

---

## 3. プロジェクトフォルダ階層（規範）
以下を **初期構造の規範（Source of truth）** とする。

```text
your-project/
├─ CLAUDE.md
├─ README.md
├─ docs/
│  ├─ PRD.md
│  ├─ ARCHITECTURE.md
│  ├─ ADR/
│  │  ├─ 0001-tech-stack.md
│  │  └─ 0002-api-conventions.md
│  ├─ API/
│  │  └─ openapi.notes.md
│  └─ UX/
│     ├─ ui-guidelines.md
│     └─ tweakcn-tokens.md
│
├─ .claude/
│  ├─ agents/
│  │  ├─ code-reviewer.md
│  │  ├─ backend-engineer.md
│  │  ├─ frontend-engineer.md
│  │  ├─ test-engineer.md
│  │  ├─ security-auditor.md
│  │  ├─ release-engineer.md
│  │  ├─ ux-designer.md
│  │  └─ ui-spec-compliance-checker.md
│  ├─ skills/
│  │  └─ <skill-name>/
│  └─ rules/
│     ├─ general.md
│     ├─ security.md
│     ├─ backend/
│     │  ├─ api.md
│     │  └─ testing.md
│     └─ frontend/
│        ├─ ui.md
│        └─ tauri.md
│
├─ .cursor/
│  └─ rules/
│     ├─ 00-global.mdc
│     ├─ 10-backend-python.mdc
│     ├─ 20-frontend-react.mdc
│     ├─ 30-tauri.mdc
│     └─ 40-pr-review.mdc
│
├─ backend/
│  ├─ pyproject.toml
│  ├─ README.md
│  ├─ src/
│  │  └─ app/
│  │     ├─ main.py
│  │     ├─ api/
│  │     ├─ core/
│  │     ├─ services/
│  │     ├─ models/
│  │     └─ repositories/
│  └─ tests/
│     ├─ unit/
│     └─ integration/
│
├─ apps/
│  └─ desktop/
│     ├─ package.json
│     ├─ vite.config.ts
│     ├─ index.html
│     ├─ src/
│     │  ├─ main.tsx
│     │  ├─ app/
│     │  ├─ features/
│     │  ├─ components/
│     │  └─ lib/
│     └─ src-tauri/
│        ├─ Cargo.toml
│        ├─ tauri.conf.json
│        └─ src/
│           └─ main.rs
│
├─ packages/
│  └─ ui/
│     ├─ package.json
│     ├─ components/
│     ├─ styles/
│     └─ lib/
│
└─ tools/
   ├─ scripts/
   └─ ci/
```

### 3.1 ディレクトリ責務
- `backend/`：Python API・ビジネスロジック・テスト
- `apps/desktop/`：Tauriアプリ（React UI と Rust側）
- `packages/ui/`：shadcn/uiコンポーネント、tweakcnトークン、共通UI資産
- `docs/`：要求・設計・ADR・API契約・UX規約
- `.claude/`：Claude Code運用資産（rules/agents/skills）
- `.cursor/`：Cursor Agent運用資産（rules）

---

## 4. システムアーキテクチャ概要
### 4.1 コンポーネント
1) **Python Backend（FastAPI）**
- 外部I/OをAPI層で受け、検証/認可/エラーモデルを統一
- ビジネスロジックは `services/` に集約
- 永続化/外部接続は `repositories/` に隔離
- 設定・ロギング・例外基盤は `core/`

2) **Tauri Desktop**
- UI：React（shadcn/ui）+ tweakcn tokens
- ネイティブ機能やOS連携：Rust（`src-tauri/`）
- Python Backendとの接続方式は、プロジェクト要件に応じて以下のいずれかを採用（ADRで固定）
  - A) ローカルHTTP（localhostでFastAPIを起動しWebViewからfetch）
  - B) Tauri IPC経由（Rustが仲介し、Pythonをサブプロセス/サービスとして扱う）
  - C) Workers/R2等のクラウドAPI（オフライン要件が低い場合）

3) **Shared UI Package（packages/ui）**
- shadcn/uiコンポーネントを共通化
- tweakcnトークンを“唯一の真実”として反映・運用
- 将来的に複数アプリ/画面が増えても一貫性維持

### 4.2 データ境界
- UIは “表示・入力” に集中し、ドメイン判断はBackendへ寄せる
- Rust側は “OS統合/起動/権限/IPC安全化” に集中し、ビジネスロジックを肥大化させない

---

## 5. 詳細仕様（運用・品質・設計規約）
### 5.1 Python Backend 規約
- レイヤ分離：`api -> services -> repositories`
- エラーモデル統一（例：`{code, message, details}`）
- 設定は環境変数 + `core/config`（`.env.example`のみコミット）
- テスト：unit中心（servicesを主対象）、API契約はintegrationで最低限

### 5.2 Frontend/UI 規約（shadcn/ui + tweakcn）
- `features/`：画面/ユースケース単位の状態とロジック
- `components/`：汎用UI（propsが明確な小コンポーネント）
- 可能な限り tokens を使用し、ハードコードを避ける（色/余白/角丸など）
- a11y：ラベル、フォーカス、キーボード操作、ダイアログのフォーカストラップを必須

### 5.3 Tauri/Rust 規約
- IPC/コマンドは入力スキーマを明確化、エラーを安全に返す
- ブロッキング処理は避け、非同期/別スレッドで扱う
- OSアクセス（ファイル、資格情報、ネットワーク）は最小権限で、ログに個人情報/秘密情報を出さない

### 5.4 ドキュメント規約
- 重要な技術判断は `docs/ADR/` に記録（採用/不採用理由）
- API契約は `docs/API/`（最低限、変更理由と影響範囲を残す）
- UX規約とtokens運用は `docs/UX/` に集約

---

## 6. Subagent 仕様（役割と起動タイミング）
以下を “標準チーム編成（最小構成）” とする。

1) `backend-engineer`
- 対象：backend配下の実装、API、services、tests
- 起動：backendタスク実装時

2) `frontend-engineer`
- 対象：React UI / packages/ui / tokens
- 起動：UI実装・改修時

3) `test-engineer`
- 対象：回帰テスト生成、境界ケース、テスト不足の補完
- 起動：仕様追加/バグ修正/リファクタ後、またはPR前のゲート

4) `code-reviewer`
- 対象：差分レビュー（品質、保守性、落とし穴）
- 起動：各マイルストーン終了時、PR作成前

5) `security-auditor`
- 対象：入力検証、秘密情報、依存追加、IPC境界、OSアクセス
- 起動：外部I/O追加、依存追加、IPC導入/変更のときは必須

6) `release-engineer`
- 対象：Tauriビルド/配布手順、バージョニング、成果物作成
- 起動：リリース前、またはCI/配布設計導入時

---

## 7. Skills 要件定義（“必要なSkills”を役割で明示）
このプロジェクトで必要なSkillsを、**目的・入力・出力・適用タイミング・受入条件**で定義する。  
（実装/選定はユーザーが行う）

### 7.1 Planning / Execution Orchestration
**SKILL: Plan-to-Implementation (Orchestrator)**
- 目的：Cursorの計画書を、Claude Codeが実装可能な手順に変換
- 入力：実装計画（WBS/受入基準/影響範囲/ファイル候補）
- 出力：タスク順序、変更ファイル一覧、実装チェックリスト、実行コマンド、完了条件
- タイミング：実装開始時に必須
- 受入条件：各タスクが「変更箇所」「完了定義」「テスト」を含む

### 7.2 Backend Standards
**SKILL: Python Backend Architecture Standard**
- 目的：api/services/repositoriesの分離、例外/ログ/設定の統一
- 入力：要件、API案、既存コード構造
- 出力：配置先、関数/クラス設計、例外設計、テスト方針
- タイミング：backend新規/改修時
- 受入条件：レイヤ逸脱がない、テストが追加される

**SKILL: Backend Testing Standard**
- 目的：unit主導での回帰防止
- 入力：変更点、バグ報告、期待挙動
- 出力：テストケース表 + 実装（pytest）
- タイミング：挙動変更/バグ修正のたびに必須
- 受入条件：失敗→修正→成功の再現ができる

### 7.3 Desktop / IPC
**SKILL: Tauri IPC & Security Standard**
- 目的：IPC設計と安全な入出力、エラーモデル整合
- 入力：必要なコマンド/権限/データフロー
- 出力：IPCコマンド仕様、入力スキーマ、エラー規約、最小権限設計
- タイミング：IPC導入/変更時に必須
- 受入条件：入力検証があり、機密がログに出ない

**SKILL: Tauri Build & Release Standard**
- 目的：再現可能なビルドと配布手順の標準化
- 入力：ターゲットOS、署名要件、成果物仕様
- 出力：手順書、コマンド、バージョニング、チェックリスト
- タイミング：CI/配布導入、リリース前
- 受入条件：第三者が同じ手順で成果物生成できる

### 7.4 UI / Design System
**SKILL: shadcn/ui Component Authoring Standard**
- 目的：コンポーネント分割・命名・variants・a11yを標準化
- 入力：画面要件、デザイン指針、既存コンポーネント
- 出力：コンポーネント設計、props設計、利用例、a11yチェック
- タイミング：UI実装/改修時
- 受入条件：再利用可能、a11y要件を満たす

**SKILL: tweakcn Token Workflow**
- 目的：tokensを唯一の真実にし、更新の影響を管理
- 入力：tokens変更要求、色/余白/タイポ変更
- 出力：変更手順、影響箇所、回帰チェック、移行ガイド
- タイミング：tokens変更時に必須
- 受入条件：影響範囲が列挙され、UI崩れ検知がある

### 7.5 Quality Gates
**SKILL: PR Review Playbook**
- 目的：レビュー観点の固定（正確性、保守性、性能、セキュリティ、テスト）
- 入力：差分、変更理由
- 出力：指摘一覧（優先度付き）+ 最小修正提案
- タイミング：PR作成前・マイルストーンごと
- 受入条件：重大欠陥の見落としが減る（チェックが網羅的）

**SKILL: ADR Writer**
- 目的：設計判断を短時間で記録し、後から辿れる状態にする
- 入力：判断テーマ、採用案、却下案、理由
- 出力：ADRテンプレでの文書化
- タイミング：設計判断のたび
- 受入条件：採用理由・トレードオフ・影響が明記される

### 7.6 Skills 作成/更新ワークフロー（skills-creator 連携）
- 目的：skills-creator を使ってスキル定義を一貫した形式で作成・更新する
- 参照元：Anthropic `skills` リポジトリの `template/` と `spec/` を基準にする
- 導入手順（Marketplace + Project scope を採用）：
  1) `/plugin marketplace add anthropics/skills`
  2) `/plugin install example-skills@anthropic-agent-skills --scope project`
  3) `/plugin install document-skills@anthropic-agent-skills --scope project`
- 作成フロー（skill-creator）：
  1) 要件ヒアリング（対象・用途・発動トリガー・使用例）
  2) `python init_skill.py <skill-name> --path skills/public`
  3) `SKILL.md` とリソース（scripts/references/assets）を調整
  4) `python quick_validate.py <skill-dir>`
  5) `python package_skill.py <skill-dir> ./dist`
- 配置ルール：
  - `.claude/skills/<skill-name>/` に配置する
  - `SKILL.md` の `name` と `description` を必須とし、`version`/`author` は `metadata` 配下に置く
- 更新手順：
  - 変更理由と影響範囲を明記し、該当Skillの受入条件を再確認する
  - SoT（`docs/spec.md`）のSkills一覧を更新する

---

## 8. 運用フロー（Codex → Claude Code の引き渡し形式）
### 8.1 Planner（Cursor Codex）の成果物フォーマット（必須）
以下の形で `docs/` に生成し、Claude Codeへ渡す。

- `docs/PRD.md`：要求、ユーザーストーリー、非機能、制約
- `docs/ARCHITECTURE.md`：構成、境界、データフロー、採用方式（A/B/C）
- `docs/ADR/000x-*.md`：重要判断（接続方式、状態管理、認証、永続化など）
- `docs/TASKS.md`：WBS（以下のテンプレ）

#### `docs/TASKS.md` テンプレ
- Milestone 1: <name>
  - Task 1: <title>
    - Goal:
    - Files to touch:
    - Implementation steps:
    - Tests:
    - Acceptance criteria:
    - Risks/notes:
  - Task 2: ...

### 8.2 Implementer（Claude Code）の実行ルール（必須）
- `docs/TASKS.md` の順序に従い、タスクごとに小さな差分で実装
- 各タスク完了時に以下を残す
  - 変更ファイル一覧
  - 実行したコマンド
  - テスト結果
  - 次にやること（残タスク）

---

## 9. 初期セットアップ要件（プロジェクト起動に必要な最小条件）
- Backend起動手順とテスト手順が `backend/README.md` にある
- Desktop起動手順が `apps/desktop/README.md` または root `README.md` にある
- tokens運用が `docs/UX/tweakcn-tokens.md` にある
- ルールが `.claude/rules` と `.cursor/rules` に配置済み
- Subagentsが `.claude/agents` に配置済み

---

## 10. Codex への指示（この仕様を元に“最初にやるべきプランニング”）
Codexは以下を実施すること。

1) この仕様を読み、現状（空のrepo想定）から「初期セットアップのWBS」を `docs/TASKS.md` に作成
2) Milestoneを最低でも3つ作る
   - M1: Repo scaffolding & tooling
   - M2: Backend skeleton + health endpoints + tests
   - M3: Desktop skeleton + UI baseline + backend connectivity (ADRで方式を固定)
3) 各タスクに「変更ファイル」「完了定義」「テスト」を必ず書く
4) Claude Codeが迷わないように、コマンドや生成物を具体化する
5) ルール/agentsの雛形ファイルも、タスクとして生成対象に含める（本文はこの仕様に準拠）

---

## 11. SoT運用ルール（必須）
- `docs/spec.md` は **唯一の正**。
- PRD / ARCHITECTURE / ADR / TASKS / UX docs は **派生ドキュメント**。
- 矛盾が発生した場合は **SoTを修正し、派生ドキュメントを追従更新**する。
- UXフロー・役割分離・Skills定義は SoT に必ず集約する。

---

## 12. UI/UX デザイン生産ライン（スクショ入力対応）
### 12.1 全体フロー
1) **人（あなた）**
   - 入力：
     - 紙のラフ（写真可）
     - 箇条書きの意図
     - 既存UIのスクリーンショット（Web / アプリ / 他社プロダクト可）
   - 伝える内容（最低限）：
     - 「ここを参考にしたい」
     - 「この要素はいらない」
     - 「雰囲気だけ近づけたい」
     - 「この操作感は再現したい」

2) **Claude Code / Subagent `ux-designer`**
   - 役割：入力（ラフ・スクショ・意図）を **実装可能なUI/UX仕様（文章）に翻訳**
   - 禁止事項：
     - コード生成
     - デザインの無断コピー（表層模倣）
   - 必須対応：
     - スクリーンショットは **「構造・情報設計・操作意図」のみ抽出**
     - 色・余白・フォントは tokens / shadcn/ui 前提で再解釈
   - 出力先：`docs/UX/`

3) **Cursor Codex（Planner）**
   - UX仕様を PRD / ARCHITECTURE / TASKS に統合
   - 実装観点で抜け漏れを整理し、受入基準へ変換
   - **コード生成は禁止**

4) **Claude Code / frontend-engineer**
   - UX仕様を忠実に実装
   - 勝手なUI判断・追加は禁止

5) **Claude Code / UI Spec Compliance Checker**
   - 実装がUX仕様に準拠しているかを検査

---

## 13. 新規Subagent定義（Codexが雛形作成）
### `.claude/agents/ux-designer.md`（要件）
- UI/UX設計専門（**文書のみ**）
- 入力形式：
  - テキスト
  - 紙ラフの説明
  - スクリーンショットの説明
- スクリーンショット解析方針：
  - レイアウト構造
  - 情報の優先順位
  - 操作フロー
  - 状態変化
- 禁止：
  - スタイルの直接コピー
  - 実装前提の技術決定

---

## 14. 追加Skills（SoTへ追記）
### UI/UX Specification Translator（スクショ対応）
- 目的：ラフ・スクショ・メモを UI/UX仕様に変換
- 入力：
  - 紙ラフ／文章
  - 既存UIのスクリーンショット（参考用）
  - MVP条件
- 出力：
  - 画面概要
  - 情報設計
  - レイアウト構造（文章）
  - 操作フロー
  - 状態一覧
  - UX注意点
- 受入条件：
  - スクリーンショット由来要素が「採用/不採用/再解釈」で明示されている

### UI Spec Compliance Checker
- 既存定義のまま（変更なし）

---

## 15. UX仕様書 標準フォーマット（`docs/UX/ui-guidelines.md`に追加）
- 画面名 / 目的
- 参考にした入力
  - 紙ラフ: 有/無
  - スクリーンショット: 有/無（URL/説明）
- 抽出した意図（参考UIから何を学んだか）
- 採用要素 / 不採用要素
- 情報設計（優先度）
- レイアウト構造（文章）
- コンポーネント（抽象名）
- 操作フロー
- 状態一覧（初期/ローディング/空/正常/エラー）
- a11y配慮
- 受入基準（Given/When/Then）

---

## 16. 人がやること（明文化）
- 紙ラフ or スクリーンショットを渡す
- 「近づけたい/避けたい」を一言で添える
- UX仕様を見て **OK / 修正点 / 今回不要** を返す
- 技術判断や実装判断は行わない

---

## 17. Codexへの実行指示（追記）
1) `docs/spec.md` を本仕様に従って更新
2) UX生産ライン・スクショ入力対応を SoT に追記
3) `ux-designer` Subagent と関連ルールを文書として追加
4) UXテンプレを `docs/UX/` に追加
5) TASKS に UX工程を反映
6) **Cursor Codexは計画・文書化・WBS化のみ行い、コードは絶対に書かない**

以上。
