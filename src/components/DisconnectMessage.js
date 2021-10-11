import React, { Component } from 'react'
import { I18nextProvider, translate } from 'react-i18next';
import i18n from '../i18n';

class DisconnectMessage extends Component {

  render() {
    const { t } = this.props;
    return (
      <div className="disconnected">
        <div className="disconnected-message">{t('DisconnectMessage/message')}</div>
        <a onClick={this.props.dismissConfirmEmailMessage} className="disconnected-action">{t('DisconnectMessage/reload')}</a>
      </div>
    )
  }
}

export default translate("translations")(DisconnectMessage)


// WEBPACK FOOTER //
// ./app/components/DisconnectMessage.js