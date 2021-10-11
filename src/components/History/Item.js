import React, { Component } from 'react'
import moment from 'moment'
import Path from '../Path'

export default class HistoryItem extends Component {
  render() {
    let { board, room, title, timestamp } = this.props

    return (
      <div className="history-item">
        <a href={`/${room}`} target="_blank">
          <div className="history-item-thumbnail">
            <svg width="100%" height="100%">
              {board.map(itm => (
                <Path key={itm.id}
                  scale={{ scale: 100, offsetX: 120, offsetY: 68 }}
                  data={itm}
                  blackboardActive={this.props.blackboardActive}
                />
              ))}
            </svg>
          </div>
          <div className="history-item-title">
            {title || (
              <span className="history-item-title-empty">Untitled</span>
            )}
          </div>
          <div className="history-item-caption">
            {moment(new Date(timestamp)).fromNow()}
          </div>
        </a>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ./app/components/History/Item.js