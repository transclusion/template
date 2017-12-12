import {html, render} from '../src/'

describe('template/render', () => {
  let rootElm

  beforeEach(() => {
    rootElm = document.createElement('main')
  })

  it('should render slots', () => {
    render(html`<div class="${'foo'}">${'bar'}</div>`, rootElm)

    expect(rootElm.innerHTML).toEqual('<div class="foo">bar</div>')
  })

  it('should nest contexts', () => {
    render(html`<div class="${'foo'}">${html`<span>bar</span>`}</div>`, rootElm)

    expect(rootElm.innerHTML).toEqual('<div class="foo"><span>bar</span></div>')
  })

  it('should replace html', () => {
    render(html`<div>${'foo'}</div>`, rootElm)
    render(html`<p>${'bar'}</p>`, rootElm)

    expect(rootElm.innerHTML).toEqual('<p>bar</p>')
  })

  it('should update node slot', () => {
    render(html`<div>${'foo'}</div>`, rootElm)
    render(html`<div>${'bar'}</div>`, rootElm)

    expect(rootElm.innerHTML).toEqual('<div>bar</div>')
  })

  it('should update nested template', () => {
    render(html`<div>${html`<span>${'foo'}</span>`}</div>`, rootElm)
    render(html`<div>${html`<span>${'bar'}</span>`}</div>`, rootElm)

    expect(rootElm.innerHTML).toEqual('<div><span>bar</span></div>')
  })

  it('should replace nested template', () => {
    render(html`<div>${html`<span>foo</span>`}</div>`, rootElm)
    render(html`<div>${html`<span>bar</span>`}</div>`, rootElm)

    expect(rootElm.innerHTML).toEqual('<div><span>bar</span></div>')
  })

  it('should update slots', () => {
    render(html`<div class="${'foo'}">${'bar'}</div>`, rootElm)
    render(html`<div class="${'baz'}">${'qux'}</div>`, rootElm)

    expect(rootElm.innerHTML).toEqual('<div class="baz">qux</div>')
  })

  it('should render attributes with slot values', () => {
    render(html`<div class="app app--${'foo'}">bar</div>`, rootElm)

    expect(rootElm.innerHTML).toEqual('<div class="app app--foo">bar</div>')
  })

  it('should update attributes with slot values', () => {
    render(html`<div class="app app--${'foo'}">bar</div>`, rootElm)
    render(html`<div class="app app--${'baz'}">bar</div>`, rootElm)

    expect(rootElm.innerHTML).toEqual('<div class="app app--baz">bar</div>')
  })

  it('should render complex attributes with slot values', () => {
    render(html`<div class="app app--${'foo'} app--${'bar'}">baz</div>`, rootElm)

    expect(rootElm.innerHTML).toEqual('<div class="app app--foo app--bar">baz</div>')
  })

  it('should render an array of sub-templates', () => {
    render(html`<div>${[1, 2, 3].map(num => html`<span>${num}</span>`)}</div>`, rootElm)

    expect(rootElm.innerHTML).toEqual('<div><span>1</span><span>2</span><span>3</span></div>')
  })

  it('should update an array of sub-templates', () => {
    render(html`<div>${[1, 2, 3].map(num => html`<span>${num}</span>`)}</div>`, rootElm)
    render(html`<div>${[4, 5, 6].map(num => html`<span>${num}</span>`)}</div>`, rootElm)

    expect(rootElm.innerHTML).toEqual('<div><span>4</span><span>5</span><span>6</span></div>')
  })
})
