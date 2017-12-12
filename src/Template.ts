import {PLACEHOLDER} from './constants'
import {findNodeAtPath, regExpMatchAll} from './helpers'
import {TemplateContext} from './TemplateContext'
import {TemplateInstance} from './TemplateInstance'
import {TemplateSlot} from './TemplateSlot'
import {TemplateThunk} from './TemplateThunk'

function insertNodeValue(refNode: Node, value: any): Node {
  let childInstance
  let childNode

  if (value instanceof TemplateThunk) {
    const newNode = insertNodeValue(refNode, value.fn(...value.args))
    ;(newNode as any).__thunk = value

    return newNode
  }

  if (value instanceof TemplateContext) {
    childInstance = new TemplateInstance(value)
    childNode = childInstance.getFragment()
  } else {
    childNode = document.createTextNode(String(value))
  }

  refNode.parentNode.insertBefore(childNode, refNode.nextSibling)

  if (childInstance) {
    childInstance.setNode(refNode.nextSibling)
  }

  return refNode.nextSibling
}

function updateNodeValue(node: Node, value: any): Node {
  if (value instanceof TemplateThunk) {
    const prevThunk = (node as any).__thunk

    let changed = false

    if (prevThunk.args.length === value.args.length) {
      prevThunk.args.forEach((arg: any, idx: number) => {
        if (arg !== value.args[idx]) {
          changed = true
        }
      })

      if (changed) {
        const newNode = updateNodeValue(node, value.fn(...value.args))
        ;(newNode as any).__thunk = value

        return newNode
      }
    }

    return node
  }

  if (value instanceof TemplateContext) {
    let childInstance = (node as any).__instance as TemplateInstance

    if (childInstance.ctx.template === value.template) {
      childInstance.setContext(value)
    } else {
      childInstance = new TemplateInstance(value)

      node.parentNode.insertBefore(childInstance.getFragment(), node)

      const newNode = node.previousSibling

      childInstance.setNode(newNode)

      node.parentNode.removeChild(node)

      return newNode
    }
  } else if (value instanceof TemplateThunk) {
    //
  } else {
    node.nodeValue = String(value)
  }

  return node
}

export class Template {
  public slots: TemplateSlot[]
  public node: HTMLTemplateElement

  private key: string

  constructor(key: string) {
    this.key = key
    this.slots = []
  }

  public getFragment(values: any[]): DocumentFragment {
    if (!this.node) {
      this.node = document.createElement('template')
      this.node.innerHTML = this.key
      this.walk(this.node.content)
    }

    const fragment = this.node.content.cloneNode(true) as DocumentFragment

    this.slots.forEach((slot, idx) => {
      const value = values[idx]
      const node = findNodeAtPath(fragment, slot.path)

      if (slot.type === 'attr') {
        if (node instanceof HTMLElement) {
          const attrValue = node.getAttribute(slot.params.name)

          node.setAttribute(slot.params.name, attrValue.replace(`<!--${PLACEHOLDER}-->`, String(value)))
        }
      } else if (slot.type === 'node') {
        if (Array.isArray(value)) {
          let n = node

          value.forEach(val => {
            insertNodeValue(n, val)
            n = n.nextSibling
          })
        } else {
          insertNodeValue(node, value)
        }

        node.parentNode.removeChild(node)
      }
    })

    return fragment
  }

  public update(rootNode: Node, values: any[]) {
    const attrValues: any = {}

    let fragment: DocumentFragment

    this.slots.forEach((slot, idx) => {
      const value = values[idx]
      const node = findNodeAtPath(rootNode, slot.path.slice(1))

      if (slot.type === 'attr') {
        const attrName = slot.params.name

        if (!fragment) {
          fragment = this.node.content.cloneNode(true) as DocumentFragment
        }

        if (node instanceof HTMLElement) {
          if (attrValues[attrName] === undefined) {
            attrValues[attrName] = (findNodeAtPath(fragment, slot.path) as Element).getAttribute(attrName)
          }

          attrValues[attrName] = attrValues[attrName].replace(`<!--${PLACEHOLDER}-->`, String(value))

          node.setAttribute(attrName, attrValues[attrName])
        }
      } else if (slot.type === 'node') {
        if (Array.isArray(value)) {
          let n = node

          value.forEach(val => {
            updateNodeValue(n, val)
            n = n.nextSibling
          })
        } else {
          updateNodeValue(node, value)
        }
      }
    })
  }

  private walk(node: Node, path: number[] = []) {
    let i

    if (node.nodeType === 1) {
      // element node

      // find attribute slots
      for (i = 0; i < node.attributes.length; i += 1) {
        const attr = node.attributes[i]
        const re = new RegExp(`<!--${PLACEHOLDER}-->`, 'g')
        const matches = regExpMatchAll(re, attr.value)

        matches.forEach(() => {
          this.slots.push(new TemplateSlot('attr', path, {name: attr.name}))
        })
      }

      // continue walking the tree
      for (i = 0; i < node.childNodes.length; i += 1) {
        this.walk(node.childNodes[i], path.concat([i]))
      }
    } else if (node.nodeType === 8) {
      // comment node

      // find node slots
      if (node.nodeValue === PLACEHOLDER) {
        this.slots.push(new TemplateSlot('node', path))
      }
    } else if (node.nodeType === 11) {
      // fragment node

      // continue walking the tree
      for (i = 0; i < node.childNodes.length; i += 1) {
        this.walk(node.childNodes[i], path.concat([i]))
      }
    }
  }
}
