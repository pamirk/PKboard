import React, { Component } from 'react'
import User from './User'
import id from '../../../util/id'
import Popover from './Popover'

export default class Users extends Component {
  
  clickProps = () => {
    if (window.touchEvent) {
      return {
        onTouchStart: this.props.onClick
      }
    } else {
      return {
        onClick: this.props.onClick
      }
    }
  }

  render() {
    let users = []

    for (var userId in this.props.users) {
      users.push(
        <User
          {...this.props.users[userId]}
          key={userId}
          id={userId}
          showTooltip={!this.props.active}
        />
      )
    }

    return (
      <span className="toolbar-users-wrapper">
        <div
          className="toolbar-share-user clearfix"
          {...this.clickProps()}
        >
          {/* Set Name Call Out to display: block after a user drew N number of paths to have the user set a name.  */}
          {/*
          <div className="toolbar-share-name-callout">
            <div className="toolbar-share-name-callout-title">
              Click here to set your name!
            </div>
            <div className="toolbar-share-name-callout-caption">
              If you prefer, you can stay as a raccoon.
            </div>
            <div className="toolbar-share-name-callout-close" />
          </div>
          */}
          {/*
          <div className="toolbar-share-user-extra">
            +3
          </div>
          */}
          {users.reverse()}
        </div>
        <Popover
          users={this.props.users}
          onChangeName={this.props.onChangeName}
          onCompleteInput={this.props.onClick}
          active={this.props.active}
        />
      </span>
    )
  }
}



// WEBPACK FOOTER //
// ./app/components/ToolBar/Users/index.js