import React, { Component } from 'react'

export default class EraseAllButton extends Component {

  render() {
    return (
      <div
        className='footer-clear clearfix'
        onClick={this.props.onClick}
        onTouchStart={this.props.onClick}
      >
        <div className="footer-clear-icon">
          <span></span>
        </div>
        <div className="footer-clear-caption">Erase All</div>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ./app/components/ToolBar/EraseAllButton.js