import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Screen from "./Screen";

/** Bug:
If you, for some reason, want to write 00000.00000, you can, but
that should really be reduced to 0.00000 automatically to save space.
*/

class Calculator extends React.Component {
    constructor() {
        super()
        this.state = {
            total: "",
        }
    }

    calculate = () => {
        // Eval is an unsafe function that shouldn't be used.
        // It's "safe" in this case because they user can't input custom strings.
        let result = "";
        let decimals = "";
        
        if(this.state.total[this.state.total.length-1].match(/\D/) ) {
            result = (eval(this.state.total.slice(0, this.state.total.length-1)) || "" ) + ""
            decimals = result.toString().split(".")[1]
        } else {
            result = (eval(this.state.total) || "" ) + ""
            decimals = result.toString().split(".")[1]
        }



        try {
            if(result.includes(".") && decimals.length > 4) {
                // Technically not correct math-wise since a number 5 or up doesn't round up.
                let cutOff = result.toString().split(".")[0] + "." + decimals.slice(0,4);
                this.setState({
                    total: cutOff
                })
            } else {
                this.setState({
                    total: result
                })
            }

        } catch(error) {
            this.setState({
                total: "error"
            })
        }
    }

    reset = () => {
        this.setState({
            total: ""
        })
    }

    handleValue = (value) => {
        let splitByOperator = this.state.total.split(/(-?\d+\.?\d*)/)
        let last = splitByOperator[splitByOperator.length-2]

        if(value === "=") {
            this.calculate()
        } else if(value === "C") {
            this.reset()
        } else if(this.state.total.length >= 15) {
            this.setState({
                total: this.state.total
            })
            alert("The calculator doesn't allow more characters, sorry.");
        } else if(value === "0") {
            if(this.state.total === "") {
                this.setState({
                    total: this.state.total
                })
            } else if(this.state.total.charAt(0) !== value) {
                this.setState({
                    total: this.state.total + value
                })
            }
        } else if(value === ".") {
            if(this.state.total === "") {
                this.setState({
                    total: "0."
                })
            } else if(this.state.total.match(/(\D)$/) && this.state.total.split(this.state.total.length-3, this.state.total-1) !== "0.") {
                this.setState({
                    total: this.state.total + "0" + value
                })
            } else if(last.includes(".") ) {
                this.setState({
                    total: this.state.total
                })
            } else {
                this.setState({
                    total: this.state.total + value
                })
            }
        } else if(value === "/" || value === "*" || value === "-" || value === "+") {
            let lastInput = this.state.total.split("")[this.state.total.length-1];
            
            
            if(this.state.total === "") {
                this.setState({
                    total: "0" + value
                })
            } else if(lastInput === "/" || lastInput === "*" || lastInput === "-" || lastInput === "+") {
                this.setState({
                    total: this.state.total.slice(0, -1) + value
                })
            } else {
                this.setState({
                    total: this.state.total + value
                })
            }
        } else {
            this.setState({
                total: this.state.total + value
            })
        }
    }

    handleClick = (event) => {
        const value = event.target.getAttribute("value");

        this.handleValue(value);
    }

    // Keyboard presses
    handleKeyDown = (event) => {
        const symbols = ["0","1","2","3","4","5","6","7","8","9","/","-","*","+","."];
        if(symbols.includes(event.key) ) {
            this.handleValue(event.key);
        } else if(event.key === ",") { // On a Swedish keyboard, the "." key on a numpad is a ","
            this.handleValue(".");
        } else if(event.key === "Enter") {
            this.calculate();
        } else if(event.key === "c") {
            this.reset();
        } else if(event.key === "Backspace") {
            this.setState({
                total: this.state.total.slice(0, this.state.total.length-1)
            })
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
            <div>
                <Header />
                <h4 id="display">{this.state.total !== "" ? this.state.total : "0"}</h4>
                <Screen
                    handleClick={this.handleClick}
                    value={this.value}
                    id={this.id}
                    onKeyDown={this.onKeyDown}
                />
                <Footer />
            </div>
        )
    }
}

export default Calculator;