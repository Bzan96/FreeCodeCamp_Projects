document.getElementById("new-quote").onmouseover = function() {newMouseOver()};
document.getElementById("new-quote").onmouseout = function() {mouseOut()};
document.getElementById("new-quote").onclick = function() {getQuote()};

document.getElementById("tweet-link").onmouseover = function() {tweetMouseOver()};
document.getElementById("tweet-link").onmouseout = function() {mouseOut()};

window.onload = function() {getQuote()};

function newMouseOver() {
    document.getElementById("clickMeBorder").style.border = "3px double green";
}

function tweetMouseOver() {
    document.getElementById("tweet-link").style.textDecoration = "underline";
}

function mouseOut() {
    document.getElementById("clickMeBorder").style.border = "none";
    document.getElementById("tweet-link").style.textDecoration = "none";
}

function getQuote() {
    let selection = Math.floor(Math.random() * Math.floor(authorQuotes.length) );
    document.getElementById("text").innerHTML = authorQuotes[selection].quote;
    document.getElementById("author").innerHTML = "- " + authorQuotes[selection].author;
}

const authorQuotes = [
    {author:"Paul Hoffman", quote:"To be sociable is a risky thing, even fatal, because it means being in contact with people, most of whom are dull perverse and ignorant and are really only with you because they cannot stand their own company. Most people bore themselves and greet you not as a true friend, but like a dancing dog or some half with actor with a fund of amusing stories."},
    {author:"Wayne Gretzky", quote:"You miss 100% of the shots you don't take."},
    {author:"Julius Caesar", quote:"Alea Iacta Est!"},
    {author:"Julius Caesar", quote:"Veni, Vedi, Vici"},
    {author:"Mohammed Ali", quote:"It's just a job. Grass grows, birds fly, waves pound the sand. I beat people up."},
    {author:"Tony Robbins", quote:"If you're not growing, you're dying."},
    {author:"Augustus", quote:"Livia, remember our life together; and now, farewell!"},
    {author:"Cato the Elder", quote:"Carthage must be destroyed!"},
    {author:"William Shakespeare", quote:"Et tu, Brute?"},
    {author:"Polybios", quote:"Even the bravest of men are startled by sudden terrors."},
    {author:"Isabella Lövin", quote:"Jag förstår inte varför man vill avsätta en väl fungerande regering."},
    {author:"Warren Buffett", quote:"Rule No.1: Never lose money."},
    {author:"John Sonmez", quote:"Be a fucking bulldog."},
    {author:"John C. Bogle", quote:"Time is your friend. Impulse is your enemy."},
    {author:"Ray Dalio", quote:"If you have the power to see things through somebody else's eyes, it's like going from black and white to color or two dimensions to three dimensions."},
]