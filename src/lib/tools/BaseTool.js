import { getPoint } from '../../util/dom-events'
import id from '../../util/id'
import { toRelative } from '../../util/relative-points'

export default class Tool {
  onMouseDown = null
  onMouseMove = null
  onMouseUp = null

  handle(evt, state, e, options) {
    let result

    this.options = options
    this.dPressed = options.dPressed
    this.shiftPressed = options.shiftPressed
    this.cPressed = options.cPressed
    this.rPressed = options.rPressed
    this.state = state
    this.currentUser = this.state.users[id]
    this.currentPath = this.state.currentPaths[id]

    if (typeof this[evt] == 'function') {
      if (e != null && e.touches != null) {
        e.preventDefault()
      }

      result = this[evt](toRelative(getPoint(e), state.scale))
    }

    return result
  }
}



// WEBPACK FOOTER //
// ./app/lib/tools/BaseTool.js