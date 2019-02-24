# What I learned by doing this project
I've learnt a ton by doing this and I've also gained a new kind of respect for people who make electronical calculators for advanced math. It really can't be easy doing. Anyway, I learned:
* The most major breakthrough came through discovering eval(). I spent quite a few hours on trying to figure out how to do the calculations and in what order of operations, before one of my Google searches showed me the eval() function
* While adding the ability to use key strokes with the calculator, I learned that in React you don't actually have to go the long way around through getCharCode(), because you can simple use "event.key" to find the keystroke.  
** Somewhat embarassingly, I learned that you can hit the delete-button to clear the screen on a desktop calculator... Although I chose to use 'C' for "Clear" since it kinda makes more sense in my opinion - and it's my app!
* A lot about how to use slice() in different ways to produce different results
* I used regex for real in a project for the first time. I've spent some time learning some more basic regular expressions, mostly to solve algorithms, but it was quite cool to make use of that knowledge in this app
* Although I had learned how to use CSS grid before, I feel like I got to extend that knowledge a bit by doing this project
* I got to use the alert() function for the first time since like the first day I started learning JS
* The cheer complexity in a calculator and the amount of ways the user could potentially do things wrong, especially relating to the decimal point and when you press and operator followed by the equals sign
** Amidst some frustrations about the decimal point I started to google to find hints for solutions to the issue and I realised that most JavaScript calculators out there don't account for these issues at all... and then I managed to get my regex match() to work on my own. :-)

### Create React App
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.
