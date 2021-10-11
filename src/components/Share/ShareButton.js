import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Clipboard from 'react-clipboard.js'
import PopupTooltip from '../PopupTooltip'
import { I18nextProvider, translate } from 'react-i18next';
import i18n from '../../i18n';

class ShareButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sharePopover: false,
    };
  }

  showPopover = () => {
    this.setState({
      sharePopover: true
    })
    setTimeout(() => this.hidePopover(), 1500);
  }

  hidePopover = () => {
    this.setState({
      sharePopover: false
    })
  }

  onSuccess = () => {
    this.showPopover();
  }

  render() {
    const { t } = this.props;
    let { users } = this.props

    return (
      <div className="toolbar-share clearfix">
        <Clipboard
          data-clipboard-text={window.location.href}
          className="toolbar-share-button"
          onSuccess={this.onSuccess}
        >{t('ShareButton/share')}</Clipboard>
        <div className={[
          'toolbar-share-confirmation transition-whoosh clearfix',
          this.state.sharePopover ? 'toolbar-share-confirmation-active' : ''
        ].join(' ')}>
          <div className="toolbar-share-confirmation-icon"><img className="fit-parent" src="/static/assets/img/icons/check.png" /></div>
          <div className="toolbar-share-confirmation-caption">{t('ShareButton/success')}</div>
        </div>
      </div>
    )
  }
}

ShareButton.propTypes = {
  users: PropTypes.object
}

export default translate("translations")(ShareButton)


// WEBPACK FOOTER //
// ./app/components/Share/ShareButton.js