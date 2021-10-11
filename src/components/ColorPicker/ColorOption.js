import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class ColorOption extends Component {
  onClick = (e) => {
    this.props.onSelect({ color: this.props.color })
  }

  onTouchStart = (e) => {
    this.props.onSelect({ color: this.props.color })
    e.preventDefault()
  }

  render = () => (
    <div
      className="footer-color-selector-item"
      onClick={this.onClick}
      onTouchStart={this.onTouchStart}
      style={{ backgroundColor: this.props.color }}
      title={this.props.name}
    />
  )
}

ColorOption.propsTypes = {
  color: PropTypes.string,
  name: PropTypes.string,
  onSelect: PropTypes.func
}



// WEBPACK FOOTER //
// ./app/components/ColorPicker/ColorOption.js