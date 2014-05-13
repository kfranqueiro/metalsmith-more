define([
	'intern!tdd',
	'intern/chai!assert',
	'intern/dojo/node!fs',
	'intern/dojo/node!path',
	'intern/dojo/node!metalsmith',
	'intern/dojo/node!metalsmith-more',
	'intern/dojo/node!rimraf'
], function (test, assert, fs, path, metalsmith, more, rimraf) {
	function assertResults(expectedDir, files, moreOptions) {
		var expectedFiles = fs.readdirSync(expectedDir),
			key = moreOptions && moreOptions.key || 'less';

		expectedFiles.forEach(function (file) {
			assert.strictEqual(files[file][key].toString('utf8'),
				fs.readFileSync(path.resolve(expectedDir, file), 'utf8'));
		});
	}

	function createTest(dir, moreOptions, additionalAssertions) {
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

	test.suite('metalsmith-more', function () {
		test.afterEach(function () {
			// Remove build folders after each test
			['defaults', 'custom-tag', 'custom-ext'].forEach(function (dir) {
				rimraf.sync(path.resolve('test', 'fixtures', dir, 'build'));
			});
		});

		test.test('default behavior', createTest('defaults'));
		test.test('custom key', createTest('defaults', { key: 'test' }));
		test.test('custom regexp', createTest('custom-tag', { regexp: /\s*<!--test-->/ }));
		test.test('custom regexp as string', createTest('custom-tag', { regexp: '\\s*<!--test-->' }));
		test.test('custom ext',
			createTest('custom-ext', { ext: 'htm' }, customExtAssertions));
		test.test('custom ext (with period)',
			createTest('custom-ext', { ext: '.htm' }, customExtAssertions));

		// TODO: add fixtures and tests for custom ext and regexp
	});
});