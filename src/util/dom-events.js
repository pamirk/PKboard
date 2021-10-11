export const getAllPoints = e => {
  let positions = []
  let i, touch

  for (i = 0; i < e.touches.length; i += 1) {
    touch = e.touches[i]
    positions.push([touch.pageX, touch.pageY])
  }

  return positions
}

export const getPoint = e => {
  if (e == null) return e

  if (e.touches != null) {
    let touch = null
    if (e.touches.length == 0 && e.changedTouches.length == 1) {
      touch = e.changedTouches[0]
    } else if (e.touches.length > 1) {
      return null
    } else {
      touch = e.touches[0]
    }

    return [touch.clientX, touch.clientY]
  } else {
    return [e.clientX, e.clientY]
  }
}



// WEBPACK FOOTER //
// ./app/util/dom-events.js