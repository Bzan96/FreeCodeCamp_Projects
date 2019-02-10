import React from "react";
import marked from "marked";

const placeholder = `Here are some examples of what you can write:
  # h1 - Heading
  ## h2 - Sub-heading
  
  [explainer](https://www.nhl.com) - A link
  
  **bold text** || *italic text*
  
  \`<div></div>\` - Some code
  
  \`\`\`
  function hasMarkdown(site) {
  if(site_has_markdown) {
      return leave_immediately;
  } else {
    return stay_for_a_while
  }
  }
  \`\`\`

  - You
  -- Can

  1. Also
  1. Make
  1. Lists

  > Block Quote  
  >This is in fact the same markdown system  
  that is used  
  on reddit  
  ~they must have stolen it~
  
  And images...
  [Phil Kessel is a Stanley Cup Champion](https://ftw.usatoday.com/2017/08/phil-kessel-hot-dogs-stanley-cup-legend)
`

class MarkdownPreviewer extends React.Component {
  constructor() {
    super()
    this.state = {
      text: placeholder,
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    this.setState({
      text: event.target.value,
    })
  }

  changeMarkup(value) {
    return { __html: marked(value, {sanitize: true}) };
  }

  render() {
    return(
      <div className="container">
        <h1>User Input</h1>
        <textarea
          id="editor"
          type="text"
          name="text"
          value={this.state.text}
          onChange={this.handleChange}
          cols="60"
          rows="20"
        >{this.state.text}
        </textarea>
        <h1>Markdown Output</h1>
        <div id="preview" dangerouslySetInnerHTML={ this.state.text ? this.changeMarkup(this.state.text) : this.changeMarkup(this.state.placeholder) } />
        <h1>Normal Output</h1>
        <div id="extra">{this.state.text}</div>
      </div>
    )
  }
}

export default MarkdownPreviewer;