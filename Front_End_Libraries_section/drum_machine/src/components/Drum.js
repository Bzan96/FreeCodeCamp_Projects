import React from "react";

class Drum extends React.Component {
    handleClick = () => {
        this.audio.play()
        this.audio.currentTime = 0
        this.props.handleText(this.props.id)
    }

    handleKeyDown = (event) => {
        if(event.keyCode === this.props.id.charCodeAt() ) {
            this.audio.play()
            this.audio.currentTime = 0
            this.props.handleText(this.props.keyBoard)
        }
    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyDown)
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown)
    }
    
    render() {
        return(
            <div
                className="drum-pad"
                id={this.props.id}
                onClick={this.handleClick}
            >
                <p>{this.props.id}</p> 
                <audio
                    className="clip"
                    ref={(input) => {this.audio = input }}
                    id={this.props.keyBoard}
                    src={this.props.url}
                />
            </div>
        )
    }
}

export default Drum;