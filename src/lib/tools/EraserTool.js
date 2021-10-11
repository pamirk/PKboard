import PencilTool from './PencilTool'

export default class EraserTool extends PencilTool {
  getColor = () => {
    return '#fff'
  }

  clean() {
    return null
  }
}



// WEBPACK FOOTER //
// ./app/lib/tools/EraserTool.js