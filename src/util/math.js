export const pythag = points => {
  let a = points[0],
      b = points[1]

  return Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2))
}

export const avg = points => {
  let a = points[0],
      b = points[1]

  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
}



// WEBPACK FOOTER //
// ./app/util/math.js