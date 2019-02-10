import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Screen from "./Screen";

/** ToDo:
SEMI-FIXED, except you can only use one decimal ever! =^_^=    
3. Prevent multiple decimal point in a row (user story 11)
ToDo: Add a clause to handle the total ending with +*-/
*/

class Calculator extends React.Component {
    constructor() {
        super()
        this.state = {
            total: ""
        }
    }

    calculate = () => {
        // Eval is an unsafe function that shouldn't be used.
        // It's "safe" in this case because they user can't input custom strings.
        let result = (eval(this.state.total) || "" ) + ""
        let decimals = result.toString().split(".")[1]
        console.log(result)
        console.log(typeof result)
            
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

    handleClick = (event) => {
        const value = event.target.getAttribute("value")
        let lastSegment = this.state.total.slice(-this.state.total.indexOf( ("/" || "*" || "-" || "+") ), this.state.total.length)

        if(value === "=") {
            this.calculate()
        } else if(value === "C") {
            this.reset()
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
            /* split the segment
                if the last/current segment contains a decimal point, ignore the last input
                if it doesn't, allow one decimal point
                allow one decimal point per split segment
                if the last input is /*+- and value is . insert a 0 first */
            // const regex = /\D(!.)/;

            let splitTot = this.state.total.split("/" || "*" || "-" || "+");
            // let lastSegment = splitTot[splitTot.length-1];

            console.log(this.state.total.slice(-this.state.total.indexOf( ("/" || "*" || "-" || "+") ), this.state.total.length) )
            console.log(splitTot);
            console.log(lastSegment)
            console.log(lastSegment.split("") )
            
            if(this.state.total === "") {
                this.setState({
                    total: "0."
                })
            } else if(lastSegment === "") {
                this.setState({
                    total: this.state.total + "0" + value
                })
                // Doesn't register
            } else if(!lastSegment.includes(".") ) {
                this.setState({
                    total: this.state.total + value
                })
            } else if(lastSegment.includes(".") ) {
                this.setState({
                    total: this.state.total
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

    render() {
        return(
            <div>
                <Header />
                <h4 id="display">{this.state.total !== "" ? this.state.total : "0"}</h4>
                <Screen
                    handleClick={this.handleClick}
                    value={this.value}
                    id={this.id}
                />
                <Footer />
            </div>
        )
    }
}

export default Calculator;