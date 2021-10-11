import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class UserIcon extends Component {
  render() {
    let { avatar, color, name } = this.props
    if (this.props.color === '#222222' && this.props.blackboardActive) {
      color = '#FFFFFF'
    }

    return (
      <div
        className={[
          'toolbar-share-user-item',
          this.props.blackboardActive && this.props.color === '#222222' ? 'toolbar-share-user-item-invert' : ''
        ].join(' ')}
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
// ./app/components/Share/Users/UserIcon.js