import React from "react";

function Screen(props) {
    return(
        <div className="container">
            <button onClick={props.handleClick} id="equals" value="=">=</button>
            <button onClick={props.handleClick} id="zero"value={0}>0</button>
            <button onClick={props.handleClick} id="one" value={1}>1</button>
            <button onClick={props.handleClick} id="two" value={2}>2</button>
            <button onClick={props.handleClick} id="three" value={3}>3</button>
            <button onClick={props.handleClick} id="four" value={4}>4</button>
            <button onClick={props.handleClick} id="five" value={5}>5</button>
            <button onClick={props.handleClick} id="six" value={6}>6</button>
            <button onClick={props.handleClick} id="seven" value={7}>7</button>
            <button onClick={props.handleClick} id="eight" value={8}>8</button>
            <button onClick={props.handleClick} id="nine" value={9}>9</button>
            <button onClick={props.handleClick} id="add" value="+">+</button>
            <button onClick={props.handleClick} id="subtract" value="-">-</button>
            <button onClick={props.handleClick} id="multiply" value="*">*</button>
            <button onClick={props.handleClick} id="divide" value="/">/</button>
            <button onClick={props.handleClick} id="decimal" value=".">.</button>
            <button onClick={props.handleClick} id="clear" value="C">C</button>
        </div>
    )
}

export default Screen;