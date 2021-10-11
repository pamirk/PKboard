import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { API_URL } from '../../util/io'
import { I18nextProvider, translate } from 'react-i18next';
import i18n from '../../i18n';

class Menu extends Component {

  state = {
    languagePopoverActive: false,
    currentLanguage: 'en'
  }
    
    
  handleSignOut = e => {
    e.preventDefault()

    window.localStorage.removeItem('userToken')

    window.location.replace(window.location.pathname)
  }

  toggleLanguagePopoverActive = (e) => {
    this.setState({
      languagePopoverActive: !this.state.languagePopoverActive
    })
  }

  setLanguage = language => () => {
    this.setState({
      currentLanguage: language,
      languagePopoverActive: false
    })
    i18n.changeLanguage(language)
  }

  historyMenuOnclick = (e) => {
    this.props.onClick(e)
    this.props.setHistoryPanelActive()
  }

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
    const { t } = this.props;
    return (
      <div className="toolbar-menu">
        <div
          {...this.clickProps()}
          className={classNames(
          'toolbar-menu-button',
          this.props.active ? 'toolbar-menu-button-active' : ''
        )}
        />
        {this.props.active &&
          <div className="toolbar-menu-popover transition-whoosh toolbar-menu-popover-active">
            <div className="toolbar-menu-popover-header">
              <div className="toolbar-menu-popover-header-logo"></div>
            </div>
            <div className={classNames(
              'toolbar-menu-popover-dark-mode',
              'clearfix',
              this.props.blackboardActive ? 'toolbar-menu-popover-dark-mode-active': ''
              )} onClick={this.props.toggleBlackboard}>
              <div className="toolbar-menu-popover-icon"></div>
              <div className="toolbar-menu-popover-caption">{t('Menu/blackboard')}</div>
              <div className="toolbar-menu-popover-toggle"></div>
            </div>
            <div className={classNames(
              'toolbar-menu-popover-shape-detect',
              'clearfix',
              this.props.autocorrectActive ? 'toolbar-menu-popover-shape-detect-active': ''
              )} onClick={this.props.toggleAutocorrect}>
              <div className="toolbar-menu-popover-icon"></div>
              <div className="toolbar-menu-popover-caption">{t('Menu/shape_detection')}</div>
              <div className="toolbar-menu-popover-toggle"></div>
            </div>
            <div
              className="toolbar-menu-popover-item toolbar-menu-popover-new clearfix"
              onClick={this.props.toggleMenu}
              onTouchStart={this.props.toggleMenu}
            >
              <a href="/" target="_blank">
                <div className="toolbar-menu-popover-icon" />
                <div className="toolbar-menu-popover-caption">{t('Menu/new_board')}</div>
              </a>
            </div>
            <div
              className="toolbar-menu-popover-item toolbar-menu-popover-history clearfix"
              onClick={this.historyMenuOnclick}
              onTouchStart={this.props.onTouchStart}
            >
              <div className="toolbar-menu-popover-icon" />
              <div className="toolbar-menu-popover-caption">{t('Menu/history')}</div>
            </div>

            {this.props.userToken ?
            <div
              className="toolbar-menu-popover-item clearfix"
              onClick={this.props.signOut}
              onTouchStart={this.props.signOut}
            >
              <div className="toolbar-menu-popover-icon">
                <img
                  className="fit-height"
                  src="../../assets/img/icons/sign_out.svg"
                />
              </div>
              <div
                className="toolbar-menu-popover-caption"
                onClick={this.handleSignOut}
              >
                Sign Out
              </div>
            </div> : null}
            <a
              className="toolbar-menu-popover-item toolbar-menu-popover-download clearfix"
              href={`${API_URL}/export/${window.location.pathname.substring(1)}`}
              target="_blank"
            >
              <div className="toolbar-menu-popover-icon">
              </div>
              <div className="toolbar-menu-popover-caption">{t('Menu/save_as_image')}</div>
            </a>
            <div
              className="toolbar-menu-popover-item toolbar-menu-popover-language clearfix"
              onClick={this.toggleLanguagePopoverActive}
              onTouchStart={this.toggleLanguagePopoverActive}
            >
              <div className="toolbar-menu-popover-icon">
              </div>
              <div className="toolbar-menu-popover-caption">{t('Menu/language')}</div>
              <div className="toolbar-menu-popover-current-language">

              </div>
            </div>
           {/* <a
              className="toolbar-menu-popover-item toolbar-menu-popover-slack clearfix"
              href="https://slack.com/oauth/authorize?client_id=234408606565.233623311392&scope=commands"
              target="_blank"
            >
              <div className="toolbar-menu-popover-icon"></div>
              <div className="toolbar-menu-popover-caption">{t('Menu/get_slack_plugin')}</div>
            </a>
            <div className="toolbar-menu-popover-extra clearfix">
              <a href="/tos.html" target="_blank" className="toolbar-menu-popover-extra-item">{t('Menu/terms_of_service')}</a>
              <a href="/privacy.html" target="_blank" className="toolbar-menu-popover-extra-item">{t('Menu/privacy_policy')}</a>
            </div>*/}
            {this.state.languagePopoverActive && 
            <div className="toolbar-menu-language">
              <div className="toolbar-menu-language-item clearfix" onClick={this.setLanguage('en')}>
                <div className="toolbar-menu-language-icon"><img className="fit-height" src="../../assets/img/icons/language/EN.png" /></div>
                <div className="toolbar-menu-language-caption">English</div>
              </div>
              <div className="toolbar-menu-language-item clearfix" onClick={this.setLanguage('ko')}>
                <div className="toolbar-menu-language-icon"><img className="fit-height" src="../../assets/img/icons/language/KO.png" /></div>
                <div className="toolbar-menu-language-caption">한국어</div>
              </div>
            </div> }
          </div>}
      </div>
    )
  }
}

Menu.propTypes = {
  users: PropTypes.object
}

export default translate("translations")(Menu)