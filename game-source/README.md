# Getting started
Commands to get you started:
- `npm install`: install all modules
- `npm start`: transpile SASS, bundle up JS, and start a dev server and watch for changes, which triggers rebuild and browser reload

Head over to localhost:4000 to view website

Please keep in mind that this will be a static page, so don't rely on node packages, and don't make server-side logic, etc... 

# Tech stack
- [SASS]
- [Browserify]

# Components

PIXI js     - general animations, sprites and graphics. Read documentation and google "Learning Pixi js Github"

PIXI-tween  - abstraction of the fairly low level animations in pixi. Has the typical tween APIs.

Machina js  - finite state machines. It's important the manage the large number of states our game can be in. Motivation and explanation of state machines [here](https://codeincomplete.com/posts/javascript-game-foundations-state-management/)

PIXI.utils.EventEmitter - you can send events between completely independent components (i.e. when person is dragged to a desk, it can emit an event, which the office object listens to and increases counter for the number of people in office if event comes in)

ES6 style modules       - to manage the diff files just makes sure to import and export whatever you need, no need to put them in script tags. Libraries included in script tags are still in the global name space.

[Dumb object diagram](https://docs.google.com/drawings/d/1150vTQ1k2IRiph14dX6WhjQmsuUhx7Sej9fgFJ7gKIg/edit?usp=sharing)

# Responsive Pixi
### UV Space
The first step towards a responsive pixi.js application is to cast coordinates and measurements in relative terms. A useful way to think of this is a metaphor of a UV space. UV coordinates are normalized and range between `0` and `1`. 
<br />

![UV Space](https://learn.foundry.com/nuke/8.0/content/resources/images/ug_images/uv_coordinates.png)
<br />
<br />
If we think of a full-screen canvas in terms of UV coordinates, then:
- `UV(0,0)` is the origin of the canvas, i.e. top left corner
- `UV(0.5,0.5)` is the center of the screen
- `UV(1,1)` is the bottom right of the screen

Similarly, UV coordinates can be used for measurements:
- `UV(1)` means an element spans the full width of the canvas
- `UV(0.5)` means the element's width is 1/2 of the canvas width etc.

### Converting UV coordinates to screen pixels
In the javascript utilities file (`js/common/utils.js`), there is a function `uv2px`, which accepts uv coordinates ([0-1]), and outputs the corresponding values in screen pixels based on Pixi app dimensions. <br />
Possible inputs:
- object (`{x: 0.2, y: 0.1}`)
- array (`[0.4, 0.76]`)
- single value and axis `'w' for width, 'h' for height: e.g. (0.5, 'w')`)
```js
import { uv2px } from './js/common/utils.js';

// rectangle is full width of the screen
this.drawRect(0, 0, uv2px(1,'w'), 40);

// start drawing at the center of the screen
var coorObj = uv2px({x: 0.5, y: 0.5}); // if you prefer objects
var coorArray = uv2px([0.5,0.5]); // if you prefer arrays

this.drawRect(coorObj.x, coorObj.y, 50, 50); // this works
this.drawRect(coorArray[0], coorArray[1], 50, 50); // ...this works too
this.drawRect(uv2px(0.5,'w'), uv2px(0.5,'h'), 50, 50); // ...this is also good
```

#### Using uv2px with clamp
Sometimes, blindly resizing an element based on canvas size leads to awkward results (e.g. you test a text box on a small screen and then it looks huge on a big screen). In delicate resizing cases, you can use the `clamp` function to clamp a value between a minimum and a maximum.
- `clamp(value, minimumValue, maximumValue)`
```js
// make the rectangle's size half of the screen's width, but only if it's between 200px and 500px wide
import { clamp } from '.js/common/utils.js';

this.drawRect(0, 0, clamp(uv2px(0.5, 'w', 200, 500), 100);
```

# Javascript

## Browserify
ES6 import/export statements do not work natively in the browser, so you need an external library to do a bit of magic and allow you to use javascript modules with import/export statements. One of such libraries is [Browserify](http://browserify.org/), which bundles up all of your dependendies and allows you to use modules in the browser. Bundling all module dependencies means that, in the end, you're left with one single javascript file containing all of your javascript (libs + custom code). When the page loads, you could use hundreds of javascript libraries, but the browser will only have to make one HTTP call to load your code, which results in better performance. Along with browserify, you also use a package called [babelify](https://github.com/babel/babelify), which transpiles ES6 code to ES5 that works in all modern browsers.
<br />


```pug 
html
  head

  body

    script(src="dist/our-bundled-code.js")
```

## ES6 imports/exports with Browserify
ES6 ships with a handful of very useful features, one of the main ones being `import/export` statements. Previously, we would have to import all third-party libraries globally in the html file.
```pug
html
  head
    ...
  body
    ...
    script(src="jquery...")
    script(src="tween...")
    script(src="lodash...")
```

With `import/export` statements, however, you can simply install javascript packages with `npm install` (e.g. `npm install jquery`) and also import the libraries directly into your modules. In doing so you make your javascript code easier to follow and understand.
```js
// my-animation-script.js
import "my-animation-library"

animate();
```
Of course, if you want to use the package globally, you can just include it in the `main.js` file
```js
// main.js
import "babel/polyfill" // the library will be used globally
import {app} from "./app-module.js"
import {module1} from "./module.js"

app();
```

## Styling: Sass + BEM
[Sass](https://sass-lang.com/) is a CSS extension language that allows you to write modular CSS code. Sass ships with a bunch of code-resembling features, such as variables, key-value based lists, functions, reusable styling blocks, and more. Sass reduces repetition and confusion in styling elements, which is crucial in developing and maintaining bigger projects. Sass becomes even more powerful with [BEM](http://getbem.com/) a CSS naming conventions that encourages modulular styling and basically tries to remove weird styling errors that often happen because of style overwrites. Just like Sass, BEM speeds up the development process and makes our styling both scalable and maintainable.
<br />
