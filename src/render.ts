import {TemplateContext} from './TemplateContext'
import {TemplateInstance} from './TemplateInstance'

export function render(ctx: TemplateContext, rootElm: HTMLElement) {
  if (rootElm.childNodes.length) {
    const rootNode = rootElm.children[0]
    const cachedInstance = (rootNode as any).__instance as TemplateInstance

    if (cachedInstance.ctx.template === ctx.template) {
      return cachedInstance.setContext(ctx)
    } else {
      cachedInstance.removeNode()
    }
  }

  const instance = new TemplateInstance(ctx)

  rootElm.appendChild(instance.getFragment())

  instance.setNode(rootElm.children[0])
}
