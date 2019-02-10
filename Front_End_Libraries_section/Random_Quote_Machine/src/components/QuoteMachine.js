import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import authorQuotes from "./quotes";

const quotes = Object.values(authorQuotes).map(ele => ele);
const quoteNum = Math.floor(Math.random() * authorQuotes.length);
const quote = quotes[quoteNum].quote;
const author = quotes[quoteNum].author;

class QuoteMachine extends React.Component {
  constructor() {
    super()
    this.state = {
      quote: quote,
      author: author
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    const newQuoteNum = Math.floor(Math.random() * authorQuotes.length);
    // Add if statement to prevent the same quote twice in a row
    const newQuote = quotes[newQuoteNum].quote;
    const newAuthor = quotes[newQuoteNum].author;
    
    this.setState({
      quote: newQuote,
      author: newAuthor
    })
  }

  render() {
    return(
      <div className="container">
        <Header />
        <div id="quote-box">
          <h1 id="text">"{this.state.quote}"</h1>
          <h3 id="author">- {this.state.author}</h3>
          <button
            id="new-quote"
            onClick={this.handleClick}
          >Fetch me a new quote!</button>
          <a
            id="tweet-quote"
            href={`http://www.twitter.com/intent/tweet?text=${this.state.quote} - ${this.state.author}`} target="_blank"
          >Let me tweet this quote</a>
        </div>
        <Footer />
      </div>
    )
  }
}

export default QuoteMachine;