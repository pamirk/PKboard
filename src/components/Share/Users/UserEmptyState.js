import React, { Component } from 'react'
import { I18nextProvider, translate } from 'react-i18next';
import i18n from '../../../i18n';

class UserEmptyState extends Component {
  render() {
    const { t } = this.props;
    return (
      <div className="toolbar-share-user-empty-state">{t('SharePopover/empty')}</div>
    )
  }
}

export default translate("translations")(UserEmptyState)



// WEBPACK FOOTER //
// ./app/components/Share/Users/UserEmptyState.js