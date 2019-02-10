import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Screen from "./Screen";

class Calculator extends React.Component {
    constructor() {
        super()
        this.state = {
            total: "",
            expression: []
        }
    }

    handleClick = (event) => {
        const value = event.target.getAttribute("value")
        let currStr = this.state.total
        let regex = /\D/;
        let splitStr = currStr.toString().split(regex);
        console.log(splitStr);

        if(value === ".") {
            if(this.state.total === "") {
                this.setState({
                    total: "0."
                })
            } else if(splitStr[splitStr.length-1].includes(".") ) {
                this.setState({
                    total: this.state.total
                })
            } else {
                this.setState({
                    total: this.state.total + value
                })
            }
        } else if(value === "C") {
            this.setState({
                total: ""
            })
        } else if(parseInt(value) === 0) {
            if(this.state.total === "" || this.state.total === 0) {
                this.setState({
                    total: parseInt(value)
                })
            } else {
                this.setState({
                    total: this.state.total + value
                })
            }
        } else if(!isNaN(value) ) {
            if(this.state.total === 0) {
                this.setState({
                    total: value
                })
            } else {
                this.setState({
                    total: this.state.total + value
                })
            }
        } else if(isNaN(value) ) {
            if(value !== "=" && this.state.expression !== "") {
                if(value === "+") {
                    this.setState({
                        expression: this.state.expression+this.state.total,
                        total: this.state.total + value
                    })
                } else if(value === "-") {
                    this.setState({
                        expression: this.state.expression-this.state.total,
                        total: this.state.total + value
                    })
                } else if(value === "*") {
                    this.setState({
                        expression: this.state.expression*this.state.total,
                        total: this.state.total + value
                    })
                } else if(value === "/") {
                    this.setState({
                        expression: this.state.expression/this.state.total,
                        total: this.state.total + value
                    })
                }
            } else if(value !== "=" && this.state.expression === "") {
                this.setState({
                    expression: this.state.total,
                    total: ""
                })
            } else if(value === "=") {
                splitStr.forEach(num => parseFloat(num) );
                console.log(splitStr)

                if(currStr.includes("+") ) {
                    let sum = splitStr.reduce((a,b) => parseInt(a)+parseInt(b) )
                    this.setState({
                        total: sum
                    })
                } else if(currStr.includes("-") ) {
                    let sum = splitStr.reduce((a,b) => parseInt(a)-parseInt(b) )
                    this.setState({
                        total: sum
                    })
                } else if(currStr.includes("*") ) {
                    let sum = splitStr.reduce((a,b) => parseInt(a)*parseInt(b) )
                    this.setState({
                        total: sum
                    })
                } else if(currStr.includes("/") ) {
                    let sum = splitStr.reduce((a,b) => parseInt(a)/parseInt(b) )
                    this.setState({
                        total: sum
                    })
                }
            }
        } else {
            console.log("it no work")
            console.log(typeof parseInt(value) )
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