var extname = require('path').extname;

module.exports = function (options) {
	options = options || {};
	var ext = options.ext || 'html',
		regexp = options.regexp || /\s*<!--\s*more\s*-->/,
		key = options.key || 'less';

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
			files[file][key] = index > -1 ?
				contents.slice(0, Buffer.byteLength(contentsString.slice(0, index))) :
				contents;
		});
		done();
	};
};