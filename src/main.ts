import { extensionName } from './commons.ts'
import { addDomElement } from './domUtilities.ts'
import {
  addButtonToBookmark,
  getBookmarkInfo,
  getBookmarkListElement,
} from './pixivDom.ts'

const main = () => {
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

    const buttonArea = addButtonToBookmark({
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
 * ページ読み込み時の処理
 */
const onLoad = () => {
  loadFontAwesome()
  try {
    main()
  } catch (error) {
    if (!(error instanceof DOMException)) {
      throw error
    }
    // 読み込み中にDOMが変化して参照できなかった場合は１秒後にリトライ
    console.log(
      `${extensionName}: 要素が見つからなかったため１秒後にリトライします。`,
    )
    setTimeout(onLoad, 1000)
  }
}

// ページ読み込み時に実行
globalThis.addEventListener('load', onLoad)
