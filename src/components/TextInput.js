import React, { Component } from 'react'
import { toAbsolute } from '../util/relative-points'
import { fontSize } from '../util/sizing'

require('../styles/text-input.css')

export const RETURN = 13
export const ESC = 27

const BLACK = "#222222"
const WHITE = "#fff"
const colorDict = { [WHITE]: BLACK, [BLACK]: WHITE }

export default class TextInput extends Component {
  onInput = (e) => {
    let text = e.currentTarget.value
    this.props.onChange(text)
  }

  onKeyDown = (e) => {
    e.stopPropagation()

    if (e.which == RETURN && !e.shiftKey) {
      e.preventDefault()
      this.props.onComplete()
    } else if (e.which == ESC) {
      e.preventDefault()
      this.props.onCancel()
    }
  }

  shouldComponentUpdate(nextProps) {
    return !this.span || nextProps.value != this.span.textContent 
                      || nextProps.blackboardActive != this.props.blackboardActive
  }

  render() {
    let { position, scale, color, blackboardActive } = this.props

    let pos = toAbsolute(position, scale)
    console.log("1:" + color)
    let rendercolor = color;
    if (blackboardActive && color in colorDict) {
      rendercolor = colorDict[color]
    }
    console.log("2:" + rendercolor)

    let styles = {
      position: 'absolute',
      zIndex: 1000,
      left: pos[0],
      top: pos[1],
      width: window.innerWidth,
    }

    let spanStyles = {
      color: rendercolor,
      fontSize: fontSize(scale),
      width: '100%',
    }

    return (
      <div className="text-input-wrapper" style={styles}>
        <input
          autoFocus
          className="text-input"
          onChange={this.onInput}
          onKeyDown={this.onKeyDown}
          onBlur={this.props.onComplete}
          value={this.props.value}
          style={spanStyles}
        />
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ./app/components/TextInput.js