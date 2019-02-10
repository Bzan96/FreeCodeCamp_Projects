import React from "react";
// import Drum from "./Drum";
import Header from "./Header";
import Footer from "./Footer";
import drumAudio from "./drumAudio";

const sounds = drumAudio.map(item => {
    return item.url;
})

const keyCodes = drumAudio.map(item => {
    return item.keyCode;
})

const ids = drumAudio.map(item => {
    return item.id;
})

class DrumMachine extends React.Component {
    constructor() {
        super()
        this.state = {
            text: ""
        }

        this.handleClick = this.handleClick.bind(this)
        this.handleText = this.handleText.bind(this)
        // One of the rare cases ref is used is when you want to access media files
    }

    handleClick() {
        this.audioRef.play()
        this.audioRef.currentTime = 0
        this.handleText(this.state.id)
    }

    handleText() {
        this.setState({
            text: this.audioRef.id
        })
    }

    handleKeyDown(event) {
        if(event.keyCode === this.audio.keyCode) {
            this.audio.play()
            this.audio.currentTime = 0
            this.handleText(this.state.id)
        }
    }

    componentDidMount() {
        console.log("clickGO")
        document.addEventListener("keydown", this.handleClick)
    }

    componentWillUnMount() {
        console.log("clickNOTGO")
        document.removeEventListener("keydown", this.handleClick)
    }

    render() {
        return(
            // User story #1
            <div id="drum-machine">
                <Header />
                {/* User story #2 */}
                <h1 id="display">{this.state.text}</h1>
                
                {/* User story #3 */}
                <div className="grid">
                    <div
                        className="drum-pad"
                        // User story #5
                        onClick={this.handleClick}
                        >
                        <p>{ids[0]}</p> 
                        {/* User story #4 */}
                        <audio
                            className="clip"
                            // ref lets us use this.audio to refer back to this specific audio element
                            ref={(input) => {this.audioRef = input }}
                            id={ids[0]}
                            src={sounds[0]}
                            type="audio/mp3"
                            handleText={this.handleText}
                        />
                    </div>
                    <div
                        className="drum-pad"
                        onClick={this.handleClick}
                    ><p>{ids[1]}</p>
                        <audio
                            className="clip"
                            ref={(input) => {this.audioRef = input }}
                            id={ids[1]}
                            src={sounds[1]}
                            type="audio/mp3"
                            handleText={this.handleText}
                        />
                    </div>
                    <div
                        className="drum-pad"
                        onClick={this.handleClick}
                    ><p>{ids[2]}</p>
                        <audio
                            className="clip"
                            ref={(input) => {this.audioRef = input }}
                            id={ids[2]}
                            src={sounds[2]}
                            type="audio/mp3"
                            handleText={this.handleText}
                        />
                    </div>
                    <div
                        className="drum-pad"
                        onClick={this.handleClick}
                    ><p>{ids[3]}</p>
                        <audio
                            className="clip"
                            ref={(input) => {this.audioRef = input }}
                            id={ids[3]}
                            src={sounds[3]}
                            type="audio/mp3"
                            handleText={this.handleText}
                        />
                    </div>
                    <div
                        className="drum-pad"
                        onClick={this.handleClick}
                    ><p>{ids[4]}</p>
                        <audio
                            className="clip"
                            ref={(input) => {this.audioRef = input }}
                            id={ids[4]}
                            src={sounds[4]}
                            type="audio/mp3"
                            handleText={this.handleText}
                        />
                    </div>
                    <div
                        className="drum-pad"
                        onClick={this.handleClick}
                    ><p>{ids[5]}</p>
                        <audio
                            className="clip"
                            ref={(input) => {this.audioRef = input }}
                            id={ids[5]}
                            src={sounds[5]}
                            type="audio/mp3"
                            handleText={this.handleText}
                        />
                    </div>
                    <div
                        className="drum-pad"
                        onClick={this.handleClick}
                    ><p>{ids[6]}</p>
                        <audio
                            className="clip"
                            ref={(input) => {this.audioRef = input }}
                            id={ids[6]}
                            src={sounds[6]}
                            type="audio/mp3"
                            handleText={this.handleText}
                        />
                    </div>
                    <div
                        className="drum-pad"
                        onClick={this.handleClick}
                    ><p>{ids[7]}</p>
                        <audio
                            className="clip"
                            ref={(input) => {this.audioRef = input }}
                            id={ids[7]}
                            src={sounds[7]}
                            type="audio/mp3"
                            handleText={this.handleText}
                        />
                    </div>
                    <div
                        className="drum-pad"
                        onClick={this.handleClick}
                    ><p>{ids[8]}</p>
                        <audio
                            className="clip"
                            ref={(input) => {this.audioRef = input }}
                            id={ids[8]}
                            src={sounds[8]}
                            type="audio/mp3"
                            handleText={this.handleText}
                        />
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}

export default DrumMachine;