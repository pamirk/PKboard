import Tool from './BaseTool'
import {TEXT} from '../tool-names'

export default class TextTool extends Tool {
  onMouseUp = (point) => {
    return {
      textInputPosition: point
    }
  }


  onTextChange = () => {
    let path = { ...this.getPath(), value: this.options.textInputValue }

    return { currentPathBroadcastOnly: path }
  }


  onTextCancel = () => {
    let path = { ...this.getPath(), value: '' }

    return { currentPathBroadcastOnly: path }
  }


  onTextCreate = () => {
    let newPath = this.getPath()

    return { newPath }
  }


  getPath = () => {
    return {
      type: TEXT,
      color: this.currentUser.color,
      value: this.state.textInputValue,
      position: this.state.textInputPosition
    }
  }
}



// WEBPACK FOOTER //
// ./app/lib/tools/TextTool.js