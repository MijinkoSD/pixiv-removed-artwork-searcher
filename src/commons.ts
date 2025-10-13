/**
 * 詳細なログを出力する
 */
export const isOutDetailLog = true

/**
 * 拡張機能の識別子 \
 * 主にDOMのクラス名に使用される
 */
export const extensionIdentifier = 'pras'

/**
 * 拡張機能の名前
 */
export const extensionName = 'Pixiv Removed Artwork Searcher'

export const printDebugLog = (...messages: unknown[]) => {
  if (!isOutDetailLog) return
  console.debug(`${extensionName}:`, ...messages)
}
