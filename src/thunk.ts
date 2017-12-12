/* tslint:disable ban-types */

import {TemplateThunk} from './TemplateThunk'

export function thunk(fn: Function, ...args: any[]) {
  return new TemplateThunk(fn, args)
}
