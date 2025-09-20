import { extensionName } from './commons.ts'
import { addDomElement } from './domUtilities.ts'
import { DomNotFoundError } from './errors/domNotFountError.ts'
import {
  addButtonToBookmark,
  getBookmarkInfo,
  getBookmarkListElement,
  isSmartPhonePage,
} from './pixivDom.ts'

/**
 * 削除済み・非公開イラストに対して検索ボタンを追加する
 */
const addSearchButtons = () => {
  const bookmarks = getBookmarkListElement()
  for (const bookmark of bookmarks.children) {
    if (!(bookmark instanceof HTMLLIElement)) {
      // リスト要素以外は参照しない
      continue
    }
    const info = getBookmarkInfo(bookmark)
    if (!info) continue
    const { illustId, userId, deleted } = info
    // 削除されていなければ何もしない
    if (!deleted) continue

    addButtonToBookmark({
      bookmarkElement: bookmark,
      illustId,
      userId,
    })
  }

  console.log(`${extensionName}: 拡張機能読み込み完了。`)
}

/**
 * FontAwesomeを読み込む
 */
const loadFontAwesome = () => {
  addDomElement({
    parent: document.head,
    tagName: 'link',
    attributes: [
      { qualifiedName: 'rel', value: 'stylesheet' },
      {
        qualifiedName: 'href',
        value:
          'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css',
      },
      {
        qualifiedName: 'integrity',
        value:
          'sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw==',
      },
      { qualifiedName: 'crossorigin', value: 'anonymous' },
      { qualifiedName: 'referrerpolicy', value: 'no-referrer' },
    ],
  })
}

/**
 * 検索ボタン追加処理を実行する関数 \
 * 画面読み込みが完了していない場合は繰り返し実行する
 */
const addSearchButtonsLoader = async () => {
  const { promise, resolve } = Promise.withResolvers<void>()
  try {
    addSearchButtons()
    resolve()
  } catch (error) {
    if (!(error instanceof DomNotFoundError)) {
      throw error
    }
    // 読み込み中にDOMが変化して参照できなかった場合は１秒後にリトライ
    console.log(
      `${extensionName}: 要素が見つからなかったため１秒後にリトライします。`,
    )
    setTimeout(async () => {
      await addSearchButtonsLoader()
      resolve()
    }, 1000)
  }
  // 処理完了まで待機する
  await promise
}

/**
 * ページ読み込み時の処理
 */
const onLoad = async () => {
  if (isSmartPhonePage()) {
    // スマホ版ページは現時点で対応していない
    console.error(
      `${extensionName}: スマホ版ページにはまだ対応していません。
  機能不足に感じられた方は是非ともソースコード改修をお願いします！
  
  ↓プルリクエストはこちらから↓
  https://github.com/MijinkoSD/pixiv-removed-artwork-searcher/pulls`,
    )
    return
  }

  let beforeUrl = location.href
  loadFontAwesome()
  await addSearchButtonsLoader()
  const observer = new MutationObserver(() => {
    // ページ遷移していなければ何もしない
    if (beforeUrl === location.href) return
    beforeUrl = location.href
    console.log(
      `${extensionName}: ページ遷移を検知したため再実行します。`,
    )
    addSearchButtonsLoader()
  })
  observer.observe(getBookmarkListElement({ getSection: true }), {
    childList: true,
    subtree: true,
  })
}

// ページ読み込み時に実行
globalThis.addEventListener('load', onLoad)
