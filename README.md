# metalsmith-more

A [Metalsmith](http://metalsmith.io/) plugin to store the content before
`<!--more-->` in HTML files, akin to WordPress' More tag.

This plugin processes HTML files and adds a `less` key with the part of `contents`
preceding the `<!--more-->` tag.  The file extension to filter by, tag to truncate on,
and key to store content in are customizable; see Options below.

## Installation

```
$ npm install metalsmith-more
```

## CLI Usage

Add the `metalsmith-more` key to your `metalsmith.json` file:

```js
{
	"plugins": {
		"metalsmith-more": true
	}
}
```

## JavaScript Usage

```js
var more = require('metalsmith-more');
metalsmith.use(more());
```

## Options

`metalsmith-more` can be used with zero configuration, but it also supports the
following options to customize its behavior:

* `ext` - Extension to match against when examining files to operate on; default is `html`
* `regexp` - Regular expression to truncate against; default is `/\s*<!--\s*more\s*-->/`.
  May also be specified as a string, which a `RegExp` will be constructed from.
* `key` - Key to store truncated content in; default is `less`
* `alwaysAddKey` - whether to always add the specified key even if a file contains no match to `regexp`;
  default is `false`.
  * When `false`, any file with no match will not contain the specified key.
  * When `true`, any file with no match will have the specified key's value set
    equal to the file's `contents`.
* `replace` - Optional. String replaces the matched comment in page content;
  i.e. `<a id="more"></a>`

These options can be specified in an object passed to the plugin function or
assigned to the `metalsmith-more` key in `metalsmith.json`.

## License

MIT
