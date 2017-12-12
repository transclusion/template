export function findNodeAtPath(node: Node, path: number[]): Node {
  const idx = path[0]

  if (typeof idx !== 'number') return node

  return findNodeAtPath(node.childNodes[idx], path.slice(1))
}

export function regExpMatchAll(re: RegExp, str: string) {
  const matches = []

  let match = re.exec(str)

  if (match) {
    matches.push(match)
  }

  while (match) {
    match = re.exec(str)

    if (match) {
      matches.push(match)
    }
  }

  return matches
}
