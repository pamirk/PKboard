import React, { Component } from 'react'
import classNames from 'classnames'
import { getBoardHistory } from '../../util/history'
import HistoryItem from './Item'
import { I18nextProvider, translate } from 'react-i18next'
import i18n from '../../i18n'
import mixpanel from '../../lib/mixpanel'

class HistorySub extends Component {
  state = {
    history: []
  }

  componentWillMount() {
    let { userToken } = this.props
    mixpanel.track("GetUserHistory")
    getBoardHistory(userToken.getToken(), history => {
      this.setState({ history })
    })
  }

  render() {
    const { t } = this.props;
    let { history } = this.state

    return (
      <div className="history-content">

        {/* Set Carousel width to:
        240 * (# of Board + 1) + 20 * (# of Board)
        EX: 5 Board Items = 240 * (5 + 1) + 20 * (5)
        */}
        
        <div
          className="history-carousel clearfix"
          style={{ width: 260 * (history.length) }}
        >
          {history.map(boardListItem => (
            <HistoryItem
              {...boardListItem}
              key={boardListItem.room}
              blackboardActive={this.props.blackboardActive}
            />
          ))}
        </div>
      </div>
    )
  }
}

export default translate("translations")(HistorySub)



// WEBPACK FOOTER //
// ./app/components/History/HistorySub.js