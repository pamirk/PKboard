import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Users from './Users'
import ShareButton from './ShareButton'
import DocumentEvents from 'react-document-events'
import { I18nextProvider, translate } from 'react-i18next';
import i18n from '../../i18n';

const SHARE = 'share'
const USERS = 'users'

class Share extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeMenu: null,
    }
  }

  toggleMenu = menu => () => {
    let newValue = menu

    if (menu === this.state.activeMenu) newValue = null

    this.setState({
      activeMenu: newValue
    })
  }

  toggleUsersMenu = this.toggleMenu(USERS)
  toggleShareMenu = this.toggleMenu(SHARE)

  render() {
    const { t } = this.props
    let { users } = this.props

    return (
      <div className={classNames(
        'share',
        this.props.confirmEmailMessageActive ? 'share-email-confirm-message-active': ''
        )}>
        {this.state.activeMenu
          ? <DocumentEvents onKeyDown={this.handleKeyDown} />
          : null}
        <Users
          users={this.props.users}
          onChangeName={this.props.onChangeName}
          active={this.state.activeMenu === USERS}
          onClick={this.toggleUsersMenu}
          userToken={this.props.userToken}
          blackboardActive={this.props.blackboardActive}
        />
        {!this.props.userToken
          ? <div className="signup-button" onClick={this.props.toggleSignupModalActive}>{t('Accounts/sign_up')}</div>
          : null}
        <ShareButton
          active={this.state.activeMenu === SHARE}
          onClick={this.toggleShareMenu}
        />
      </div>
    )
  }
}

export default translate("translations")(Share)

Share.propTypes = {
  users: PropTypes.object
}



// WEBPACK FOOTER //
// ./app/components/Share/index.js