export class TemplateSlot {
  public type: string
  public path: number[]
  public params: any

  constructor(type: string, path: number[], params?: any) {
    this.type = type
    this.path = path
    this.params = params
  }
}
