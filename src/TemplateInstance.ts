import {TemplateContext} from './TemplateContext'

export class TemplateInstance {
  public ctx: TemplateContext
  private fragment: DocumentFragment
  private node: Node

  constructor(ctx: TemplateContext) {
    this.ctx = ctx
    this.fragment = null
  }

  public getFragment() {
    if (!this.fragment) {
      this.fragment = this.ctx.template.getFragment(this.ctx.values)
    }

    return this.fragment
  }

  public removeNode() {
    ;(this.node as any).__instance = null
    this.node.parentNode.removeChild(this.node)
  }

  public setContext(ctx: TemplateContext) {
    this.ctx = ctx
    this.update()
  }

  public setNode(node: Node) {
    this.node = node
    ;(this.node as any).__instance = this
  }

  public update() {
    this.ctx.template.update(this.node, this.ctx.values)
  }
}
