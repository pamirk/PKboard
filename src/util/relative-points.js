export const X_MAX = 1.5
export const Y_MAX = 1.0

// Take relative point ([[-1.5, 1.5], [-1, 1]]) and output pixel values
export const toAbsolute = (point, scaleObj) => {
  if (point == null) return point

  let { scale, offsetX, offsetY } = scaleObj

  let x = point[0],
      y = point[1]

  let newX = x * scale + offsetX,
      newY = y * scale + offsetY

  return [newX, newY]
}


// Take absolute point in pixels and output
export const toRelative = (point, scaleObj) => {
  if (point == null) return point

  let { scale, offsetX, offsetY } = scaleObj

  let x = point[0],
      y = point[1]

  let newX = (x - offsetX) / scale,
      newY = (y - offsetY) / scale

  return [newX, newY]
}




// WEBPACK FOOTER //
// ./app/util/relative-points.js