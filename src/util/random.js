import keys from 'lodash.keys'

export function randomValue(obj) {
  let arr = []
  for (let i in obj) {
    arr.push(obj[i])
  }

  return randomItem(arr)
}

export function randomItem(arr) {
  let index = Math.ceil(Math.abs(Math.round(
    Math.random() * arr.length - 0.5)), arr.length)

  return arr[index]
}
