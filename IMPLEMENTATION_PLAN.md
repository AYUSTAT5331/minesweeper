# マインスイーパーアプリ 実装計画

## 📌 概要

このドキュメントは、CLAUDE.mdに基づいたマインスイーパーアプリケーションの実装計画です。
TDD（テスト駆動開発）を基本とし、段階的に機能を実装していきます。

---

## Phase 1: プロジェクトセットアップ

### 1.1 Viteプロジェクトの初期化
- [x] `npm create vite@latest . -- --template react-ts` でプロジェクト作成
- [x] 不要なデフォルトファイルの削除
  - [x] `src/App.css` 削除
  - [x] `src/index.css` 削除（または最小限のリセットCSSに置き換え）
  - [x] デフォルトのアセット削除
- [x] `package.json` の確認・更新

### 1.2 依存パッケージのインストール
- [x] テスト関連
  ```bash
  npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
  ```
- [x] コード品質ツール
  ```bash
  npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
  npm install -D prettier eslint-config-prettier eslint-plugin-prettier
  npm install -D eslint-plugin-react eslint-plugin-react-hooks
  ```
- [x] カバレッジツール
  ```bash
  npm install -D @vitest/coverage-v8
  ```

### 1.3 設定ファイルの作成
- [x] `vitest.config.ts` 作成
  - [x] jsdom環境設定
  - [x] setupFilesの設定
  - [x] カバレッジ設定
- [x] `src/test/setup.ts` 作成（Testing Library設定）
- [x] `.eslintrc.cjs` 作成
  - [x] TypeScript, React ルール設定
  - [x] Prettier統合
- [x] `.prettierrc` 作成
  - [x] コードフォーマットルール設定
- [x] `.eslintignore` と `.prettierignore` 作成
- [x] `tsconfig.json` の調整（strict: true 確認）

### 1.4 npm scripts の追加
- [x] `package.json` にスクリプト追加
  ```json
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\""
  }
  ```

### 1.5 動作確認
- [x] `npm run dev` でローカルサーバー起動確認
- [x] `npm run lint` でリンター動作確認
- [x] `npm run test` でテスト実行確認

---

## Phase 2: プロジェクト構造の作成

### 2.1 ディレクトリ構成
- [x] `src/components/` ディレクトリ作成
- [x] `src/hooks/` ディレクトリ作成
- [x] `src/types/` ディレクトリ作成
- [x] `src/utils/` ディレクトリ作成
- [x] `src/constants/` ディレクトリ作成
- [x] `src/test/` ディレクトリ作成（セットアップファイル用）

### 2.2 .gitignore の確認
- [x] `node_modules/`, `dist/`, `coverage/` 等が含まれているか確認

---

## Phase 3: 型定義と定数の作成

### 3.1 型定義 (`src/types/game.ts`)
- [x] `CellState` 型定義
  - Closed, Opened, Flagged
- [x] `CellValue` 型定義
  - Empty (0), Mine (-1), Number (1-8)
- [x] `Cell` インターフェース
  - state, value, row, col
- [x] `GameStatus` 型定義
  - Idle, Playing, Won, Lost
- [x] `Difficulty` 型定義
  - Beginner, Intermediate, Expert
- [x] `DifficultyConfig` インターフェース
  - rows, cols, mines
- [x] `GameRecord` インターフェース
  - difficulty, time, date

### 3.2 定数定義 (`src/constants/difficulty.ts`)
- [x] 難易度設定の定数
  ```typescript
  export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
    Beginner: { rows: 9, cols: 9, mines: 10 },
    Intermediate: { rows: 16, cols: 16, mines: 40 },
    Expert: { rows: 16, cols: 30, mines: 99 }
  }
  ```
- [x] LocalStorageキー名の定数
- [x] その他のゲーム定数（必要に応じて）

---

## Phase 4: ユーティリティ関数の実装（TDD）

### 4.1 `src/utils/gameLogic.ts`

#### テスト作成: `src/utils/__tests__/gameLogic.test.ts`
- [x] `createEmptyBoard` のテスト
  - [x] 指定サイズのボードが作成されるか
  - [x] すべてのセルが初期状態か
- [x] `placeMines` のテスト
  - [x] 指定された数の地雷が配置されるか
  - [x] 最初のクリック位置とその周囲に地雷がないか
  - [x] 地雷がランダムに配置されるか（複数回実行）
  - [x] 境界値テスト（最小・最大地雷数）
- [x] `calculateAdjacentMines` のテスト
  - [x] 各セルの周囲地雷数が正しく計算されるか
  - [x] 端やコーナーのセルで正しく計算されるか
  - [x] 地雷セルはスキップされるか
- [x] `revealCell` のテスト
  - [x] セルを開く処理が正しいか
  - [x] 地雷セルを開いた場合の処理
  - [x] 数字セルを開いた場合の処理
  - [x] フラグ付きセルは開けないか
- [x] `checkWinCondition` のテスト
  - [x] すべての安全セルを開いたらtrue
  - [x] 未開封セルが残っていればfalse
  - [x] 地雷セルは無視されるか

#### 実装: `src/utils/gameLogic.ts`
- [x] `createEmptyBoard` 実装
- [x] `placeMines` 実装
- [x] `calculateAdjacentMines` 実装
- [x] `revealCell` 実装
- [x] `checkWinCondition` 実装
- [x] すべてのテストがパスすることを確認

### 4.2 `src/utils/storage.ts`

#### テスト作成: `src/utils/__tests__/storage.test.ts`
- [x] `saveRecord` のテスト
  - [x] 記録が正しく保存されるか
  - [x] 既存の記録より速い場合のみ更新されるか
  - [x] LocalStorageのモック
- [x] `getRecord` のテスト
  - [x] 保存された記録を正しく取得できるか
  - [x] 記録がない場合はnullを返すか
- [x] `getAllRecords` のテスト
  - [x] すべての難易度の記録を取得できるか
- [x] `clearRecord` のテスト
  - [x] 指定された難易度の記録を削除できるか
- [x] `clearAllRecords` のテスト（Optional）
  - [x] すべての記録を削除できるか
- [x] エラーハンドリングのテスト
  - [x] LocalStorageが使えない場合の処理

#### 実装: `src/utils/storage.ts`
- [x] `saveRecord` 実装
- [x] `getRecord` 実装
- [x] `getAllRecords` 実装
- [x] `clearRecord` 実装
- [x] `clearAllRecords` 実装（Optional）
- [x] すべてのテストがパスすることを確認

---

## Phase 5: カスタムフックの実装（TDD）

### 5.1 `src/hooks/useTimer.ts`

#### テスト作成: `src/hooks/__tests__/useTimer.test.ts`
- [ ] タイマーの開始テスト
- [ ] タイマーの停止テスト
- [ ] タイマーのリセットテスト
- [ ] 秒数のカウントアップテスト
- [ ] 自動的にクリーンアップされるか

#### 実装: `src/hooks/useTimer.ts`
- [ ] `useTimer` フック実装
  - [ ] `time` state
  - [ ] `isRunning` state
  - [ ] `start` function
  - [ ] `stop` function
  - [ ] `reset` function
  - [ ] useEffect でタイマー処理
- [ ] すべてのテストがパスすることを確認

### 5.2 `src/hooks/useRecords.ts`

#### テスト作成: `src/hooks/__tests__/useRecords.test.ts`
- [ ] 記録の取得テスト
- [ ] 記録の保存テスト
- [ ] 記録の削除テスト
- [ ] ベストタイム更新判定テスト

#### 実装: `src/hooks/useRecords.ts`
- [ ] `useRecords` フック実装
  - [ ] `records` state
  - [ ] `saveRecord` function
  - [ ] `getRecord` function
  - [ ] `clearRecord` function
  - [ ] storage.ts との連携
- [ ] すべてのテストがパスすることを確認

### 5.3 `src/hooks/useGame.ts`

#### テスト作成: `src/hooks/__tests__/useGame.test.ts`
- [ ] ゲーム初期化テスト
- [ ] 難易度変更テスト
- [ ] セルクリックテスト
  - [ ] 最初のクリックで地雷配置
  - [ ] タイマー開始
  - [ ] セルが開く
- [ ] フラグ設置テスト
  - [ ] フラグの切り替え
  - [ ] 地雷残数の更新
- [ ] ゲームクリアテスト
  - [ ] すべての安全セルを開いたらクリア
- [ ] ゲームオーバーテスト
  - [ ] 地雷を踏んだらゲームオーバー
- [ ] リスタートテスト

#### 実装: `src/hooks/useGame.ts`
- [ ] `useGame` フック実装
  - [ ] `board` state
  - [ ] `gameStatus` state
  - [ ] `difficulty` state
  - [ ] `minesRemaining` state
  - [ ] `initGame` function
  - [ ] `handleCellClick` function
  - [ ] `handleCellRightClick` function
  - [ ] `restartGame` function
  - [ ] `changeDifficulty` function
  - [ ] useTimer との連携
- [ ] すべてのテストがパスすることを確認

---

## Phase 6: コンポーネントの実装（TDD）

### 6.1 `src/components/Cell/`

#### ファイル作成
- [ ] `Cell.tsx` 作成
- [ ] `Cell.module.css` 作成
- [ ] `__tests__/Cell.test.tsx` 作成

#### テスト作成: `__tests__/Cell.test.tsx`
- [ ] セルの状態による表示テスト
  - [ ] Closed状態の表示
  - [ ] Opened状態の表示（空、数字、地雷）
  - [ ] Flagged状態の表示
- [ ] クリックイベントテスト
  - [ ] 左クリックで onClick が呼ばれるか
  - [ ] 右クリックで onRightClick が呼ばれるか
  - [ ] Opened状態ではクリックできないか
- [ ] スタイルのテスト（必要に応じて）

#### 実装: `Cell.tsx`
- [ ] Cell コンポーネント実装
  - [ ] Props型定義
  - [ ] セルの状態による表示分岐
  - [ ] イベントハンドラー
- [ ] `Cell.module.css` でスタイリング
  - [ ] 基本スタイル
  - [ ] 状態別スタイル
  - [ ] 数字別の色分け（1-8）
- [ ] すべてのテストがパスすることを確認

### 6.2 `src/components/GameHeader/`

#### ファイル作成
- [ ] `GameHeader.tsx` 作成
- [ ] `GameHeader.module.css` 作成
- [ ] `__tests__/GameHeader.test.tsx` 作成

#### テスト作成: `__tests__/GameHeader.test.tsx`
- [ ] タイマー表示テスト
- [ ] 地雷残数表示テスト
- [ ] リスタートボタンテスト
- [ ] 難易度変更ボタンテスト（あれば）
- [ ] ゲーム状態による表示変更テスト

#### 実装: `GameHeader.tsx`
- [ ] GameHeader コンポーネント実装
  - [ ] Props型定義
  - [ ] タイマー表示
  - [ ] 地雷残数表示
  - [ ] リスタートボタン
  - [ ] ゲーム状態表示（絵文字等）
- [ ] `GameHeader.module.css` でスタイリング
- [ ] すべてのテストがパスすることを確認

### 6.3 `src/components/DifficultySelector/`

#### ファイル作成
- [ ] `DifficultySelector.tsx` 作成
- [ ] `DifficultySelector.module.css` 作成
- [ ] `__tests__/DifficultySelector.test.tsx` 作成

#### テスト作成: `__tests__/DifficultySelector.test.tsx`
- [ ] 3つの難易度ボタンが表示されるか
- [ ] ボタンクリックで onSelect が呼ばれるか
- [ ] 選択中の難易度がハイライトされるか
- [ ] 各難易度の詳細情報が表示されるか

#### 実装: `DifficultySelector.tsx`
- [ ] DifficultySelector コンポーネント実装
  - [ ] Props型定義
  - [ ] 難易度リストの表示
  - [ ] 選択処理
  - [ ] 選択中の難易度の表示
- [ ] `DifficultySelector.module.css` でスタイリング
- [ ] すべてのテストがパスすることを確認

### 6.4 `src/components/GameBoard/`

#### ファイル作成
- [ ] `GameBoard.tsx` 作成
- [ ] `GameBoard.module.css` 作成
- [ ] `__tests__/GameBoard.test.tsx` 作成

#### テスト作成: `__tests__/GameBoard.test.tsx`
- [ ] ボードが正しいサイズで表示されるか
- [ ] すべてのセルが表示されるか
- [ ] セルクリック時の処理
- [ ] useGame フックとの統合テスト
- [ ] ゲーム状態による表示変更

#### 実装: `GameBoard.tsx`
- [ ] GameBoard コンポーネント実装
  - [ ] Props型定義
  - [ ] useGame フック使用
  - [ ] GameHeader 配置
  - [ ] Cell コンポーネントのグリッド表示
  - [ ] セルへのイベント伝達
- [ ] `GameBoard.module.css` でスタイリング
  - [ ] グリッドレイアウト
  - [ ] レスポンシブ対応（優先度低）
- [ ] すべてのテストがパスすることを確認

### 6.5 `src/components/RecordsScreen/`

#### ファイル作成
- [ ] `RecordsScreen.tsx` 作成
- [ ] `RecordsScreen.module.css` 作成
- [ ] `__tests__/RecordsScreen.test.tsx` 作成

#### テスト作成: `__tests__/RecordsScreen.test.tsx`
- [ ] 各難易度の記録が表示されるか
- [ ] 記録がない場合の表示
- [ ] 戻るボタンの動作
- [ ] 記録削除ボタンの動作（Optional）
- [ ] useRecords フックとの統合

#### 実装: `RecordsScreen.tsx`
- [ ] RecordsScreen コンポーネント実装
  - [ ] Props型定義
  - [ ] useRecords フック使用
  - [ ] 記録一覧の表示
  - [ ] 記録がない場合の表示
  - [ ] 戻るボタン
  - [ ] 記録削除機能（Optional）
- [ ] `RecordsScreen.module.css` でスタイリング
- [ ] すべてのテストがパスすることを確認

### 6.6 `src/App.tsx`

#### ファイル作成
- [ ] `App.tsx` 更新
- [ ] `App.module.css` 作成
- [ ] `__tests__/App.test.tsx` 作成

#### テスト作成: `__tests__/App.test.tsx`
- [ ] アプリケーション全体の統合テスト
- [ ] 画面遷移テスト
  - [ ] 難易度選択 → ゲームプレイ
  - [ ] ゲームプレイ → 記録画面
  - [ ] 記録画面 → 難易度選択
- [ ] ゲームクリア時の記録保存テスト

#### 実装: `App.tsx`
- [ ] App コンポーネント実装
  - [ ] 画面状態管理（難易度選択、ゲーム中、記録画面）
  - [ ] DifficultySelector 配置
  - [ ] GameBoard 配置
  - [ ] RecordsScreen 配置
  - [ ] 画面遷移ロジック
- [ ] `App.module.css` でスタイリング
  - [ ] レイアウト
  - [ ] 全体的なデザイン
- [ ] すべてのテストがパスすることを確認

---

## Phase 7: スタイリングの仕上げ

### 7.1 デザインの調整
- [ ] カラースキームの統一
- [ ] フォントの選定・適用
- [ ] ボタンのホバーエフェクト
- [ ] セルのホバーエフェクト
- [ ] アニメーション（優先度低）

### 7.2 レスポンシブ対応（優先度低）
- [ ] モバイル表示の確認
- [ ] タブレット表示の確認
- [ ] 必要に応じてメディアクエリ追加

### 7.3 アクセシビリティ基本対応
- [ ] セマンティックHTML確認
- [ ] キーボード操作（優先度低）
- [ ] ARIA属性（必要に応じて）

---

## Phase 8: 統合テストと品質保証

### 8.1 統合テスト
- [ ] エンドツーエンドのゲームフロー確認
  - [ ] 難易度選択 → プレイ → クリア → 記録保存 → 記録確認
  - [ ] 難易度選択 → プレイ → ゲームオーバー → リスタート
- [ ] ブラウザでの手動テスト
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari（可能であれば）
  - [ ] Edge（可能であれば）

### 8.2 バグ修正
- [ ] テストで見つかったバグの修正
- [ ] 手動テストで見つかったバグの修正

### 8.3 コード品質チェック
- [ ] `npm run lint` でエラーがないか確認
- [ ] `npm run format` でコード整形
- [ ] `npm run test:coverage` でカバレッジ確認
  - [ ] 目標: 80%以上
  - [ ] カバレッジが低い箇所の特定と改善

### 8.4 パフォーマンス確認
- [ ] 上級難易度（16×30）で動作確認
- [ ] React DevTools でレンダリング回数確認
- [ ] 不要な再レンダリングの最適化
  - [ ] React.memo の適用検討
  - [ ] useCallback/useMemo の適用検討

---

## Phase 9: ドキュメントとデプロイ準備

### 9.1 README.md の作成
- [ ] プロジェクト概要
- [ ] 機能一覧
- [ ] スクリーンショット（Optional）
- [ ] セットアップ手順
- [ ] 使用技術
- [ ] 今後の拡張予定

### 9.2 デプロイ準備
- [ ] ビルドエラーがないか確認 (`npm run build`)
- [ ] 環境変数の確認（必要に応じて）
- [ ] デプロイ先の選定
  - [ ] GitHub Pages
  - [ ] Vercel
  - [ ] Netlify
  - [ ] その他

### 9.3 Git管理
- [ ] 適切なコミットメッセージでコミット
- [ ] ブランチ戦略の確認（必要に応じて）
- [ ] リモートリポジトリへのプッシュ

---

## Phase 10: 将来的な拡張（優先度：低）

### 実装可能な追加機能
- [ ] **連鎖オープン機能**
  - [ ] 空セル（周囲に地雷なし）をクリックした際、周囲の安全セルも自動的に開く
  - [ ] `src/utils/gameLogic.ts` の `revealCell` 関数を再帰的に実装
  - [ ] テストケースの追加
  - [ ] パフォーマンスの最適化（大きなボードでの連鎖対応）
- [ ] ゲームのポーズ機能
- [ ] アニメーション・エフェクト
- [ ] ダークモード
- [ ] サウンドエフェクト
- [ ] カスタム難易度設定
- [ ] 統計情報（総プレイ回数、勝率等）
- [ ] オンラインランキング（バックエンド必要）

---

## 📊 進捗管理

### チェックポイント
- [x] Phase 1 完了: プロジェクトセットアップ
- [x] Phase 2 完了: プロジェクト構造
- [x] Phase 3 完了: 型定義と定数
- [x] Phase 4 完了: ユーティリティ関数
- [ ] Phase 5 完了: カスタムフック
- [ ] Phase 6 完了: コンポーネント
- [ ] Phase 7 完了: スタイリング
- [ ] Phase 8 完了: 統合テストと品質保証
- [ ] Phase 9 完了: ドキュメントとデプロイ
- [ ] プロジェクト完成！🎉

---

## 📝 注意事項

1. **TDDの徹底**: テストを先に書いてから実装する
2. **テスト品質**: `expect(true).toBe(true)` のような無意味なテストは書かない
3. **ハードコーディング禁止**: テストを通すためだけのハードコードは避ける
4. **境界値テスト**: 正常系だけでなく、異常系や境界値も必ずテストする
5. **コミット頻度**: 各機能実装後に適切にコミットする
6. **コードレビュー**: 定期的に自分でコードを見直す
7. **CLAUDE.md参照**: 迷ったらCLAUDE.mdを参照する

---

## 🎯 優先順位まとめ

### 最優先（Phase 1-6）
ゲームの基本機能を完成させる

### 次優先（Phase 7-9）
品質を高め、デプロイ可能な状態にする

### 低優先（Phase 10）
追加機能の実装（時間があれば）

---

## 最終更新日
2025-12-28
