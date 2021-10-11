import React, { Component } from 'react'
import DocumentEvents from 'react-document-events'

export const ESC = 27

export default class ImageUpload extends Component {
  constructor(props) {
    super(props)

    let { initialX, initialY } = props

    this.state = {
      x: initialX || window.innerWidth / 2,
      y: initialY || window.innerHeight / 2,
      stuck: false,
    }
  }

  handleMouseMove = e => {
    if (this.state.stuck) { return }

    this.setState({ x: e.clientX, y: e.clientY })
  }

  handleMouseDown = () => {
    let { onDrop } = this.props
    let { x, y } = this.state

    this.setState({ stuck: true })

    onDrop([x, y])
  }

  handleWheel = e => {
    e.preventDefault()
  }

  handleKeyDown = e => {
    let { onCancel } = this.props

    if (e.which === ESC) {
      onCancel()
    }
  }

  render() {
    let { url, width, height, zoom } = this.props
    let { x, y, stuck } = this.state

    if (!url) { return null }
    let { scale } = zoom

    let widthScaled = width * scale
    let heightScaled = height * scale

    let styles = {
      left: x - widthScaled / 2,
      top: y - heightScaled / 2,
      opacity: stuck ? 1 : 0.5,
    }

    return (
      <div
        className="image-upload"
        onMouseDown={this.handleMouseDown}
        onWheel={this.handleWheel}
      >
        <DocumentEvents
          onMouseMove={this.handleMouseMove}
          onKeyDown={this.handleKeyDown}
        />
        <div className="image-upload-image" style={styles}>
          <img
            src={url}
            alt=""
            width={widthScaled}
            height={heightScaled}
          />
        </div>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ./app/components/ImageUpload.js