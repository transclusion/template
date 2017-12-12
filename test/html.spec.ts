import {html} from '../src/'

describe('template/html', () => {
  it('should cache templates', () => {
    const a = html`<div>${'a'}</div>`
    const b = html`<div>${'b'}</div>`

    expect(a.template).toBe(b.template)
  })

  it('should create attribute slot', () => {
    const a = html`<div class="${'foo'}"></div>`

    a.template.getFragment(a.values) // parses template

    expect(a.template.slots).toHaveLength(1)
    expect(a.template.slots[0].type).toEqual('attr')
    expect(a.template.slots[0].path).toEqual([0])
    expect(a.template.slots[0].params.name).toEqual('class')
  })

  it('should create node slot', () => {
    const a = html`<div>${'foo'}</div>`

    a.template.getFragment(a.values) // parses template

    expect(a.template.slots).toHaveLength(1)
    expect(a.template.slots[0].type).toEqual('node')
    expect(a.template.slots[0].path).toEqual([0, 0])
  })
})
