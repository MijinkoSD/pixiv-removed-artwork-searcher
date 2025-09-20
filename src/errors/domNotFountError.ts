
/**
 * DOMが見つからなかった場合のエラー
 */
export class DomNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DomNotFoundError'
  }
}