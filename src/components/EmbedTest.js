import React, { Component } from 'react'

export default class EmbedTest extends Component {
  render() {
    let { route, params } = this.props

    let styles = {
      padding: 80,
    }

    let frameStyles = {
      border: '1px solid #ccc',
    }

    return (
      <div className="embed-test" style={styles}>
        <h1>Embed Test</h1>
        <iframe
          style={frameStyles}
          src={`/embed/${params.room}`}
          width={window.innerWidth - 162}
          height={400}
        />
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ./app/components/EmbedTest.js