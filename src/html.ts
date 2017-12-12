import {PLACEHOLDER} from './constants'
import {Template} from './Template'
import {TemplateContext} from './TemplateContext'
import {ITemplateMap} from './types'

const templateMap: ITemplateMap = {}

export function html(strings: TemplateStringsArray, ...values: any[]) {
  const key = strings.join(`<!--${PLACEHOLDER}-->`)

  if (!templateMap[key]) {
    templateMap[key] = new Template(key)
  }

  return new TemplateContext(templateMap[key], values)
}
