import React, { Component } from 'react'
import { I18nextProvider, translate } from 'react-i18next';
import i18n from '../../i18n';
import Item from './Item'
import EraseAllButton from './EraseAllButton'
import Title from './Title'
import * as tools from '../../lib/tool-names'

import ColorPicker from '../ColorPicker'
import Users from './Users'
import Menu from './Menu'
import Feedback from './Feedback/index'

const FEEDBACK = 'feedback'
const SHARE = 'share'
const USERS = 'users'
const MENU = 'menu'




class ToolBar extends Component {
  state = {
    activeMenu: null
  }

  toggleMenu = (menu) => {
    let newValue = menu

    if (menu === this.state.activeMenu) newValue = null

    this.setState({
      activeMenu: newValue
    })
  }

  render() {
    const { t, isEmbedded } = this.props
    let extension
    if (this.props.currentTool == tools.ERASER) {
      extension = <EraseAllButton onClick={this.props.onTriggerClear} />
    } else {
      extension = (
        <ColorPicker
          color={this.props.currentColor}
          onChange={this.props.onChangeColor}
          blackboardActive={this.props.blackboardActive}
        />
      )
    }

    return (
      <div className="toolbar clearfix">
        {isEmbedded
          ? null
          : <div className="toolbar-header clearfix">
            <Menu
              active={this.state.activeMenu === MENU}
              toggleMenu={(e) => {this.toggleMenu(MENU)}}
              onClick={(e) => {e.preventDefault(); this.toggleMenu(MENU)}}
              setHistoryPanelActive={this.props.setHistoryPanelActive}
              blackboardActive={this.props.blackboardActive}
              toggleBlackboard={this.props.toggleBlackboard}
              autocorrectActive={this.props.autocorrectActive}
              toggleAutocorrect={this.props.toggleAutocorrect}
              userToken={this.props.userToken}
            />
            <Title
              title={this.props.title}
              onTitleChange={this.props.onTitleChange}
            />
          </div>}
        <div className="toolbar-draw clearfix">
          <Item
            active={this.props.currentTool == tools.PENCIL}
            tool={tools.PENCIL}
            onClick={this.props.changeToolWrapper}
          />
          <Item
            active={this.props.currentTool == tools.LINE}
            tool={tools.LINE}
            onClick={this.props.changeToolWrapper}
          />
          <Item
            active={this.props.currentTool == tools.TEXT}
            tool={tools.TEXT}
            onClick={this.props.changeToolWrapper}
          />
          <Item
            active={this.props.currentTool == tools.ERASER}
            tool={tools.ERASER}
            onClick={this.props.changeToolWrapper}
          />
          <Item
            className="toolbar-item toolbar-undo"
            tool="undo"
            onClick={this.props.deleteLastPathWrapper}
          />
          {extension}
        </div>
        {isEmbedded
          ? null
          : <div className="toolbar-action clearfix">
              <div 
              className="toolbar-help"
              onClick={this.props.setHelpSidebarActive}
              onTouchStart={this.props.setHelpSidebarActive}>{t('Help')}</div>
              <Feedback
                active={this.state.activeMenu === FEEDBACK}
                onClick={e => this.toggleMenu(FEEDBACK)}
              />
            </div>}
      </div>
    )
  }
}

export default translate("translations")(ToolBar)



// WEBPACK FOOTER //
// ./app/components/ToolBar/index.js