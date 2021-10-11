import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class UserIcon extends Component {
  render() {
    let { avatar, color, name } = this.props
    return (
      <div
        className="toolbar-share-user-item"
        style={{ backgroundColor: color }}
      >
        {name && name != '' ?
          name[0].toUpperCase() :
          <span className={`toolbar-share-user-anonymous ${avatar || ''}`} />
        }
      </div>
    )
  }
}

UserIcon.propTypes = {
  avatar: PropTypes.string,
  name: PropTypes.string,
  color: PropTypes.string
}



// WEBPACK FOOTER //
// ./app/components/ToolBar/Users/UserIcon.js