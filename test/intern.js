define({
	// Configuration options for the module loader; any AMD configuration options supported by the Dojo loader can be
	// used here
	loader: {
		// Packages that should be registered with the loader in each testing environment
		packages: [ { name: 'metalsmith-more', location: '.' } ]
	},

	// Non-functional test suite(s) to run in each browser
	suites: [ 'metalsmith-more/test/index' ],

	// A regular expression matching URLs to files that should not be included in code coverage analysis
	excludeInstrumentation: /^(?:test|node_modules)\//
});