import React, { Component } from 'react'
import { I18nextProvider, translate } from 'react-i18next';
import i18n from '../i18n';

class HelpSidebar extends Component {

  render() {
    const { t } = this.props;
    return (
      <div className={[
          'help-sidebar',
          this.props.helpSidebarActive ? 'help-sidebar-active' : ''
        ].join(' ')}>
        <div className="help-sidebar-close transition-whoosh" onClick={this.props.setHelpSidebarInActiveWrapper} onTouchStart={this.props.setHelpSidebarInActiveWrapper}>
          <div className="help-sidebar-close-icon"></div>
        </div>
        <div className="help-sidebar-content transition-whoosh">
          <div className="help-sidebar-logo"></div>
          <div className="help-sidebar-intro">{t('HelpSidebar/caption')}</div>
          <div className="help-sidebar-value">
            <div className="help-sidebar-value-item help-sidebar-value-collaboration clearfix">
              <div className="help-sidebar-value-icon"></div>
              <div className="help-sidebar-value-content">
                <div className="help-sidebar-value-title">{t('HelpSidebar/collaboration')}</div>
                <div className="help-sidebar-value-subtitle">{t('HelpSidebar/collaboration_caption')}</div>
              </div>
            </div>
            <div className="help-sidebar-value-item help-sidebar-value-onboarding clearfix">
              <div className="help-sidebar-value-icon"></div>
              <div className="help-sidebar-value-content">
                <div className="help-sidebar-value-title">{t('HelpSidebar/onboarding')}</div>
                <div className="help-sidebar-value-subtitle">{t('HelpSidebar/onboarding_caption')}</div>
              </div>
            </div>
            <div className="help-sidebar-value-item help-sidebar-value-responsive clearfix">
              <div className="help-sidebar-value-icon"></div>
              <div className="help-sidebar-value-content">
                <div className="help-sidebar-value-title">{t('HelpSidebar/platform')}</div>
                <div className="help-sidebar-value-subtitle">{t('HelpSidebar/platform_caption')}</div>
              </div>
            </div>
          </div>
          <div className="help-sidebar-tools">
            <div className="help-sidebar-tools-caption">{t('HelpSidebar/tools')}</div>
            <div className="help-sidebar-tools-item help-sidebar-tools-pen clearfix">
              <div className="help-sidebar-tools-icon"><span></span></div>
              <div className="help-sidebar-tools-name">{t('Item/pencil')} <span className="help-key">P</span></div>
            </div>
            <div className="help-sidebar-tools-item help-sidebar-tools-text clearfix">
              <div className="help-sidebar-tools-icon"><span></span></div>
              <div className="help-sidebar-tools-name">{t('Item/text')} <span className="help-key">T</span></div>
            </div>
            <div className="help-sidebar-tools-item help-sidebar-tools-erase clearfix">
              <div className="help-sidebar-tools-icon"><span></span></div>
              <div className="help-sidebar-tools-name">{t('Item/eraser')} <span className="help-key">E</span></div>
            </div>
            <div className="help-sidebar-tools-item help-sidebar-tools-undo clearfix">
              <div className="help-sidebar-tools-icon"><span></span></div>
              <div className="help-sidebar-tools-name">{t('Item/undo')} <span className="help-sidebar-tools-undo-key">Ctrl/Cmd +</span><span className="help-key">Z</span></div>
            </div>
          </div>
          <div className="help-sidebar-shortcuts">
            <div className="help-sidebar-shortcuts-caption">{t('HelpSidebar/shortcuts')}</div>
            <div className="help-sidebar-shortcuts-content">
              <div className="help-sidebar-shortcuts-item">
                <div className="help-sidebar-shortcuts-function">{t('HelpSidebar/shortcuts_space')}</div>
                <div className="help-sidebar-shortcuts-key">
                  <span className="help-sidebar-shortcuts-key-text">Hold</span>
                  <span className="help-key">SPACE</span>
                </div>
              </div>
              <div className="help-sidebar-shortcuts-item">
                <div className="help-sidebar-shortcuts-function">{t('HelpSidebar/shortcuts_rectangle')}</div>
                <div className="help-sidebar-shortcuts-key">
                  <span className="help-key">R</span>
                  <span className="help-sidebar-shortcuts-key-text">+ Click / Space</span>
                </div>
              </div>
              <div className="help-sidebar-shortcuts-item">
                <div className="help-sidebar-shortcuts-function">{t('HelpSidebar/shortcuts_circle')}</div>
                <div className="help-sidebar-shortcuts-key">
                  <span className="help-key">C</span>
                  <span className="help-sidebar-shortcuts-key-text">+ Click / Space</span>
                </div>
              </div>
              <div className="help-sidebar-shortcuts-item">
                <div className="help-sidebar-shortcuts-function">{t('HelpSidebar/shortcuts_line')}</div>
                <div className="help-sidebar-shortcuts-key">
                  <span className="help-sidebar-shortcuts-key-text">Hold</span>
                  <span className="help-key">SHIFT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

HelpSidebar.propTypes = {

}

export default translate("translations")(HelpSidebar)


// WEBPACK FOOTER //
// ./app/components/HelpSidebar.js