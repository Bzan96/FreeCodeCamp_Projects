import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Clock from "./Clock";

// Perhaps add some SASS so that the timer goes red
// when there is less than 10 seconds left?

class App extends React.Component {
    constructor() {
        super()
        this.state = {
            timer: 1500,
            break: 300,
            session: 1500,
            running: false,
            grindTime: true
        }
    }

    countDownTimer = () => {
        if(this.state.timer > 0 && this.state.grindTime === true) {
            this.setState({
                timer: this.state.timer - 1
            })
        } else if(this.state.timer === 0 && this.state.grindTime === true) {
            this.audio.play();
            this.audio.currentTime = 0;
            this.setState({
                grindTime: false,
                timer: this.state.break
            })
        } else if(this.state.timer > 0 && this.state.grindTime === false) {
            this.setState({
                timer: this.state.timer - 1
            })
        } else if(this.state.timer === 0 && this.state.grindTime === false) {
            this.audio.play();
            this.audio.currentTime = 0;
            this.setState({
                grindTime: true,
                timer: this.state.session
            })
        }
    }

    // In React you need a variabel that holds the temporary state of setInterval
    // if you want to be able to clear it.
    startTimer = () => {
        if(this.state.running === false) {
            this.intervalID = setInterval(this.countDownTimer, 1000);
            this.setState({
                running: true
            })
        } else {
            // This is just to fulfill the user story.
            // I want the pause button to use the fa-icon
            this.audio.pause();
            this.audio.currentTime = 0;
            clearInterval(this.intervalID);
            this.setState({
                running: false
            })
        }
    }

    pauseTimer = () => {
        clearInterval(this.intervalID);
        // Again, just to fulfill the user story...
        this.setState({
            running: false
        })
    }

    resetTimer = () => {
        this.audio.pause();
        this.audio.currentTime = 0;
        clearInterval(this.intervalID);
        this.setState({
            timer: 1500,
            break: 300,
            session: 1500
        })
    }

    upBreak = () => {
        if(this.state.break < 3600) {
            this.setState({
                break: this.state.break + 60
            })
        }
    }

    downBreak = () => {
        if(this.state.break > 60) {
            this.setState({
                break: this.state.break - 60
            })
        }
    }

    upSession = () => {
        if(this.state.session < 3600) {
            this.setState({
                session: this.state.session + 60,
                timer: this.state.session + 60
            })
        }
    }

    downSession = () => {
        if(this.state.session > 60) {
            this.setState({
                session: this.state.session - 60,
                timer: this.state.session - 60
            })
        }
    }

    render() {
        return(
            <div>
            <Header />
            <Clock
                upBreak={this.upBreak}
                downBreak={this.downBreak}
                upSession={this.upSession}
                downSession={this.downSession}
                startTimer={this.startTimer}
                pauseTimer={this.pauseTimer}
                resetTimer={this.resetTimer}
                data={this.state}
            />
            <audio id="beep" ref={(input) => {this.audio = input }} src="http://audio.marsupialgurgle.com/audio/successtrumpet.mp3"></audio>
            <Footer />
            </div>
        )
    }
}

export default App;