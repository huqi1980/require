# require

require is a library for asynchronous reference to Javascript, html, css.

[![Build Status](https://travis-ci.com/huqi1980/require.svg?branch=master)](https://travis-ci.org/huqi1980/require)
[![codecov](https://codecov.io/gh/huqi1980/require/branch/master/graph/badge.svg)](https://codecov.io/gh/huqi1980/require)
[![MIT](https://img.shields.io/npm/l/tm_require.svg)](https://github.com/huqi1980/require/blob/master/LICENSE)
[![size](https://img.shields.io/github/languages/code-size/huqi1980/require.svg)](https://github.com/huqi1980/require)
[![V](https://img.shields.io/npm/v/tm_require.svg)](https://www.npmjs.com/package/tm_require)
[![commit](https://img.shields.io/github/last-commit/huqi1980/require.svg)](https://github.com/huqi1980/require)


---

# Building & Testing

Current build process uses Gulp, and Karma related repos.

**build**

	$ npm i -g gulp-cli karma-cli codecov
	$ npm install
	$ gulp                # or
	$ gulp build          # to only build the source, or
	$ gulp demo           # to only build the demo

**test**

	$ npm run test

# Sample

add "script" tag in your html file:

```html
<script src="require.js"></script>
```

require a javascript modue:

```js
require.js("jquery.js", function(modules){
    //your code
});
```

require a css modue:

```js
//load css for document
require.css("style.css", function(styles){
    //your code
});

//load css for dom
require.css("style.css", {dom, $("content")}, function(styles){
    //your code
});

//load css with dom
node.loadCss("style.css", function(styles){
    //your code
});
```

remove a css modue:

```js
require.css.remove("style.css");
```

require a html modue:

```js
//load html for dom
require.css("list.html", {dom, $("content")}, function(htmls){
    //your code
});

//load html with dom
node.loadHtml("list.html", function(htmls){
    //your code
});
```

require js,html,css modue:

```js
require({
    "html": "test.html",
    "css": "test.css",
    "js": "test.js"
}, function(htmls, styles, modules){
    //your code
});
```
# API #


**require.js(modules, [options, callback])**

require one or more javascript files.

**parameters**

***modules***：`string` or `array` the javascript path

***options***: `object`

> *-noCache*: `boolean` default is `false`

> *-reload*: `boolean` default is `false`

> *-doc*: `HTMLDocument` default is `document`


***callback***: `function` this Callback function, Receives the modules array as arguments.

> *-modules[i].module*: this javascript path

> *-modules[i].id*: a uuid for this module

**example**

```js
require.js("jquery.js", function(modules){
    //your code
});

require.js(["code1.js", "code2.js"], {"noCache": true}, function(modules){
    //your code
});
```

----------


**require.css(modules, [options, callback])**

require one or more css files.

**parameters**

***modules***：`string` or `array` the css path

***options***: `object`

> *-noCache*: `boolean` default is `false`

> *-reload*: `boolean` default is `false`

> *-dom*: `HTMLElement`or `string` or `array` default is `null`, this value can be HTMLElement or css selector. If this value is supplied, css will take effect on this dom object.

> *-doc*: `HTMLDocument` default is `document`


***callback***: `function` this Callback function, Receives the modules array as arguments.

> *-modules[i].module*: this css path

> *-modules[i].id*: a uuid for this css module

> *-modules[i].style*: a HTMLStyleElement

**example**

```js
require.css("style.css", function(modules){
    //your code
});

require.css(["style1.css", "style2.css"], {"dom": [".content", ".list", document.getElementById("id")]}, function(modules){
    //your code
});


document.getElementById("id").loadCss(["style1.css", "style2.css"], function(){
	//your code
});
```

----------

**require.css.remove(modules)**

remove a css (required by "require.css") from document

**parameters**

***module***：`string` the css path, same as require.css; or thie css module uuid (received in the callback function when require.css).

----------

**require.html(modules, [options, callback])**

require one or more html files.

**parameters**

***modules***：`string` or `array` the html path

***options***: `object`

> *-noCache*: `boolean` default is `false`

> *-reload*: `boolean` default is `false`

> *-dom*: `HTMLElement`or `string` or `array` default is `null`, this value can be HTMLElement or css selector. If this value is supplied, Html content will be append to these doms

> *-doc*: `HTMLDocument` default is `document`

> *-position*: `string` default is `beforeend`. where this html appended. this value can be `beforebegin` `afterbegin` `beforeend` `afterend`


***callback***: `function` this Callback function, Receives the modules array as arguments.

> *-modules[i].module*: this html path

> *-modules[i].id*: a uuid for this html module

> *-modules[i].data*: thie html text

**example**

```js
require.html("tp.html", function(modules){
    //your code
});

require.html(["tp1.html", "tp1.html"], {"dom": [".content", ".list", document.getElementById("id")]}, function(modules){
    //your code
});

document.getElementById("id").loadHtml(["tp1.html", "tp2.html"], function(){
	//your code
});
```

----------

**require(modules, [options, callback])**

require one or more html, css, javascript files.

**parameters**

***modules***：`object` the html, css, javascript path.

> *-html*: `string` or `array` the html path, like require.html modules

> *-css*: `string` or `array` the css path, like require.css modules

> *-js*: `string` or `array` the javascript path, like require.js modules


***options***: `object` see require.html options

***callback***: `function` this Callback function, Receives the htmls array, styles array and modules array as arguments.

> *-htmls*: see require.html callback

> *-styles*: see require.css callback

> *-modules*: see require.js callback

# License

[MIT License](https://en.wikipedia.org/wiki/MIT_License)