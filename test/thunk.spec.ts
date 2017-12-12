import {html, render, thunk} from '../src/'

describe('template/thunk', () => {
  let rootElm

  beforeEach(() => {
    rootElm = document.createElement('main')
  })

  it('should re-render if values were changed', () => {
    const mockCallback = jest.fn()

    const view = val => {
      mockCallback(val)
      return html`<span>${val}</span>`
    }

    render(html`<div>${thunk(view, 1)}</div>`, rootElm)
    render(html`<div>${thunk(view, 2)}</div>`, rootElm)

    expect(rootElm.innerHTML).toEqual('<div><span>2</span></div>')
    expect(mockCallback.mock.calls).toEqual([[1], [2]])
  })

  it('should not re-render if values were unchanged', () => {
    const mockCallback = jest.fn()

    const view = val => {
      mockCallback(val)
      return html`<span>${val}</span>`
    }

    render(html`<div>${thunk(view, 1)}</div>`, rootElm)
    render(html`<div>${thunk(view, 1)}</div>`, rootElm)

    expect(rootElm.innerHTML).toEqual('<div><span>1</span></div>')
    expect(mockCallback.mock.calls).toEqual([[1]])
  })
})
