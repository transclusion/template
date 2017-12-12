# @transclusion/template

A tiny, focused and performant HTML template rendering library for Node.js and the browser.

```bash
npm install @transclusion/template --save
```

[![build status](https://img.shields.io/travis/transclusion/template/master.svg?style=flat-square)](https://travis-ci.org/transclusion/template)
[![coverage status](https://img.shields.io/coveralls/transclusion/template/master.svg?style=flat-square)](https://coveralls.io/github/transclusion/template?branch=master)
[![npm version](https://img.shields.io/npm/v/@transclusion/template.svg?style=flat-square)](https://www.npmjs.com/package/@transclusion/template)

## Features

* **Tiny.** 1.43 kB gzipped and minified
* **Focused.** The API consists of three methods, `html`, `render` and `thunk`.
* **Performant.** Uses native HTML templates which are reused to perform super fast.

## Why?

To learn how `lit-html` and `hyperHTML` works. Mostly inspired by `lit-html`.

## Usage

```js
import {html, render} from '@transclusion/template'

render(html`<div>Hello, world</div>`, document.body)
```

## License

MIT © [Marius Lundgård](https://mariuslundgard.com)
