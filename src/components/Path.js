import React, { Component } from 'react'

import * as tools from '../lib/tool-names'
import { makePath } from '../util/paths'
import { fontSize, strokeWidth, eraserWidth } from '../util/sizing'
import { toAbsolute } from '../util/relative-points'

const BLACK = "#222222"
const WHITE = "#fff"
const colorDict = { [WHITE]: BLACK, [BLACK]: WHITE}

export default class Path extends Component {

  shouldComponentUpdate(nextProps) {
    let props = this.props

    return Boolean(nextProps.scale != props.scale ||
      nextProps.data != props.data || nextProps.blackboardActive != props.blackboardActive)
  }

  render() {
    let { data, scale, blackboardActive } = this.props
    let isEraserActive = data.color === WHITE
    let rendercolor = data.color;
    if(blackboardActive && data.color in colorDict) {
      rendercolor = colorDict[data.color]
    }
    
    if (data.type === tools.PENCIL) {
      return (
        <path
          className={`draw-path`}
          strokeLinejoin="round"
          strokeWidth={isEraserActive ? eraserWidth(scale) : strokeWidth(scale)}
          stroke={rendercolor}
          d={makePath(data.data, scale)}
        />
      )
    }

    if (data.type === tools.TEXT) {
      let pos = toAbsolute(data.position, scale)

      let spans = data.value.split("\n").map((val, i) => {
        return (
          <tspan key={val} x="0" dy="1.2em">{val}</tspan>
        )
      })

      return (
        <g transform={`translate(${pos[0]}, ${-1.2 * fontSize(scale)})`}>
          <text
            fontSize={fontSize(scale)}
            className="text-path"
            fill={rendercolor}
            x={0}
            y={pos[1]}
          >
            {spans}
          </text>
        </g>
      )
    }

    if (data.type === tools.IMAGE) {
      let pos = toAbsolute(data.position, scale)
      let width = data.width * scale.scale
      let height = data.height * scale.scale

      return (
        <g transform={`translate(${pos[0]}, ${pos[1]})`}>
          <image
            x={0}
            y={0}
            width={width}
            height={height}
            href={data.uri}
          />
        </g>
      )
    }

    console.warn("Don't know what to do with " + data.type)
    return <g></g>
  }

}



// WEBPACK FOOTER //
// ./app/components/Path.js