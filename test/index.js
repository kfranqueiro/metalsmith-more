define([
	'intern!tdd',
	'intern/chai!assert',
	'intern/dojo/node!fs',
	'intern/dojo/node!path',
	'intern/dojo/node!metalsmith',
	'intern/dojo/node!metalsmith-more',
	'intern/dojo/node!rimraf'
], function (test, assert, fs, path, metalsmith, more, rimraf) {
	var customTagRx = /\s*<!--test-->/;

	function assertResults(expectedDir, files, moreOptions) {
		moreOptions = moreOptions || {};
		var expectedFiles = fs.readdirSync(expectedDir),
			key = moreOptions.key || more.defaults.key;

		expectedFiles.forEach(function (file) {
			var expectedText = fs.readFileSync(path.resolve(expectedDir, file), 'utf8'),
				regexp = 'regexp' in moreOptions ? customTagRx : more.defaults.regexp;

			// To allow using the same fixtures for both alwaysAddKey values,
			// determine which assertion to run based on whether tag appears in contents
			if (regexp.test(files[file].contents) || moreOptions.alwaysAddKey) {
				assert.strictEqual(files[file][key].toString('utf8'),
					expectedText);
			}
			else {
				assert.isFalse(key in files[file],
					'key should not exist if tag not present and alwaysAddKey not true');
			}
		});
	}

	function createTest(dir, moreOptions, alwaysAddKey, additionalAssertions) {
		if (typeof alwaysAddKey !== 'undefined') {
			moreOptions.alwaysAddKey = alwaysAddKey;
		}
		return function () {
			var dfd = this.async(1000);
			metalsmith('test/fixtures/' + dir).use(more(moreOptions)).build(dfd.callback(function (error, files) {
				if (error) {
					return dfd.reject(error);
				}

				assertResults('test/fixtures/' + dir + '/expected', files, moreOptions);

				if (additionalAssertions) {
					additionalAssertions(files);
				}
			}));
		};
	}

	function customExtAssertions(files) {
		assert.isFalse('less' in files['hello.html']);
	}

	function createSuite(alwaysAddKey) {
		test.afterEach(function () {
			// Remove build folders after each test
			['defaults', 'custom-tag', 'custom-ext'].forEach(function (dir) {
				rimraf.sync(path.resolve('test', 'fixtures', dir, 'build'));
			});
		});

		test.test('defaults', createTest('defaults', {}, alwaysAddKey));
		test.test('custom key', createTest('defaults', { key: 'test' }, alwaysAddKey));
		test.test('custom regexp',
			createTest('custom-tag', { regexp: customTagRx }, alwaysAddKey));
		test.test('custom regexp as string',
			createTest('custom-tag', { regexp: customTagRx.toString().slice(1, -1) }, alwaysAddKey));
		test.test('custom ext',
			createTest('custom-ext', { ext: 'htm' }, alwaysAddKey, customExtAssertions));
		test.test('custom ext (with period)',
			createTest('custom-ext', { ext: '.htm' }, alwaysAddKey, customExtAssertions));
		test.test('utf8 content', createTest('utf8', {}, alwaysAddKey));
	}

	test.suite('metalsmith-more', function () {
		test.test('defaults (no options)', createTest('defaults'));
		createSuite(false);
	});

	test.suite('metalsmith-more (alwaysAddKey: true)', function () {
		createSuite(true);
	});
});
