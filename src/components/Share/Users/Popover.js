import mixpanel from '../../../lib/mixpanel'

import React, { Component } from 'react'
import PopoverUser from './PopoverUser'
import UserIcon from './UserIcon'
import UserEmptyState from './UserEmptyState'
import id from '../../../util/id'
import { displayName } from '../../../util/display-names'
import { I18nextProvider, translate } from 'react-i18next';
import i18n from '../../../i18n';

export const RETURN = 13
export const ESC = 27

class Popover extends Component {
  onKeyDown = (e) => {
    e.stopPropagation()
    if (e.which == RETURN || e.which === ESC) {
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
    const { t } = this.props;
    let users = []
    let me = this.props.users[id]

    // Adjust the name for signedInUser
    if( this.props.userToken ) {
      me.name = this.props.userToken.getFullName()
    }
    
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
              blackboardActive={this.props.blackboardActive}
            />
            <input            
              disabled={this.props.userToken}
              className="toolbar-share-user-popover-you-name"
              placeholder={t('SharePopover/placeholder')}
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

export default translate("translations")(Popover)


// WEBPACK FOOTER //
// ./app/components/Share/Users/Popover.js