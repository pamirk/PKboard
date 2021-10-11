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
        below
        disabled={!this.props.showTooltip}
        className="toolbar-share-user-wrapper"
        tooltipContent={
          <span>{display}</span>
        }
      >
        <UserIcon {...{ avatar, color, name }} blackboardActive={this.props.blackboardActive} />
      </Tooltip>
    )
  }
}



// WEBPACK FOOTER //
// ./app/components/Share/Users/User.js