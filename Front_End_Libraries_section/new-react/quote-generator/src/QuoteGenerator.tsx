import React, { FC, useState, useEffect } from "react";
import quotes from "./quotes";

const QuoteGenerator: FC = () => {
  const [quote, setQuote] = useState<number>();

  const generateQuote = (): void => {
    const newQuoteNumber = Math.floor(Math.random() * quotes.length);

    setQuote(newQuoteNumber);
  };

  useEffect(() => {
    generateQuote();
  }, []);

  return (
    <div id="quote-box">
      {quote && (
        <>
          <h2 id="text">{quotes[quote].quote}</h2>
          <h3 id="author">{quotes[quote].author}</h3>
        </>
      )}
      <div>
        <button id="new-quote" onClick={generateQuote}>
          Get a new quote
        </button>
        <a
          id="tweet-quote"
          target="_blank"
          rel="noopener noreferrer"
          href="https://twitter.com/intent/tweet"
        >
          Tweet the quote
        </a>
      </div>
    </div>
  );
};

export default QuoteGenerator;
