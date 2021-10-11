import React, { Component } from 'react'
import Tooltip from '../Tooltip'
import { SHORTCUTS_REVERSE } from '../../lib/tool-names'
import { capitalize } from '../../util/text'

import { I18nextProvider, translate } from 'react-i18next';
import i18n from '../../i18n';

class Item extends Component {
  onClick = (e) => {
    e.preventDefault()
    this.props.onClick(this.props.tool)
  }

  render() {
    const { t } = this.props;

    let shortcut = ''
    shortcut = SHORTCUTS_REVERSE[this.props.tool]

    return (
      <span className="toolbar-item-wrapper">
        <Tooltip tooltipContent={t('Item/'+this.props.tool) + ' (' + shortcut + ')'}>
          <span
            className={[
                'toolbar-item',
                `toolbar-${this.props.tool}`,
                this.props.active ? 'toolbar-active' : ''
              ].join(' ')}
            onClick={this.onClick}
            onTouchStart={this.onClick}
          >
            <div className="toolbar-icon"></div>
          </span>
        </Tooltip>
      </span>
    )
  }
}

export default translate("translations")(Item)



// WEBPACK FOOTER //
// ./app/components/ToolBar/Item.js