import React, { Component } from 'react'
import PropTypes from 'prop-types'

import ColorOption from './ColorOption'

import mixpanel from '../../lib/mixpanel'

export const colors = require('../../lib/colors.json')

let colorsMap = {}
colors.forEach(({color, name}) => {
  colorsMap[color] = name
})

export default class ColorPicker extends Component {
  state = {
    expanded: false
  }

  onSelectOption = ({ color }) => {
    this.props.onChange(color)

    mixpanel.track("UserChangedColorTo: " + color)
    mixpanel.track("UserChangedColor")

    this.setState({
      expanded: false
    })
  }

  clickProps = () => {
    if (window.touchEvent) {
      return {
        onTouchStart: this.clickExpand
      }
    } else {
      return {
        onClick: this.clickExpand
      }
    }
  }

  clickExpand = (e) => {
    e.preventDefault()

    this.setState({
      expanded: !this.state.expanded
    })
  }

  render = () => {
    let expandedSection = null
    let backgroundColor = this.props.color;
    if (this.props.color === '#222222' && this.props.blackboardActive) {
      backgroundColor = '#FFFFFF';
    }


    if (this.state.expanded) {
      let options = colors.map((props) => (
        <ColorOption
          {...props}
          onSelect={this.onSelectOption}
          key={props.name}
        />
      ))

      expandedSection = (
        <div className="footer-color-selector clearfix">
          {options}
        </div>
      )
    }

    return (
      <div className='footer-color clearfix'>
        <div
          {...this.clickProps()}
          className="footer-color-state"
        >
          <span style={{ backgroundColor: backgroundColor }} />
        </div>
        {expandedSection}
      </div>
    )
  }
}

ColorPicker.propTypes = {
  color: PropTypes.string,
  onChange: PropTypes.func
}



// WEBPACK FOOTER //
// ./app/components/ColorPicker/index.js