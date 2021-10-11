import Tool from './BaseTool'
import { PENCIL } from '../tool-names'
import {DollarRecognizer, Point, Result} from '../../util/dollar'

export default class PencilTool extends Tool {
  onMouseDown = (point) => {
    if (this.currentPath != null) return

    if (point === null) return this.onMouseUp()
    let color = this.getColor()

    let currentPath = {
      type: PENCIL,
      color: color,
      data: [point, point]
    }

    return { currentPath }
  }

  onMouseMove = (point) => {
    if (!point || !this.currentPath) return this.onMouseUp()

    if (!this.currentPath) {
      this.currentPath = this.onMouseDown(point)
    }

    let endPoint = point

    let startPoint = this.currentPath.data[0]
    let currentPathData = [startPoint, endPoint]

    let currentPath = {
      ...this.currentPath,
      data: currentPathData
    }

    if (this.options.shiftPressed) {
      currentPath = this.getSnappedPath(currentPath)
    }

    return { currentPath }
  }

  onMouseUp = () => {
    return { newPath: this.currentPath }
  }

  onMouseLeave = point => {
    //return this.onMouseUp(point)
    return this.onMouseMove(point)
  }

  onCancel = () => {
    return { cancelCurrentPath: true }
  }

  getColor = () => {
    return this.currentUser.color
  }

  getSnappedPath = path => {
    let [startPoint, endPoint] = path.data

    if (Math.abs(endPoint[0] - startPoint[0]) >
        Math.abs(endPoint[1] - startPoint[1])) {

      endPoint = [endPoint[0], startPoint[1]]
    } else {
      endPoint = [startPoint[0], endPoint[1]]
    }

    return { ...path, data: [startPoint, endPoint] }
  }
}



// WEBPACK FOOTER //
// ./app/lib/tools/LineTool.js