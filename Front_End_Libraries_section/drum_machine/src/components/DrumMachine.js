import React from "react";
import Drum from "./Drum";
import Header from "./Header";
import Footer from "./Footer";
import drumAudio from "./drumAudio";

class DrumMachine extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            text: "Press a key to make a sound, or click one of the buttons"
        }
    }

    handleText = (text) => {
        this.setState({
            text
        })
    }

    render() {
        return(
            <div id="drum-machine">
                <Header />
                <hr />
                <h1 id="display">{this.state.text}</h1>
                <div className="grid">
                    {drumAudio.map(item => (
                        <Drum
                            id={item.id}
                            key={item.id}
                            keyBoard={item.keyBoard}
                            url={item.url}
                            handleText={this.handleText}
                        />
                    ))}
                </div>
                <Footer />
            </div>
        )
    }
}

export default DrumMachine;