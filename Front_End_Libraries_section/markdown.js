import React from 'react';
import ReactDOM from 'react-dom';

'use strict';

const e = React.createElement;

class Markdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textarea: ''
        };
        this.handleChange = this.handleChange.bind(this); 
    }
    
    handleChange(event) {
        this.setState({
            textarea: event.target.value
        });
    }
    render() {
        return e(
            <div id="editor">
                <textarea value = {this.state.textarea} onChange = {this.handleChange.bind(this)}/>
                <h4>Markdown:</h4>
                <p id="preview">{this.state.textarea}</p>
            </div>,
            document.getElementById('markdown_previewer')
        );
    }
};

//const domContainer = document.querySelector('#markdown_previewer'); // domContainer
ReactDOM.render(e(Markdown), document.getElementById('markdown_previewer'));