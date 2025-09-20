import { extensionIdentifier } from './commons.ts'
import { addDomElement, createDomElement } from './domUtilities.ts'
import { DomNotFoundError } from './errors/domNotFountError.ts'

export const getBookmarkListElement = () => {
  const bookmarkListSelector = `:is(
  body
  > div
  > div
  > div
  > :nth-child(5 of div)
  > :nth-child(1 of div)
  > :nth-child(2 of div)
  section
  ul
)`
  const bookmarks = document.querySelector(bookmarkListSelector)
  if (!bookmarks) {
    throw new DomNotFoundError('ブックマークの要素が見つかりませんでした')
  } else if (!(bookmarks instanceof HTMLUListElement)) {
    throw new Error(
      'ブックマークの要素が想定された形式ではありませんでした。読み取ったWebサイトに変更があった可能性があります。',
    )
  }
  return bookmarks
}

/**
 * ブックマーク情報
 */
export type BookmarkInfo = {
  deleted: boolean
  illustId?: string
  userId?: string
}

/**
 * ブックマークの要素からブックマーク情報を取得します
 * @param bookmarkElement ブックマークの個別要素（li）
 * @returns 取得したブックマーク情報
 */
export const getBookmarkInfo = (
  bookmarkElement: HTMLLIElement,
): BookmarkInfo | undefined => {
  const linkElement = bookmarkElement.querySelector('[data-gtm-value]')
  if (!linkElement) return undefined
  let userId = linkElement.getAttribute('data-gtm-user-id') ?? undefined
  if (userId === '0') userId = undefined
  return {
    // a要素なら生きてる
    // span要素なら削除済みもしくは非公開
    deleted: linkElement.tagName !== 'A',
    illustId: linkElement.getAttribute('data-gtm-value') ?? undefined,
    userId,
  }
}

const addButton = (options: {
  searchUrl: string
  iconClass: string
  buttonArea: HTMLDivElement
}) => {
  const { searchUrl, iconClass, buttonArea } = options
  const button = addDomElement({
    parent: buttonArea,
    tagName: 'a',
    attributes: [{
      qualifiedName: 'class',
      value: `${extensionIdentifier}-mod-button`,
    }, {
      qualifiedName: 'href',
      value: searchUrl,
    }, {
      qualifiedName: 'target',
      value: '_blank',
    }, {
      qualifiedName: 'rel',
      value: 'noopener noreferrer',
    }],
  })
  // アイコンの生成
  addDomElement({
    parent: button,
    tagName: 'i',
    attributes: [{
      qualifiedName: 'class',
      value: iconClass,
    }],
  })
}

export const addButtonToBookmark = (
  options: {
    bookmarkElement: HTMLLIElement
    illustId?: string
    userId?: string
  },
): HTMLDivElement => {
  const { bookmarkElement, illustId, userId } = options
  const linkElement = bookmarkElement.querySelector('[data-gtm-value]')
  if (!linkElement) {
    throw new DomNotFoundError(
      'ボタンを追加しようとした要素が見つかりませんでした。',
    )
  }
  // ボタンの表示領域の生成
  const buttonArea = createDomElement({
    tagName: 'div',
    attributes: [{
      qualifiedName: 'class',
      value: `${extensionIdentifier}-mod-button-area`,
    }],
  })
  // ボタンの生成
  if (userId) {
    // ユーザーページへのリンク
    addButton({
      buttonArea,
      searchUrl: `https://www.pixiv.net/users/${userId}`,
      iconClass: 'fa-solid fa-user',
    })
  } else {
    // イラストURLでの検索リンク
    addButton({
      buttonArea,
      searchUrl:
        `https://www.google.com/search?q=pixiv.net/artworks/${illustId}`,
      iconClass: 'fa-solid fa-magnifying-glass',
    })
    // Twitter(X)への検索リンク
    addButton({
      buttonArea,
      searchUrl: `https://x.com/search?q=pixiv.net/artworks/${illustId}&f=live`,
      iconClass: 'fa-brands fa-x-twitter',
    })
  }
  // ボタンの生成（Xへのリンク）

  // 生成したボタンを表示する
  addDomElement({
    parent: linkElement,
    addedElement: buttonArea,
  })

  return buttonArea
}
