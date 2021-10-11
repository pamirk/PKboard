import React, { Component } from 'react'
import Tooltip from '../../Tooltip'
import UserIcon from './UserIcon'
import { displayName } from '../../../util/display-names'

export default class User extends Component {
  render() {
    let { avatar, color, id, name } = this.props
    let display = displayName(id, name, avatar)

    return (
      <Tooltip
        disabled={!this.props.showTooltip}
        className="toolbar-share-user-wrapper"
        tooltipContent={
          <span>{display}</span>
        }
      >
        <UserIcon {...{ avatar, color, name }} />
      </Tooltip>
    )
  }
}



// WEBPACK FOOTER //
// ./app/components/ToolBar/Users/User.js