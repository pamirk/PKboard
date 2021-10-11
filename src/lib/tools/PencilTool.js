import Tool from './BaseTool'
import { PENCIL } from '../tool-names'
import {DollarRecognizer, Point, Result} from '../../util/dollar'

export default class PencilTool extends Tool {

  onMouseDown = (point) => {
    if (this.currentPath != null) return

    if (point === null) return this.onMouseUp()
    let color = this.getColor()

    if(this.cPressed)
      this.center = point

    if(this.rPressed)
      this.rectStart = point

    let currentPath = {
      type: PENCIL,
      color: color,
      data: [point]
    }

    return { currentPath }
  }

  onMouseMove = (point) => {
    if (this.currentPath == null) {
      if (this.dPressed) return this.onMouseDown(point)
      return
    }

    if (point == null) return this.onMouseUp()

    let currentPathData = this.currentPath.data.concat([point])

    // if(!modified) return { currentPath }

    // user is trying to draw a line
    if(this.shiftPressed) {

      this.enableAutocorrect = false

      // get first and last
      let p1 = currentPathData[0]
      let p2 = currentPathData[currentPathData.length - 1]

      // calculate angle between them
      let beginAngle = Math.atan2(p2[1] - p1[1], p2[0] - p1[0])

      // if the angle is less than pi/4, set line angle to 0
      if(beginAngle <= -3 * Math.PI/4) {
        this.angle = 0
      }
      else if (beginAngle <= -Math.PI/4) {
        this.angle = 1
      }
      else if (beginAngle <= Math.PI/4) {
        this.angle = 2
      }
      else if(beginAngle <= 3 * Math.PI/4) {
        this.angle = 3
      }
      else {
        this.angle = 0
      }

      currentPathData = this.cleanLine(currentPathData)
    } else if(this.cPressed && currentPathData.length > 2) {
      this.enableAutocorrect = false
      let end = currentPathData[currentPathData.length - 1]
      let radius = this.distance2(this.center, end)

      currentPathData = this.cleanCircle(this.center, radius)
    } else if(this.rPressed && currentPathData.length > 2) {
      this.enableAutocorrect = false
      let end = currentPathData[currentPathData.length - 1]
      currentPathData = this.cleanRectangle(this.rectStart, end)
    }
    let currentPath = {
      ...this.currentPath,
      data: currentPathData
    }

    return { currentPath }
  }

  onMouseUp = (point) => {
    if (this.currentPath == null) return

    let newPathData = this.currentPath.data

    // if (point != null) {
    //   newPathData = newPathData.concat([point])
    //   if(this.shiftPressed && newPathData.length > 10) {
    //     newPathData = this.cleanLine(newPathData)
    //   }
    // }
    var autocorrect = this.clean(newPathData)
    this.enableAutocorrect = true

    var newPath = {}
    if(autocorrect) {
      newPath = {
        ...this.currentPath,
        data: autocorrect,
        oldData: newPathData
      }
    }
    else {
      newPath = {
        ...this.currentPath,
        data: newPathData
      }
    }

    this.center = null
    this.rectStart = null
    
    return { newPath }
  }

  onMouseLeave = (point) => {
    return this.onMouseUp(point)
  }

  onCancel = () => {
    return { cancelCurrentPath: true }
  }

  getColor = () => {
    return this.currentUser.color
  }

  cleanLine = (currentPath) => {
    // horizontal
    if(this.angle === 0 || this.angle === 2) {
      let y = currentPath[0][1]

      let x1 = currentPath[0][0]
      let x2 = currentPath[currentPath.length - 1][0]

      currentPath = [[x1, y], [x2, y]];
    }

    // vertical
    else {
      let x = currentPath[0][0]

      let y1 = currentPath[0][1]
      let y2 = currentPath[currentPath.length - 1][1]

      currentPath = [[x, y1], [x, y2]];
    }

    return currentPath
  }

  clean = (currentPath) => {
    if(!this.enableAutocorrect) {
      return false
    }

    // Initialize recognizer
    var d = new DollarRecognizer()

    // Convert currentPath to Point array
    var points = new Array(currentPath.length)
    for(var i = 0; i < currentPath.length; i++) {
      let p = currentPath[i]
      points[i] = new Point(p[0], p[1])
    }

    // Find two points furthest from each other
    var largestDistance = -1.0
    var furthestPoint1 = null
    var furthestPoint2 = null
    for (var i = 0; i < points.length; i++) {
      let pi = points[i]
      for(var j = 0; j < points.length; j++) {
        let pj = points[j]
        let d = this.distance(pi, pj)
        if(d > largestDistance) {
          largestDistance = d
          furthestPoint1 = pi
          furthestPoint2 = pj
        }
      }
    }

    // Centroid is the midpoint of the two furthest points
    let centroid = new Point((furthestPoint1.X + furthestPoint2.X) / 2,(furthestPoint1.Y + furthestPoint2.Y) / 2)

    // Recognize the shape
    let r = d.Recognize(points, false)

    // If the recognition score is below 0.9, don't auto-correct
    if(r.Score < 0.9 || !this.state.autocorrectActive)
      return false

    // If a circle was recognized, find the radius of the circle and draw
    // a circle with the calculated radius and center at the centroid
    if(r.Name === 'circle') {
      let r = largestDistance / 2.0;
      currentPath = this.cleanCircle([centroid.X, centroid.Y], r)
      
    } else if(r.Name === 'rectangle') {
      let p1 = [furthestPoint1.X, furthestPoint1.Y]
      let p2 = [furthestPoint2.X, furthestPoint2.Y]

      currentPath = this.cleanRectangle(p1, p2)
    }

    return currentPath
  }

  cleanCircle = (center, r) => {
    // Draw a circle with NUMPOINTS points
      let NUMPOINTS = 70
      let dTheta = (2*Math.PI) / NUMPOINTS;
      var theta = dTheta;
      let currentPath = [[r + center[0], center[1]]]
      for(var i = 1; i < NUMPOINTS + 1; i++) {
        let x = r * Math.cos(theta) + center[0]
        let y = r * Math.sin(theta) + center[1]
        currentPath = currentPath.concat([[x, y]])
        theta += dTheta
      }

      return currentPath
  }

  cleanRectangle = (p1, p2) => {
    let lx = Math.min(p1[0], p2[0])
    let ly = Math.min(p1[1], p2[1])

    let ux = Math.max(p1[0], p2[0])
    let uy = Math.max(p1[1], p2[1])

    // return [[lx, ly], [lx, uy], [ux, uy], [ux, ly], [lx, ly]]
    return [[ux, uy], [lx, uy], [lx, ly], [ux, ly], [ux, uy]]
  }

  distance = (p1, p2) => {
    return Math.sqrt(Math.pow(p2.X - p1.X, 2) + Math.pow(p2.Y - p1.Y, 2))
  }

  distance2 = (p1, p2) => {
    return Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2))
  }
}



// WEBPACK FOOTER //
// ./app/lib/tools/PencilTool.js