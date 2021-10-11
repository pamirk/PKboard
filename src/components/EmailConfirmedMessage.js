import React, { Component } from 'react'
import { I18nextProvider, translate } from 'react-i18next';
import i18n from '../i18n';

class EmailConfirmedMessage extends Component {
  handleReload() {
    window.location.reload()
  }

  render() {
    const { t } = this.props;
    return (
      <div className="emailconfirmed">
        <div className="emailconfirmed-message">{t('EmailConfirmedMessage/message')}{this.props.userToken.get('firstName')}</div>
        <a onClick={this.props.dismissConfirmEmailMessage} className="emailconfirmed-action">{t('EmailConfirmedMessage/dismiss')}</a>
      </div>
    )
  }
}

export default translate("translations")(EmailConfirmedMessage)


// WEBPACK FOOTER //
// ./app/components/EmailConfirmedMessage.js