---
name: adr-writer
description: 設計判断を短時間で記録し、後から辿れる状態にするADR作成スキル。判断テーマ、採用案、却下案、理由を入力とし、ADRテンプレでの文書化を出力する。設計判断のたびに使用する。採用理由・トレードオフ・影響が明記されることを受入条件とする。
---

# ADR Writer

設計判断を短時間で記録し、後から辿れる状態にする。

## 入力

- 判断テーマ
- 採用案
- 却下案
- 理由

## 出力

- ADR文書（docs/ADR/配下）

## ADR テンプレート

```markdown
# ADR [番号]: [タイトル]

## Status
- [Proposed / Accepted / Deprecated / Superseded by ADR-XXX]

## Context
[判断が必要になった背景・状況]

## Decision
[採用した決定内容]

## Alternatives Considered
### [却下案1]
- 概要: [説明]
- 却下理由: [理由]

### [却下案2]
- 概要: [説明]
- 却下理由: [理由]

## Consequences
### Positive
- [良い影響1]
- [良い影響2]

### Negative
- [悪い影響1]
- [悪い影響2]

### Risks
- [リスク1]
- [リスク2]
```

## 命名規則

- ファイル名: `NNNN-kebab-case-title.md`
- 例: `0001-tech-stack.md`, `0002-api-conventions.md`

## ワークフロー

1. 判断テーマを明確にする
2. 選択肢（案）を列挙する
3. 各選択肢のトレードオフを分析する
4. 採用案を決定する
5. ADR テンプレートに従って文書化する
6. docs/ADR/ に配置する

## 書き方のコツ

- Context は「なぜこの判断が必要か」を簡潔に
- Decision は「何を決めたか」を明確に
- Consequences は「影響」を正直に
- 将来の自分や他者が読むことを意識する

## 受入条件

- 判断テーマが明確
- 採用理由が記載されている
- 却下案とその理由が記載されている
- トレードオフが分析されている
- 影響（Consequences）が明記されている
- docs/ADR/ に配置されている
