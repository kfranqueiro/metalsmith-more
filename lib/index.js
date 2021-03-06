var extname = require('path').extname;
var defaults = {
	ext: 'html',
	regexp: /\s*<!--\s*more\s*-->/,
	key: 'less'
};

module.exports = function (options) {
	options = options || {};
	var ext = options.ext || defaults.ext,
		regexp = options.regexp || defaults.regexp,
		key = options.key || defaults.key;

	ext = ext[0] === '.' ? ext : '.' + ext;
	if (typeof regexp === 'string') {
		regexp = new RegExp(regexp);
	}

	return function (files, metalsmith, done) {
		Object.keys(files).forEach(function (file) {
			var contents = files[file].contents,
				contentsString = contents.toString(),
				index;

			if (extname(file) !== ext || !contents) {
				return;
			}

			index = contentsString.search(regexp);
			if (index > -1) {
				files[file][key] = contents.slice(0, Buffer.byteLength(contentsString.slice(0, index)));
			}
			else if (options.alwaysAddKey) {
				files[file][key] = contents;
			}
		});
		done();
	};
};

module.exports.defaults = defaults;
