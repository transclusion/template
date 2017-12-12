/* tslint:disable ban-types */

export class TemplateThunk {
  public fn: Function
  public args: any[]

  constructor(fn: Function, args: any[]) {
    this.fn = fn
    this.args = args
  }
}
