import React, { Component } from 'react'
import classNames from 'classnames'

export default class Tooltip extends Component {
  state = {
    active: false
  }

  onMouseEnter = (e) => {
    this.setState({
      active: true
    })
  }

  onMouseLeave = (e) => {
    this.setState({
      active: false
    })
  }

  render() {
    let { below } = this.props

    let visible = this.state.active &&
                  !this.props.disabled

    return (
      <span
        className={classNames('tooltip-wrapper', this.props.className)}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        {this.props.children}
        {visible ? (
          <span className={classNames(
            'tooltip-inner-wrapper',
            { 'tooltip-below': below }
          )}>
            <span className="tooltip">
              {this.props.tooltipContent}
            </span>
          </span>
        ) : null }
      </span>
    )
  }
}



// WEBPACK FOOTER //
// ./app/components/Tooltip.js