import { toAbsolute } from './relative-points'

export function makePath(points, scale) {
  if (points.length == 1) {
    points = points.concat(points)
  }

  let path = points.filter(pt => pt).map(point => (
    toAbsolute(point, scale).join(' ')
  ))
  return 'M ' + path.join(' L ')
}



// WEBPACK FOOTER //
// ./app/util/paths.js