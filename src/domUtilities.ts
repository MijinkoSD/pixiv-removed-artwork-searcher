/**
 * DOM要素を追加する \
 * 既存の要素の追加の他に、新規作成して追加することもできる
 * @param options
 * @returns
 */
export const addDomElement = <tagName extends keyof HTMLElementTagNameMap>(
  options: {
    // 要素を新規作成して追加する際の引数
    parent: Element
    tagName: tagName
    attributes?: {
      qualifiedName: string
      value: string
    }[]
    eventHandlers?: Parameters<typeof HTMLElement.prototype.addEventListener>[]
  } | {
    // 既存要素を追加する際の引数
    parent: Element
    addedElement: HTMLElementTagNameMap[tagName]
  },
): HTMLElementTagNameMap[tagName] => {
  const { parent } = options
  let element: HTMLElementTagNameMap[tagName]
  if ('addedElement' in options) {
    // 引数の要素を追加する場合
    element = options.addedElement
  } else {
    // 新しく要素を作成して追加する場合
    const { tagName, attributes, eventHandlers } = options
    element = createDomElement({ tagName, attributes, eventHandlers })
  }
  parent.appendChild(element)
  return element
}

/**
 * DOM要素を新規作成する
 * @param options
 * @returns
 */
export const createDomElement = <tagName extends keyof HTMLElementTagNameMap>(
  options: {
    tagName: tagName
    attributes?: {
      qualifiedName: string
      value: string
    }[]
    eventHandlers?: Parameters<typeof HTMLElement.prototype.addEventListener>[]
  },
): HTMLElementTagNameMap[tagName] => {
  const { tagName, attributes, eventHandlers } = options
  const element = document.createElement(tagName)
  for (const attribute of attributes ?? []) {
    const { qualifiedName, value } = attribute
    element.setAttribute(qualifiedName, value)
  }
  for (const eventHandler of eventHandlers ?? []) {
    element.addEventListener(...eventHandler)
  }

  return element
}
