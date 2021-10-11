import React, { Component } from 'react'
import Textarea from 'react-textarea-autosize'
import 'whatwg-fetch'
import Promise from 'promise-polyfill'
import { I18nextProvider, translate } from 'react-i18next';
import i18n from '../../../i18n';

class Feedback extends Component {
  
  state = {
    feedbackConfirmActive: false,
    shiftPressed: false
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

  setFeedbackConfirmActive = () => {
    this.setState({
      feedbackConfirmActive: true
    })
    setTimeout(() => this.dismissFeedback(), 1000);
  }

  dismissFeedback = () => {
    this.props.onClick()
    setTimeout(() => this.hideFeedbackConfirmActive(), 1000);
  }

  hideFeedbackConfirmActive = () => {
    this.setState({
      feedbackConfirmActive: false
    })
  }

  textareaOnKeyDown = (e) => {
    // shift key pressed
    if(e.keyCode == 16) {
      this.setState({
        shiftPressed: true
      })
    } else if(e.keyCode == 13 && !this.state.shiftPressed) {
      let baseURL = 'https://docs.google.com/forms/d/e/1FAIpQLSeb74V97sHMCffSpXhXvH4lhrAhU2PyX24rth5T-sl5EmkKoA/formResponse?entry.5184807='
      var url = (baseURL + encodeURIComponent(this.state.feedbackValue))

      // Make Promises work in IE
      if(!window.Promise) {
        window.Promise = Promise
      }
      
      fetch(url, {'mode': 'no-cors'})

      this.setFeedbackConfirmActive()
      e.target.value = ''
    }
    e.stopPropagation()
  }

  textareaOnKeyUp = (e) => {
    if(e.keyCode == 16) {
      this.setState({
        shiftPressed: false
      })
    }
  }

  textareaOnChange = (e) => {
    this.setState({
      feedbackValue: e.target.value
    })
  }

  render() {
    const { t } = this.props;
    return (
      <div className={[
          'feedback-wrapper',
          this.props.active ? 'feedback-popover-active' : ''
          ].join(' ')}>
        <div
          className="feedback clearfix"
          {...this.clickProps()}
        >
          <div className="feedback-caption">{t('Feedback/feedback')}</div>
        </div>
        <div className={[
          'feedback-popover transition-whoosh',
          this.state.feedbackConfirmActive ? 'feedback-popover-confirm-active' : ''
          ].join(' ')}>
          <div className="feedback-popover-content transition-linear">
            <div className="feedback-popover-title">
              {t('Feedback/feedback_title')}
            </div>
            <div className="feedback-popover-caption">
              {t('Feedback/feedback_caption')}
            </div>
            {/* IMPORTANT: remove onClick handler and call this.setFeedbackConfirmActive upon form submission. */}
            <Textarea
              autoFocus
              rows={2}
              className="feedback-popover-input"
              placeholder={t('Feedback/feedback_placeholder')}
              onKeyUp={this.textareaOnKeyUp}
              onKeyDown={this.textareaOnKeyDown}
              onChange={this.textareaOnChange}
            />
            <div className="feedback-helper transition-whoosh">{t('Feedback/enter_helper')}</div>
          </div>
          <div className="feedback-popover-confirm transition-whoosh">
            <div className="feedback-popover-confirm-icon"></div>
            <div className="feedback-popover-confirm-caption">{t('Feedback/thank_you')}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default translate("translations")(Feedback)


// WEBPACK FOOTER //
// ./app/components/ToolBar/Feedback/index.js