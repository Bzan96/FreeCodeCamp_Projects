import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Screen from "./Screen";

let hasDecimal = false;

class Calculator extends React.Component {
    constructor() {
        super()
        this.state = {
            total: ""
        }
    }

    handleClick = (event) => {
        const value = event.target.getAttribute("value");

        this.handleValue(value);
    }

    handleValue = (value) => {
        if(value === "=") {
            this.calculate();
        } else if(value === "C") {
            this.reset();
        } else if(this.state.total.length >= 15) {
            this.setState({
                total: this.state.total
            })
            alert("The calculator doesn't allow more characters, sorry.")
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
            if(!hasDecimal) {
                hasDecimal = true;
                this.setState({
                    total: this.state.total + value
                })
            }
        } else if(value === "/" || value === "*" || value === "-" || value === "+") {
            let lastInput = this.state.total.split("")[this.state.total.length - 1];
            let lookBack = this.state.total.split("")[this.state.total.length - 2];
            hasDecimal = false;

            if(this.state.total === "") {
                this.setState({
                    total: "0" + value
                })
            } else if(lastInput === "/" || lastInput === "*" || lastInput === "-" || lastInput === "+") {
                if(value !== "-" && lastInput !== "-") {
                    this.setState({
                        total: this.state.total.slice(0, -1) + value
                    })
                } else if(value !== "-" && lastInput === "-" && !lookBack.match(/\D/) ) {
                    this.setState({
                        total: this.state.total + value
                    })
                } else if(value !== "-" && lastInput === "-" && lookBack.match(/\D/) ) {
                    this.setState({
                        total: this.state.total.slice(0, this.state.total.length-2) + value
                    })
                } else if(value === "-" && lastInput !== "-") {
                    this.setState({
                        total: this.state.total + value
                    })
                }
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

    reset = () => {
        hasDecimal = false;
        this.setState({
            total: ""
        })
    }

    calculate = () => {
        let result = "";
        let decimals = "";

        if(this.state.total[this.state.total.length-1].match(/\D/) ) {
            result = (eval(this.state.total.slice(0, this.state.total.length-1) ) || "") + "";
            decimals = result.toString().split(".")[1];
        } else {
            result = (eval(this.state.total) || "") + "";
            decimals = result.toString().split(".")[1];
        }

        try {
            if(result.includes(".") && decimals.length > 4) {
                let cutOff = result.toString().split(".")[0] + "." + decimals.slice(0, 4);
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

    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown);
    }

    handleKeyDown = (event) => {
        const symbols = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "/", "-", "*", "+", "."];

        if(symbols.includes(event.key) ) {
            this.handleValue(event.key);
        } else if(event.key === ",") {
            this.handleValue(".");
        } else if(event.key === "Enter") {
            this.calculate();
        } else if(event.key === "c") {
            this.reset();
        } else if(event.key === "Backspace") {
            this.setState({
                total: this.state.total.slice(0, this.state.total.length - 1)
            })
        }
    }

    render() {
        return (
            <div>
                <Header />
                <h4 id="display">{ this.state.total !== "" ? this.state.total : "0" }</h4>
                <Screen
                    handleClick={ this.handleClick }
                    value={ this.value }
                    id={ this.id }
                    onKeyDown={ this.onKeyDown }
                />
                <Footer />
            </div>
        )
    }
}

export default Calculator;