export function capitalize(word) {
  if (word == null) return word
  return word.substr(0, 1).toUpperCase() + word.substr(1)
}



// WEBPACK FOOTER //
// ./app/util/text.js