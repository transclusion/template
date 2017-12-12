import {PLACEHOLDER} from './constants'
import {findNodeAtPath, regExpMatchAll} from './helpers'
import {TemplateContext} from './TemplateContext'
import {TemplateInstance} from './TemplateInstance'
import {TemplateSlot} from './TemplateSlot'

function insertNodeValue(refNode: Node, value: any) {
  let childInstance
  let childNode

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
}

function updateNodeValue(node: Node, value: any) {
  if (value instanceof TemplateContext) {
    let childInstance = (node as any).__instance as TemplateInstance

    if (childInstance.ctx.template === value.template) {
      childInstance.setContext(value)
    } else {
      childInstance = new TemplateInstance(value)

      node.parentNode.insertBefore(childInstance.getFragment(), node)

      childInstance.setNode(node.previousSibling)

      node.parentNode.removeChild(node)
    }
  } else {
    node.nodeValue = String(value)
  }
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
        if (node instanceof HTMLElement) {
          if (attrValues[slot.params.name] === undefined) {
            if (!fragment) fragment = this.node.content.cloneNode(true) as DocumentFragment

            attrValues[slot.params.name] = (findNodeAtPath(fragment, slot.path) as Element).getAttribute(
              slot.params.name
            )
          }

          attrValues[slot.params.name] = attrValues[slot.params.name].replace(`<!--${PLACEHOLDER}-->`, String(value))

          node.setAttribute(slot.params.name, attrValues[slot.params.name])
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
    switch (node.nodeType) {
      // element node
      case 1: {
        let i

        // find attribute slots
        for (i = 0; i < node.attributes.length; i += 1) {
          const attr = node.attributes[i]
          const re = new RegExp(`<!--${PLACEHOLDER}-->`, 'g')
          const matches = regExpMatchAll(re, attr.value)

          matches.forEach(() => {
            this.slots.push(new TemplateSlot('attr', path, {name: attr.name}))
          })
        }

        // find node slots
        for (i = 0; i < node.childNodes.length; i += 1) {
          this.walk(node.childNodes[i], path.concat([i]))
        }

        break
      }

      // // text node
      // case 3:
      //   break

      // comment node
      case 8: {
        if (node.nodeValue === PLACEHOLDER) {
          this.slots.push(new TemplateSlot('node', path))
        }

        break
      }

      // fragment node
      case 11: {
        let i

        // find child slots
        for (i = 0; i < node.childNodes.length; i += 1) {
          this.walk(node.childNodes[i], path.concat([i]))
        }

        break
      }

      // // unhandled node
      // default:
      //   console.error('Unhandled node:', node.nodeName, node.nodeType)
      //   break
    }
  }
}
