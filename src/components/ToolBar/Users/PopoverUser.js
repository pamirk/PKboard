import React, { Component } from 'react'
import UserIcon from './UserIcon'
import { displayName } from '../../../util/display-names'

export default class User extends Component {
  render() {
    let { avatar, color, id, name } = this.props
    let display = displayName(id, name, avatar)

    return (
      <div className="toolbar-share-user-popover-item clearfix">
        <UserIcon {...{ avatar, color, name }} />
        <div className="toolbar-share-user-popover-name">
          {display}
        </div>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ./app/components/ToolBar/Users/PopoverUser.js