# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

マインスイーパーWebアプリケーション - 個人学習用プロジェクト

### Purpose
- フロントエンド技術の学習
- モダンなWeb開発のベストプラクティスの習得
- テスト駆動開発（TDD）の実践

## Technology Stack

### Core
- **Framework**: React 18+
- **Language**: TypeScript
- **Build Tool**: Vite
- **Package Manager**: npm

### Styling
- **CSS Modules**: スコープ付きCSSによるスタイリング

### Testing
- **Test Framework**: Vitest
- **Testing Library**: React Testing Library
- **Coverage Tool**: Vitest coverage (c8/istanbul)

### Code Quality
- **Linter**: ESLint
- **Formatter**: Prettier
- **Git Hooks**: (Optional) Husky + lint-staged

## Feature Requirements

### 優先度：高（必須実装）

#### 基本ゲーム機能
- ✅ グリッドベースのゲームボード表示
- ✅ セルのクリック操作（左クリック）
  - 地雷セルをクリック → ゲームオーバー
  - 数字セル（周囲の地雷数表示）をクリック → そのセルのみ開く
  - 空セルをクリック → そのセルのみ開く（連鎖オープンなし）
- ✅ フラグ設置機能（右クリック）
  - 地雷と思われるセルにフラグを立てる
  - フラグを立てたセルは開けない
  - フラグの切り替え（未設置 → フラグ → 未設置）
- ✅ ゲーム状態管理
  - プレイ中（Playing）
  - クリア（Won）
  - ゲームオーバー（Lost）
- ✅ タイマー機能
  - 最初のセルをクリックした時点から計測開始
  - ゲーム終了まで計測
  - 秒単位で表示
- ✅ 地雷残数表示
  - 総地雷数 - 設置済みフラグ数

#### 難易度選択
- ✅ 3つの難易度プリセット
  - **初級（Beginner）**: 9×9グリッド、地雷10個
  - **中級（Intermediate）**: 16×16グリッド、地雷40個
  - **上級（Expert）**: 16×30グリッド、地雷99個
- ✅ ゲーム開始前またはリスタート時に難易度を選択可能

#### スコア・記録機能
- ✅ ベストタイム記録（LocalStorageに保存）
  - 難易度ごとに記録
  - クリア時のタイムを自動保存
  - 最速記録のみ保持
- ✅ 記録画面（別画面）
  - 各難易度のベストタイムを一覧表示
  - 記録がない場合は「--:--」等で表示
  - 記録のリセット機能（Optional）

### 優先度：低（後で対応可能）

以下の機能は将来的な拡張として実装可能な設計にすること：

- ⭕ ゲームのポーズ機能
- ⭕ アニメーション・エフェクト（セルを開く際のアニメーション等）
- ⭕ ダークモード
- ⭕ サウンドエフェクト
- ⭕ カスタム難易度設定（グリッドサイズと地雷数を自由に設定）
- ⭕ 統計情報（総プレイ回数、勝率等）

## Game Rules & Specifications

### ゲームフロー
1. 難易度選択画面でプリセットを選択
2. ゲームボードが生成される
3. プレイヤーが最初のセルをクリック → タイマー開始
4. セルを開いていく
   - 地雷を踏む → ゲームオーバー
   - すべての安全セルを開く → クリア
5. ゲーム終了後
   - クリアの場合、ベストタイム更新をチェック
   - リスタートまたは難易度変更

### セルの状態
- **未開封（Closed）**: 初期状態、グレーで表示
- **開封済み（Opened）**: クリック後の状態
  - 空セル: 周囲に地雷なし
  - 数字セル: 1-8の数字で周囲の地雷数を表示
  - 地雷セル: 地雷アイコン表示（ゲームオーバー時のみ）
- **フラグ設置（Flagged）**: 右クリックでフラグを立てた状態

### 地雷配置ロジック
- 最初のクリック後に地雷を配置（初回クリックで地雷を踏まないようにする）
- 指定された数の地雷をランダムに配置
- 最初にクリックしたセルとその周囲8マスには地雷を配置しない

### クリア条件
- すべての安全セル（地雷以外のセル）を開封する
- フラグをすべての地雷に立てる必要はない

## Project Structure

```
minesweeper/
├── src/
│   ├── components/         # React コンポーネント
│   │   ├── GameBoard/      # ゲームボード
│   │   ├── Cell/           # セルコンポーネント
│   │   ├── GameHeader/     # ヘッダー（タイマー、地雷数表示）
│   │   ├── DifficultySelector/ # 難易度選択
│   │   ├── RecordsScreen/  # ベストタイム記録画面
│   │   └── ...
│   ├── hooks/              # カスタムフック
│   │   ├── useGame.ts      # ゲームロジック
│   │   ├── useTimer.ts     # タイマー
│   │   └── useRecords.ts   # 記録管理
│   ├── types/              # TypeScript型定義
│   │   └── game.ts
│   ├── utils/              # ユーティリティ関数
│   │   ├── gameLogic.ts    # 地雷配置、周囲地雷数計算等
│   │   └── storage.ts      # LocalStorage操作
│   ├── constants/          # 定数定義
│   │   └── difficulty.ts   # 難易度設定
│   ├── App.tsx             # ルートコンポーネント
│   ├── App.module.css      # グローバルスタイル
│   └── main.tsx            # エントリーポイント
├── tests/                  # テストファイル（__tests__でも可）
├── public/                 # 静的ファイル
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── .eslintrc.cjs
├── .prettierrc
└── README.md
```

## Development Setup

### Prerequisites
- Node.js 18+
- npm 9+

### Installation
```bash
npm create vite@latest . -- --template react-ts
npm install
```

### Development Commands
```bash
npm run dev          # 開発サーバー起動
npm run build        # 本番ビルド
npm run preview      # ビルド結果のプレビュー
npm run test         # テスト実行
npm run test:ui      # テストUI起動
npm run coverage     # カバレッジ計測
npm run lint         # ESLint実行
npm run format       # Prettier実行
```

## Testing Strategy

### テスト方針（重要）

#### グローバルルール（CLAUDE.mdより）
- ✅ テストは必ず実際の機能を検証すること
- ❌ `expect(true).toBe(true)` のような意味のないアサーションは絶対に書かない
- ✅ 各テストケースは具体的な入力と期待される出力を検証すること
- ✅ モックは必要最小限に留め、実際の動作に近い形でテストすること
- ❌ テストを通すためだけのハードコードは絶対に禁止
- ❌ 本番コードに `if (testMode)` のような条件分岐を入れない
- ✅ 境界値、異常値、エラーケースを必ずテストすること

#### テスト実装の原則
- Red-Green-Refactor サイクルを守る
- テストケース名は日本語でも可（何をテストしているか明確に）
- カバレッジ目標: 80%以上（ただし質を重視）

### テスト対象

#### Unit Tests（優先度：高）
- `utils/gameLogic.ts`: 地雷配置、周囲地雷数計算等のロジック
- `utils/storage.ts`: LocalStorage操作
- Custom Hooks: `useGame`, `useTimer`, `useRecords`

#### Component Tests（優先度：高）
- `Cell`: セルの状態表示、クリックイベント
- `GameBoard`: ボード表示、ゲームロジック統合
- `GameHeader`: タイマー、地雷数表示
- `DifficultySelector`: 難易度選択
- `RecordsScreen`: 記録表示

#### Integration Tests（優先度：中）
- ゲーム全体のフロー
- 難易度変更からゲームプレイまでの一連の流れ

### カバレッジ除外
- `main.tsx`: エントリーポイント
- 型定義ファイル
- 設定ファイル

## Coding Guidelines

### TypeScript
- `strict: true` を有効にする
- `any` 型の使用を避ける
- 適切な型定義とインターフェースを作成する

### React
- 関数コンポーネントを使用
- カスタムフックでロジックを分離
- Propsの型定義を必須とする
- useCallback/useMemoを適切に使用

### CSS Modules
- コンポーネントごとに `.module.css` ファイルを作成
- クラス名はcamelCaseを使用
- グローバルスタイルは最小限に

### Naming Conventions
- コンポーネント: PascalCase（例: `GameBoard.tsx`）
- 関数・変数: camelCase（例: `calculateMines`）
- 定数: UPPER_SNAKE_CASE（例: `MAX_GRID_SIZE`）
- CSS Modules: camelCase（例: `.gameBoard`）

### Git Workflow
- コミットメッセージ: 英語または日本語で明確に
- ブランチ: `feature/機能名`, `fix/バグ内容` 等

## Performance Considerations

- 大きなグリッド（上級：16×30）でも快適に動作すること
- 不要な再レンダリングを避ける（React.memo、useCallback等）
- LocalStorageへの書き込みは必要最小限に

## Browser Support

- モダンブラウザ（Chrome, Firefox, Safari, Edge 最新版）
- レスポンシブ対応は優先度低（デスクトップ優先）

## Future Enhancements

以下は将来的な拡張候補として記録：

1. オンラインランキング機能（バックエンド連携）
2. マルチプレイヤーモード
3. カスタムテーマ・スキン機能
4. アクセシビリティ対応（キーボード操作、スクリーンリーダー対応）
5. PWA対応（オフライン動作、インストール可能）

## Notes

- このプロジェクトは学習目的であるため、コードの可読性と保守性を重視する
- 新しい機能を追加する際は、このCLAUDE.mdファイルを更新すること
- テストを書いてから実装する（TDD）を心がける
