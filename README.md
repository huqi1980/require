# require

require is a library for asynchronous reference to Javascript, html, css.

[![Build Status](https://travis-ci.com/huqi1980/require.svg?branch=master)](https://travis-ci.org/huqi1980/require)
[![codecov](https://codecov.io/gh/huqi1980/require/branch/master/graph/badge.svg)](https://codecov.io/gh/huqi1980/require)
[![MIT](https://img.shields.io/npm/l/tm_require.svg)](https://github.com/huqi1980/require/blob/master/LICENSE)
[![size](https://img.shields.io/github/languages/code-size/huqi1980/require.svg)](https://github.com/huqi1980/require)
[![V](https://img.shields.io/npm/v/tm_require.svg)](https://www.npmjs.com/package/tm_require)
[![commit](https://img.shields.io/github/last-commit/huqi1980/require.svg)](https://github.com/huqi1980/require)


---

## Building & Testing

Current build process uses Gulp, and Karma related repos.

**build**

	$ npm i -g gulp-cli karma-cli codecov
	$ npm install
	$ gulp                # or
	$ gulp build          # to only build the source, or
	$ gulp demo           # to only build the demo

**test**

	$ npm run test

## Sample

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