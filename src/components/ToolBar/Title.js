import React, { Component } from 'react'
import { I18nextProvider, translate } from 'react-i18next';
import i18n from '../../i18n';

class Title extends Component {
  state = {}

  onKeyDown = (e) => {
    e.stopPropagation()
  }

  onChange = (e) => {
    let newValue = e.target.value.replace(/^ +/, '')

    if (newValue == this.props.title) {
      newValue = null
    }

    this.setState({
      title: newValue
    })
  }

  onSubmit = (e) => {
    e.preventDefault()

    if (this.state.title != null) {
      this.props.onTitleChange(this.state.title.trim())
      this.setState({
        title: null
      })
    }

    this.titleInput.blur()
  }

  getTitleValue = () => {
    if (this.state.title != null) {
      return this.state.title
    }
    return this.props.title || ''
  }

  inputRef = (input) => {
    this.titleInput = input
  }

  render() {
    const { t } = this.props;

    return (
      <div className="toolbar-title">
        <form onSubmit={this.onSubmit}>
          <input
            className="toolbar-title-input"
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            placeholder={t('Title/placeholder')}
            ref={this.inputRef}
            spellCheck={false}
            value={this.getTitleValue()}
          />
          <div
            className={[
              'toolbar-title-caption',
              'transition-whoosh',
              this.state.title != null ? 'visible' : ''
            ].join(' ')}
          >
            {t('Title/enter_helper')}
          </div>
        </form>
      </div>
    )
  }
}

export default translate("translations")(Title)
