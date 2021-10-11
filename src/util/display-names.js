import id from './id'
import { capitalize } from './text'

export function displayName(userId, name, avatar) {
  let displayName = name

  if (!name || typeof name !== 'string') {
    displayName = `Anonymous ${capitalize(avatar)}`
  }

  if (id === userId) {
    displayName += ' (You)'
  }

  return displayName
}



// WEBPACK FOOTER //
// ./app/util/display-names.js