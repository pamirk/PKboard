import React, { Component } from 'react'
import classNames from 'classnames'
import { I18nextProvider, translate } from 'react-i18next';

import { API_URL } from '../../util/io'
import i18n from '../../i18n';

class Callout extends Component {
  state = {
  
  }

  handleClose = () => {
    this.props.onClose(true)
  }

  render() {

    const { t } = this.props;

    return (
      <div
        className={classNames(
          'accounts-callout',
          'clearfix',
          'transition-whoosh',
          { 'accounts-callout-active' : this.props.active }
        )}
      >
        <div className="accounts-callout-header clearfix">
          <div className="accounts-callout-header-title">
            {t('Accounts/callout_title')}
          </div>
          <div className="accounts-callout-header-icon">
            <img
              className="fit-parent"
              src="/static/assets/img/icons/hey.png"
            />
          </div>
          <div
            className="accounts-callout-header-close"
            onClick={this.handleClose}
          ></div>
        </div>
        <div className="accounts-callout-caption">
          {t('Accounts/callout_caption')}
        </div>
        <div className="accounts-callout-action clearfix">
          <div className="accounts-callout-signup" onClick={this.props.toggleSignupModalActive}>{t('Accounts/sign_up')}</div>
          <a href={API_URL + '/auth/google'}>
          <div className="accounts-callout-google clearfix">
            <div className="accounts-callout-google-icon"><img className="fit-parent" src="/static/assets/img/icons/google.png" /></div>
            <div className="accounts-callout-google-caption">{t('Accounts/sign_up_google')}</div>
          </div>
          </a>
        </div>
        <div className="accounts-callout-extra clearfix">
          <div className="accounts-callout-extra-caption">{t('Accounts/already_have_account')}</div>
          <div className="accounts-callout-extra-action" onClick={this.props.toggleSigninModalActive}>{t('Accounts/sign_in')}</div>
        </div>
      </div>
    )
  }
}

export default translate("translations")(Callout)


// WEBPACK FOOTER //
// ./app/components/Accounts/callout.js