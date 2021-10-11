import mixpanel from '../../../lib/mixpanel'

import React, { Component } from 'react'
import PopoverUser from './PopoverUser'
import UserIcon from './UserIcon'
import UserEmptyState from './UserEmptyState'
import id from '../../../util/id'
import { displayName } from '../../../util/display-names'

export const RETURN = 13

export default class Popover extends Component {
  onKeyDown = (e) => {
    e.stopPropagation()
    if (e.which == RETURN) {
      mixpanel.track("UsernameSet")
      this.props.onCompleteInput()
    }
  }

  onChangeName = (e) => {
    let name = e.currentTarget.value
    if (!name) name = null

    this.props.onChangeName(name)
  }

  render() {
    let users = []
    let me = this.props.users[id]
    for (var userId in this.props.users) {
      if (userId === id) continue 
      users.push(
        <PopoverUser
          {...this.props.users[userId]}
          key={userId}
          id={userId}
        />
      )
    }

    return (
      <div className={[
          'toolbar-share-user-popover transition-whoosh',
          this.props.active ? 'toolbar-share-user-popover-active' : ''
        ].join(' ')}>
        {users.length > 0 ? users : <UserEmptyState />}
        {me ? (
          <div className="toolbar-share-user-popover-item toolbar-share-user-popover-you clearfix">
            <UserIcon
              avatar={me.avatar}
              color={me.color}
              name={me.name}
            />
            <input
              autoFocus
              className="toolbar-share-user-popover-you-name"
              placeholder={displayName(id, me.name, me.avatar)}
              value={me.name || ''}
              onChange={this.onChangeName}
              onKeyDown={this.onKeyDown}
            />
          </div>
        ) : null}
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ./app/components/ToolBar/Users/Popover.js