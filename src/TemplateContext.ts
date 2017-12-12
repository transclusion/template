import {Template} from './Template'

export class TemplateContext {
  public template: Template
  public values: any[]

  constructor(template: Template, values: any[]) {
    this.template = template
    this.values = values
  }
}
