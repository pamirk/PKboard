import React, { Component } from 'react'
import classNames from 'classnames'

export default class PopupTooltip extends Component {
  render() {
    let { className } = this.props

    return (
      <div className={classNames(
        'popup-tooltip',
        'transition-whoosh',
        className
      )}>
        {this.props.children}
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ./app/components/PopupTooltip.js