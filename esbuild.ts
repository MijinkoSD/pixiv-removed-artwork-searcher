import { build } from 'esbuild'

// distフォルダの削除
try {
  await Deno.remove('dist', { recursive: true })
} catch (error) {
  if (!(error instanceof Deno.errors.NotFound)) {
    // 削除対象が見つからないエラー以外が発生した場合はストップ
    throw error
  }
}

// ビルド
await build({
  logLevel: 'info',
  'bundle': true,
  'minify': true,

  entryPoints: ['src/main.ts'],
  'outfile': 'dist/main.mjs',
  platform: 'browser',
  format: 'esm', // ESMプロジェクトなので、出力フォーマットを'esm'に設定する必要

  banner: {
    // commonjs用ライブラリをESMプロジェクトでbundleする際に生じることのある問題への対策
    js:
      'import { createRequire } from "module"; import url from "url"; const require = createRequire(import.meta.url); const __filename = url.fileURLToPath(import.meta.url); const __dirname = url.fileURLToPath(new URL(".", import.meta.url));',
  },
})
