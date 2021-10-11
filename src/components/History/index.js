import React, { Component } from 'react'
import classNames from 'classnames'
import Callout from '../Accounts/callout'
import HistorySub from './HistorySub'
import { I18nextProvider, translate } from 'react-i18next'
import i18n from '../../i18n'

class History extends Component {
  renderSub() {
    let { userToken } = this.props

    if (!userToken) {
      return (
        <div className="history-panel-accounts-callout">
          <Callout {...this.props} />
        </div>
      )
    }

    return (
      <HistorySub {...this.props} />
    )
  }

  render() {
    const { userToken, t } = this.props

    return (
      <div className={classNames(
        'history',
        this.props.active && 'history-active'
      )}>
        <div
          className="history-backdrop"
          onClick={this.props.setHistoryPanelInactive}
        />
        <div className="history-panel transition-whoosh">
          <div className="history-header clearfix">
            <div className="history-header-icon"></div>
            <div className="history-header-title">{t('History/history_title')}</div>
            <div
              className="history-header-close"
              onClick={this.props.setHistoryPanelInactive}
            />
          </div>
          {this.renderSub()}
        </div>
      </div>
    )
  }
}

History.propTypes = {
  
}

export default translate("translations")(History)



// WEBPACK FOOTER //
// ./app/components/History/index.js